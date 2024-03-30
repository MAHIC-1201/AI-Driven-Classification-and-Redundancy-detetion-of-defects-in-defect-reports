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
import spacy

nltk.download('stopwords')
from nltk.corpus import stopwords

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for your Flask app

# Load the ML model
model_cat1 = joblib.load(r'C:\VIT\Bugs_classification\sgd_category1.pkl')  # Replace 'your_model_cat1.pkl' with the path to your Category 1 model file
model_cat2 = joblib.load(r'C:\VIT\Bugs_classification\sgd_category2.pkl')  # Replace 'your_model_cat2.pkl' with the path to your Category 2 model file

nlp = spacy.load("en_core_web_sm")

def preprocess_and_filter_important_words(text):
    """Preprocess text by tokenization, removing stop words, and extracting important words."""
    doc = nlp(text)
    important_words = [token.lemma_ for token in doc if not token.is_stop]
    return important_words

def mark_duplicate_sentences(target_data, given_data):
    target_data['Processed_Sentence'] = target_data['Issue Summary'].apply(preprocess_and_filter_important_words)
    target_sentences = target_data['Processed_Sentence'].tolist()
    target_row_numbers = target_data.index.tolist()

    marked_sentences = []

    for sentence in given_data['Issue Summary']:
        processed_sentence = preprocess_and_filter_important_words(sentence)
        match_found = False
        matched_index = 'NA'  # Represent missing value as 'na'
        for target_sentence, target_row in zip(target_sentences, target_row_numbers):
            # Calculate the intersection of important words between sentences
            intersection = set(processed_sentence) & set(target_sentence)
            # Calculate the ratio of intersection to the length of the processed sentence
            match_ratio = len(intersection) / len(processed_sentence)
            # If match ratio is greater than or equal to 0.5, consider it a match
            if match_ratio >= 0.7:
                match_found = True
                matched_index = target_row
                break  # Exit the loop if a match is found
        marked_sentences.append({'Sentence': sentence, 'Duplicate': 'Yes' if match_found else 'No', 'Matched_Index': matched_index})
    

    marked_data = pd.DataFrame(marked_sentences)

    return marked_data

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

@app.route('/detect_duplicates', methods=['POST'])
def detect_duplicates():
    print("Got it")
    try:
        if 'target_file' not in request.files or 'given_file' not in request.files:
            return jsonify(error='Target and/or given files not found'), 400

        target_file = request.files['target_file']
        given_file = request.files['given_file']
        
        if target_file.filename.split('.')[-1] not in ['xlsx', 'xls'] or given_file.filename.split('.')[-1] not in ['xlsx', 'xls']:
            return jsonify(error='Invalid file format. Only Excel files (.xlsx) are supported.'), 400

        target_data = pd.read_excel(target_file)
        given_data = pd.read_excel(given_file)

        marked_data = mark_duplicate_sentences(target_data, given_data)

        marked_json = marked_data.to_json(orient='records')
        
        return jsonify(results=marked_json)
    
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)