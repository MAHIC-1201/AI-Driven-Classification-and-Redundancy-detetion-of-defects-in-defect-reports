from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import pandas as pd
import joblib
import logging
import pandas as pd
import numpy as np
from numpy import random
import nltk
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
import re
from bs4 import BeautifulSoup

nltk.download('stopwords')
from nltk.corpus import stopwords

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for your Flask app

# Load the ML model
model_cat1 = joblib.load(r'C:\VIT\Bugs_classification\sgd_category1.pkl')  # Replace 'your_model_cat1.pkl' with the path to your Category 1 model file
model_cat2 = joblib.load(r'C:\VIT\Bugs_classification\sgd_category2.pkl')  # Replace 'your_model_cat2.pkl' with the path to your Category 2 model file

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    print("HIT THE FUNCTION")
    if 'file' not in request.files:
        print("NO FILE PART")
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # If user does not select file, browser also submit an empty part without filename
    if file.filename == '':
        print("NO FILE UPLOADED")
        return jsonify({'error': 'No selected file'})

    # Read Excel file into a DataFrame
    try:
        df = pd.read_excel(file)
        print(df)
        # Specify the path and filename for the CSV file
        csv_filename = 'datasettotest.csv'

        # Convert the DataFrame to CSV format and save it
        df.to_csv(csv_filename, index=False)
        
    except Exception as e:
        return jsonify({'error': f'Error reading Excel file: {str(e)}'})

    REPLACE_BY_SPACE_RE = re.compile('[/(){}\\[\\]\\|@,;]')
    BAD_SYMBOLS_RE = re.compile('[^0-9a-z #+_]')
    STOPWORDS = set(stopwords.words('english'))

    def clean_text(text):
        """
            text: a string

            return: modified initial string
        """
        text = BeautifulSoup(text, "lxml").text # HTML decoding
        text = text.lower() # lowercase text
        text = REPLACE_BY_SPACE_RE.sub(' ', text) # replace REPLACE_BY_SPACE_RE symbols by space in text
        text = BAD_SYMBOLS_RE.sub('', text) # delete symbols which are in BAD_SYMBOLS_RE from text
        text = ' '.join(word for word in text.split() if word not in STOPWORDS) # delete stopwors from text
        return text
    df['Original Issue Summary']=df['Issue Summary']
    df['Issue Summary'] = df['Issue Summary'].apply(clean_text)
    try:
        predictions_cat1 = model_cat1.predict(df['Issue Summary'])
    except Exception as e:
        return jsonify({'error': f'Error predicting Category 1: {str(e)}'})

    # Predict Category 2 using the second model
    try:
        predictions_cat2 = model_cat2.predict(df['Issue Summary'])
    except Exception as e:
        return jsonify({'error': f'Error predicting Category 2: {str(e)}'})

    # Create DataFrame with predictions for both categories
    final_result = pd.DataFrame({'Summary': df['Original Issue Summary'], 
                                 'Category1': predictions_cat1,
                                 'Category2': predictions_cat2})

    # Return the final result as JSON
    print(final_result)
    return final_result.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
