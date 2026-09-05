from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib
import os


BASE = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE, 'models')


time_model = joblib.load(
    os.path.join(MODEL_DIR, 'time_overrun_model.pkl')
)

cost_model = joblib.load(
    os.path.join(MODEL_DIR, 'cost_overrun_model.pkl')
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


app = FastAPI(
    title='SIH26103 Project Risk ML Service',
    version='2.1'
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


def explain(
    x,
    time_months,
    cost_pct
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
            x['planned_duration_months']
        )
        * 100.0
    )

    extra_expenditure = (
        x['original_cost_crore'] *
        cost_pct /
        100.0
    )

    score = float(
        np.clip(
            0.45 * min(time_pct, 100) +
            0.55 * min(cost_pct, 100),
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
            'value': f"{x['manpower']:,} personnel",
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
        }[d['impact']],
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
            round(time_months, 2),

        'delay_time_months':
            round(time_months, 2),

        'time_overrun_pct':
            round(time_pct, 2),

        'predicted_cost_overrun_pct':
            round(cost_pct, 2),

        'cost_overrun_pct':
            round(cost_pct, 2),

        'extra_expenditure_crore':
            round(extra_expenditure, 2),

        'predicted_cost_overrun_crore':
            round(extra_expenditure, 2),

        'risk_score':
            round(score, 1),

        'risk_level':
            risk_level,

        'drivers':
            drivers,

        'recommendations':
            recommendations,

        'model_features':
            FEATURES
    }


def apply_scenario_adjustment(
    x,
    base_time_months,
    base_cost_pct
):
    """
    Applies intervention logic for the What-If simulator.

    The trained ML models provide the baseline prediction.

    Scenario controls then represent management interventions:

    More manpower:
        reduces schedule pressure.

    More budget:
        reduces financial pressure.

    More planned duration:
        reduces time-overrun percentage.

    These changes affect only the scenario prediction.
    The database project is never modified.
    """

    time_months = float(base_time_months)
    cost_pct = float(base_cost_pct)

    manpower = float(x['manpower'])
    budget = float(x['original_cost_crore'])
    duration = float(x['planned_duration_months'])

    # --------------------------------------------------
    # MANPOWER EFFECT
    # --------------------------------------------------
    #
    # 150 personnel is treated as a reasonable reference
    # level for a large infrastructure project.
    #
    # More manpower -> lower schedule pressure.
    #
    manpower_reference = 150.0

    manpower_ratio = (
        manpower /
        manpower_reference
    )

    manpower_effect = np.clip(
        manpower_ratio - 1.0,
        -0.6,
        2.0
    )

    # Maximum practical reduction is approximately 25%.
    time_months *= (
        1.0 -
        0.12 *
        np.tanh(manpower_effect)
    )


    # --------------------------------------------------
    # PLANNED DURATION EFFECT
    # --------------------------------------------------
    #
    # More planned time gives the project more schedule
    # buffer, therefore reducing time-overrun pressure.
    #
    # We compare the scenario duration against a
    # 24-month reference.
    #

    duration_reference = 24.0

    duration_ratio = (
        duration /
        duration_reference
    )

    duration_effect = np.clip(
        duration_ratio - 1.0,
        -0.75,
        4.0
    )

    time_months *= (
        1.0 -
        0.10 *
        np.tanh(duration_effect)
    )


    # --------------------------------------------------
    # BUDGET EFFECT
    # --------------------------------------------------
    #
    # A larger scenario budget gives more financial
    # buffer and therefore reduces cost-overrun pressure.
    #
    # We compare the scenario budget against the model's
    # original project budget.
    #

    original_budget = float(
        x.get(
            '_baseline_original_cost',
            budget
        )
    )

    if original_budget > 0:

        budget_change_ratio = (
            budget -
            original_budget
        ) / original_budget

        budget_change_ratio = np.clip(
            budget_change_ratio,
            -0.75,
            4.0
        )

        cost_pct *= (
            1.0 -
            0.18 *
            np.tanh(
                budget_change_ratio
            )
        )


    # --------------------------------------------------
    # SAFETY LIMITS
    # --------------------------------------------------

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

        df = pd.DataFrame(
            [x],
            columns=FEATURES
        )

        time_months = float(
            time_model.predict(df)[0]
        )

        cost_pct = float(
            cost_model.predict(df)[0]
        )

        return explain(
            x,
            time_months,
            cost_pct
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )