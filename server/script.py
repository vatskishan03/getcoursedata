import pandas as pd
import sys
import json
import os

script_directory = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_directory, 'excelfile.csv')
file = pd.read_csv(file_path)

def filter_df(input_df, company, difficulty, rating):
    try:
        filtered_data = input_df.loc[
            (input_df['Company_Name'] == company) &
            (input_df['Difficulty'] == difficulty) &
            (input_df['Ratings'] >= rating)
        ]
        return filtered_data[['Course_Name', 'Ratings', 'Link']]
    except KeyError:
        print("Enter Correct compName")
        return pd.DataFrame()

company = sys.argv[1]
difficulty = sys.argv[2]
rating = float(sys.argv[3])

filtered_data = filter_df(file, company, difficulty, rating)

courses_list = filtered_data.to_dict(orient='records')

for course in courses_list:
    course['Link'] = course['Link']

print(json.dumps(courses_list))
