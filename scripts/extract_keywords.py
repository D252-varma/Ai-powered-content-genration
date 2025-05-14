import sys
import json
import joblib
import logging
import numpy as np

# Configure logging to only write to file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('keyword_extraction.log')
    ]
)

def extract_keywords(text):
    try:
        # Load the model and label encoder
        logging.info("Loading model and encoder...")
        model = joblib.load("ml_models/keyword_extractor_model.pkl")
        mlb = joblib.load("ml_models/keyword_mlb.pkl")
        
        # Make prediction
        logging.info(f"Processing text: {text[:100]}...")
        proba = model.predict_proba([text])
        
        # Use a lower threshold for better recall
        threshold = 0.2  # Lowered from 0.3
        predictions = (proba > threshold).astype(int)
        keywords = mlb.inverse_transform(predictions)
        
        # Get the actual keywords
        extracted_keywords = list(keywords[0])
        logging.info(f"Extracted keywords: {extracted_keywords}")
        
        # Log prediction probabilities for debugging
        for i, (keyword, prob) in enumerate(zip(mlb.classes_, proba[0])):
            if prob > 0.1:  # Log probabilities above 0.1
                logging.info(f"Keyword: {keyword}, Probability: {prob:.3f}")
        
        # Return only the keywords array
        return extracted_keywords
        
    except Exception as e:
        logging.error(f"Error in keyword extraction: {str(e)}")
        return []

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide text content"}))
        sys.exit(1)
        
    text = sys.argv[1]
    keywords = extract_keywords(text)
    print(json.dumps(keywords)) 