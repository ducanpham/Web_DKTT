import pandas as pd
import json
import glob

files = [f for f in glob.glob('C:/Users/HP/Downloads/*(1-37).xlsx') if '~$' not in f]
df = pd.read_excel(files[0], skiprows=0) # first row is header
data = df.iloc[:, [1, 17]].fillna('').to_dict(orient='records')

formatted = []
for row in data:
    keys = list(row.keys())
    name = str(row[keys[0]]).strip()
    colR = str(row[keys[1]]).strip()
    if name:
        formatted.append({ "name": name, "status": colR })

with open('col_r_data.json', 'w', encoding='utf-8') as f:
    json.dump(formatted, f, ensure_ascii=False, indent=2)
print("Saved", len(formatted), "rows")
