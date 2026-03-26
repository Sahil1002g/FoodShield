import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "additives.csv")

additives_df = pd.read_csv(CSV_PATH)
additives_df["e_code"] = additives_df["e_code"].str.lower()

def get_additives_details(additives_tags):
    detailed_additives = []

    for tag in additives_tags:
        code = tag.replace("en:", "").lower()

        row = additives_df[additives_df["e_code"] == code]

        if not row.empty:
            detailed_additives.append({
                "code": code,
                "name": row.iloc[0]["title"],
                "info": row.iloc[0]["info"],
                "e_type": row.iloc[0]["e_type"],
                
            })

    return detailed_additives
