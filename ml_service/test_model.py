from main import explain, FEATURES
import pandas as pd

sample = {
    'sector':'Power','implementing_agency':'PGCIL','original_commissioning_month':2,
    'original_commissioning_year':2021,'original_cost_crore':410,'planned_duration_months':30,
    'manpower':180,'project_scale':'Large','project_complexity':5,
    'land_acquisition_risk':'Low','clearance_complexity':'Medium','procurement_complexity':'Medium',
    'progress_pct':83
}
from main import time_model, cost_model
df=pd.DataFrame([sample],columns=FEATURES)
tp=float(time_model.predict(df)[0]); cp=float(cost_model.predict(df)[0])
print(explain(sample,tp,cp))
