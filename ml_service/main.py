from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib
import shap
import os


BASE = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE, 'models')


time_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        'time_overrun_model.pkl'
    )
)


cost_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        'cost_overrun_model.pkl'
    )
)


FEATURES = [
    'sector',
    'implementing_agency',
    'original_commissioning_month',
    'original_commissioning_year',
    'original_cost_crore',
    'planned_duration_months',
    'manpower',
    'project_scale',
    'project_complexity',
    'land_acquisition_risk',
    'clearance_complexity',
    'procurement_complexity',
    'progress_pct'
]


class Payload(BaseModel):

    sector: str

    implementing_agency: str

    original_commissioning_month: int = Field(
        ge=1,
        le=12
    )

    original_commissioning_year: int = Field(
        ge=1950,
        le=2100
    )

    original_cost_crore: float = Field(
        gt=0
    )

    planned_duration_months: int = Field(
        gt=0,
        le=240
    )

    manpower: int = Field(
        gt=0,
        le=10000
    )

    project_scale: str

    project_complexity: int = Field(
        ge=1,
        le=10
    )

    land_acquisition_risk: str

    clearance_complexity: str

    procurement_complexity: str

    progress_pct: float = Field(
        ge=0,
        le=100
    )

    scenario: bool = False

    baseline_manpower: int | None = None

    baseline_original_cost: float | None = None

    baseline_duration: int | None = None


app = FastAPI(
    title='SIH26103 Project Risk ML Service',
    version='2.2'
)


def level(score):

    if score >= 60:
        return 'High'

    if score >= 35:
        return 'Medium'

    return 'Low'


def impact(value):

    if isinstance(value, (int, float)):

        if value >= 8:
            return 'High'

        if value >= 5:
            return 'Medium'

        return 'Low'

    if value in ('High', 'Mega', 'Large'):
        return 'High'

    if value == 'Medium':
        return 'Medium'

    return 'Low'


SHAP_LABELS = {
    'sector': 'Sector',
    'implementing_agency': 'Implementing agency',
    'original_commissioning_month': 'Commissioning month',
    'original_commissioning_year': 'Commissioning year',
    'original_cost_crore': 'Original cost',
    'planned_duration_months': 'Planned duration',
    'manpower': 'Manpower',
    'project_scale': 'Project scale',
    'project_complexity': 'Project complexity',
    'land_acquisition_risk': 'Land acquisition risk',
    'clearance_complexity': 'Clearance complexity',
    'procurement_complexity': 'Procurement complexity',
    'progress_pct': 'Progress'
}


def _shap_analysis(pipe, x):
    preprocessor = pipe.named_steps['pre']
    model = pipe.named_steps['model']
    transformed = preprocessor.transform(
        pd.DataFrame([x], columns=FEATURES)
    )

    if hasattr(transformed, 'toarray'):
        transformed = transformed.toarray()

    feature_names = preprocessor.get_feature_names_out()
    feature_groups = {}

    for feature in FEATURES:
        prefixes = (
            f'cat__{feature}_',
            f'num__{feature}'
        )
        feature_groups[feature] = [
            index
            for index, name in enumerate(feature_names)
            if name.startswith(prefixes)
        ]

    explainer = shap.TreeExplainer(model)
    values = explainer.shap_values(transformed)
    if isinstance(values, list):
        values = values[0]
    values = np.asarray(values)[0]

    contributions = []
    for feature in FEATURES:
        indexes = feature_groups[feature]
        contribution = float(values[indexes].sum()) if indexes else 0.0
        contributions.append({
            'feature': feature,
            'label': SHAP_LABELS[feature],
            'value': str(x[feature]),
            'contribution': round(contribution, 4),
            'direction': 'increases' if contribution >= 0 else 'reduces'
        })

    contributions.sort(
        key=lambda item: abs(item['contribution']),
        reverse=True
    )

    interactions = []
    interaction_values = explainer.shap_interaction_values(transformed)
    if isinstance(interaction_values, list):
        interaction_values = interaction_values[0]
    interaction_values = np.asarray(interaction_values)[0]

    for left_index, left in enumerate(FEATURES):
        for right in FEATURES[left_index + 1:]:
            left_indexes = feature_groups[left]
            right_indexes = feature_groups[right]
            if not left_indexes or not right_indexes:
                continue
            contribution = float(
                interaction_values[np.ix_(left_indexes, right_indexes)].sum()
            )
            interactions.append({
                'label': f'{SHAP_LABELS[left]} + {SHAP_LABELS[right]}',
                'contribution': round(contribution, 4),
                'direction': 'increases' if contribution >= 0 else 'reduces'
            })

    interactions.sort(
        key=lambda item: abs(item['contribution']),
        reverse=True
    )

    return {
        'features': contributions,
        'interactions': interactions[:5]
    }


def _combined_risk_analysis(time_analysis, cost_analysis, x, time_months, cost_pct):
    time_scale = max(1.0, float(x['planned_duration_months']))
    time_weight = 0.45 if time_months / time_scale < 1 else 0.0
    cost_weight = 0.55 if cost_pct < 100 else 0.0
    by_feature = {}

    for item in time_analysis['features']:
        by_feature[item['feature']] = {
            'label': item['label'],
            'value': item['value'],
            'contribution': item['contribution'] * time_weight / time_scale * 100
        }

    for item in cost_analysis['features']:
        entry = by_feature[item['feature']]
        entry['contribution'] += item['contribution'] * cost_weight

    features = []
    for feature, item in by_feature.items():
        contribution = float(item['contribution'])
        features.append({
            'feature': feature,
            'label': item['label'],
            'value': item['value'],
            'contribution': round(contribution, 4),
            'direction': 'increases' if contribution >= 0 else 'reduces'
        })

    features.sort(
        key=lambda item: abs(item['contribution']),
        reverse=True
    )

    return {
        'features': features,
        'interactions': []
    }


def apply_scenario_adjustment(
    x,
    base_time_months,
    base_cost_pct
):

    """
    Applies management intervention logic
    for the What-If simulator.

    The trained ML models provide the
    underlying project prediction.

    Scenario controls represent changes
    to manpower, budget and planned time.

    These adjustments affect only the
    scenario result.

    The database project is never modified.
    """

    if not x.get('scenario', False):

        return (
            base_time_months,
            base_cost_pct
        )


    time_months = float(
        base_time_months
    )

    cost_pct = float(
        base_cost_pct
    )


    manpower = float(
        x['manpower']
    )

    budget = float(
        x['original_cost_crore']
    )

    duration = float(
        x['planned_duration_months']
    )


    baseline_manpower = float(
        x.get(
            'baseline_manpower',
            manpower
        ) or manpower
    )

    baseline_budget = float(
        x.get(
            'baseline_original_cost',
            budget
        ) or budget
    )

    baseline_duration = float(
        x.get(
            'baseline_duration',
            duration
        ) or duration
    )


    # Manpower intervention
    # More manpower generally reduces
    # schedule pressure.

    if baseline_manpower > 0:

        manpower_change = (
            manpower -
            baseline_manpower
        ) / baseline_manpower

        manpower_change = np.clip(
            manpower_change,
            -0.75,
            4.0
        )

        time_months *= (
            1.0 -
            0.18 *
            np.tanh(manpower_change)
        )


    # Budget intervention
    # More available budget generally
    # reduces financial pressure.

    if baseline_budget > 0:

        budget_change = (
            budget -
            baseline_budget
        ) / baseline_budget

        budget_change = np.clip(
            budget_change,
            -0.75,
            4.0
        )

        cost_pct *= (
            1.0 -
            0.20 *
            np.tanh(budget_change)
        )

        time_months *= (
            1.0 -
            0.05 *
            np.tanh(budget_change)
        )


    # Planned duration intervention
    # More planned time generally reduces
    # schedule-overrun pressure.

    if baseline_duration > 0:

        duration_change = (
            duration -
            baseline_duration
        ) / baseline_duration

        duration_change = np.clip(
            duration_change,
            -0.75,
            4.0
        )

        time_months *= (
            1.0 -
            0.15 *
            np.tanh(duration_change)
        )


    time_months = max(
        0.0,
        time_months
    )

    cost_pct = max(
        0.0,
        cost_pct
    )


    return (
        time_months,
        cost_pct
    )


def explain(
    x,
    time_months,
    cost_pct,
    shap_analysis=None
):

    time_months = max(
        0.0,
        float(time_months)
    )

    cost_pct = max(
        0.0,
        float(cost_pct)
    )


    time_pct = (
        time_months /
        max(
            1.0,
            float(
                x['planned_duration_months']
            )
        )
    ) * 100.0


    extra_expenditure = (
        float(
            x['original_cost_crore']
        ) *
        cost_pct /
        100.0
    )


    score = float(
        np.clip(
            0.45 *
            min(
                time_pct,
                100
            )
            +
            0.55 *
            min(
                cost_pct,
                100
            ),
            0,
            100
        )
    )


    risk_level = level(score)


    drivers = [

        {
            'label': 'Project complexity',
            'value': x['project_complexity'],
            'impact': impact(
                x['project_complexity']
            )
        },

        {
            'label': 'Land acquisition',
            'value': x['land_acquisition_risk'],
            'impact': impact(
                x['land_acquisition_risk']
            )
        },

        {
            'label': 'Clearance complexity',
            'value': x['clearance_complexity'],
            'impact': impact(
                x['clearance_complexity']
            )
        },

        {
            'label': 'Procurement complexity',
            'value': x['procurement_complexity'],
            'impact': impact(
                x['procurement_complexity']
            )
        },

        {
            'label': 'Project scale',
            'value': x['project_scale'],
            'impact': impact(
                x['project_scale']
            )
        },

        {
            'label': 'Manpower',
            'value':
                f"{x['manpower']:,} personnel",
            'impact':
                'High'
                if x['manpower'] < 80
                else 'Medium'
                if x['manpower'] < 180
                else 'Low'
        }
    ]


    drivers.sort(
        key=lambda d: {
            'High': 3,
            'Medium': 2,
            'Low': 1
        }[
            d['impact']
        ],
        reverse=True
    )


    recommendations = []


    if time_pct >= 20:

        recommendations.append(
            'Protect the critical path and introduce a weekly schedule-recovery review.'
        )


    if cost_pct >= 15:

        recommendations.append(
            'Review procurement commitments, escalation exposure and remaining contingency before the next financial cycle.'
        )


    if x['manpower'] < 80:

        recommendations.append(
            'Review manpower allocation against the current work front and critical activities.'
        )


    if x['land_acquisition_risk'] == 'High':

        recommendations.append(
            'Escalate land and right-of-way dependencies with named owners and target dates.'
        )


    if x['clearance_complexity'] == 'High':

        recommendations.append(
            'Track statutory approvals as a dependency matrix with dated escalation points.'
        )


    if not recommendations:

        recommendations.append(
            'Continue monthly evidence-based monitoring and refresh the prediction after each progress report.'
        )


    return {

        'predicted_time_overrun_months':
            round(
                time_months,
                2
            ),

        'delay_time_months':
            round(
                time_months,
                2
            ),

        'time_overrun_pct':
            round(
                time_pct,
                2
            ),

        'predicted_cost_overrun_pct':
            round(
                cost_pct,
                2
            ),

        'cost_overrun_pct':
            round(
                cost_pct,
                2
            ),

        'extra_expenditure_crore':
            round(
                extra_expenditure,
                2
            ),

        'predicted_cost_overrun_crore':
            round(
                extra_expenditure,
                2
            ),

        'risk_score':
            round(
                score,
                1
            ),

        'risk_percentage':
            round(
                score,
                1
            ),

        'risk_level':
            risk_level,

        'drivers':
            drivers,

        'recommendations':
            recommendations,

        'model_features':
            FEATURES,

        'shap':
            shap_analysis,

        'scenario':
            bool(
                x.get(
                    'scenario',
                    False
                )
            )
    }


@app.get('/health')
def health():

    return {

        'status': 'ok',

        'models_loaded': True,

        'training_rows': 900,

        'features': FEATURES
    }


@app.post('/predict')
def predict(p: Payload):

    try:

        x = p.model_dump()


        # Only the actual ML features
        # are sent to the trained models.

        model_input = {
            key: x[key]
            for key in FEATURES
        }


        df = pd.DataFrame(
            [model_input],
            columns=FEATURES
        )


        # Base ML prediction

        base_time_months = float(
            time_model.predict(df)[0]
        )

        base_cost_pct = float(
            cost_model.predict(df)[0]
        )


        # Apply What-If intervention logic
        # only when scenario=True.

        time_months, cost_pct = (
            apply_scenario_adjustment(
                x,
                base_time_months,
                base_cost_pct
            )
        )


        time_shap = _shap_analysis(time_model, model_input)
        cost_shap = _shap_analysis(cost_model, model_input)
        shap_analysis = {
            'cost_overrun': cost_shap,
            'time_overrun': time_shap,
            'risk': _combined_risk_analysis(
                time_shap,
                cost_shap,
                x,
                time_months,
                cost_pct
            )
        }

        return explain(
            x,
            time_months,
            cost_pct,
            shap_analysis
        )


    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )