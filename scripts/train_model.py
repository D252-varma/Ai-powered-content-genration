import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import logging
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def preprocess_text(text):
    """Preprocess text by removing special characters, converting to lowercase, and lemmatizing."""
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words]
    
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    
    return ' '.join(tokens)

def validate_keywords(keywords):
    """Validate and clean keywords."""
    # Remove duplicates
    keywords = list(set(keywords))
    
    # Remove empty strings and whitespace
    keywords = [k.strip() for k in keywords if k.strip()]
    
    # Convert to lowercase
    keywords = [k.lower() for k in keywords]
    
    return keywords

def create_keyword_matrix(df, all_keywords):
    """Create a binary matrix for keywords efficiently."""
    # Initialize a zero matrix
    keyword_matrix = np.zeros((len(df), len(all_keywords)))
    
    # Fill the matrix
    for i, keywords in enumerate(df['keywords']):
        for j, keyword in enumerate(all_keywords):
            if keyword in keywords:
                keyword_matrix[i, j] = 1
    
    return keyword_matrix

def main():
    # Load dataset
    logging.info("Loading dataset...")
    df = pd.read_csv('final_combined_keyword_sentences.csv')
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Preprocess sentences
    df['processed_sentence'] = df['sentence'].apply(preprocess_text)
    
    # Process keywords
    df['keywords'] = df['keyword'].str.split(',')
    df['keywords'] = df['keywords'].apply(validate_keywords)
    
    # Get all unique keywords
    all_keywords = set()
    for keywords in df['keywords']:
        all_keywords.update(keywords)
    all_keywords = sorted(list(all_keywords))
    
    logging.info(f"Loaded {len(df)} unique examples")
    logging.info(f"Number of unique keywords: {len(all_keywords)}")
    logging.info(f"Sample keywords: {all_keywords[:5]}")
    
    # Analyze keyword distribution
    keyword_counts = np.sum(create_keyword_matrix(df, all_keywords), axis=0)
    keyword_dist = pd.DataFrame({
        'keyword': all_keywords,
        'count': keyword_counts
    }).sort_values('count', ascending=False)
    logging.info("\nKeyword distribution (top 10):")
    logging.info(keyword_dist.head(10).to_string())
    logging.info(f"\nKeywords with only one example: {sum(keyword_counts == 1)}")
    logging.info(f"Keywords with no examples: {sum(keyword_counts == 0)}")
    
    # Create keyword matrix efficiently
    y = create_keyword_matrix(df, all_keywords)
    X = df['processed_sentence']
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y  # Add stratification
    )

    # Train a Random Forest model for each keyword
    for i, keyword in enumerate(all_keywords):
        logging.info(f"\nTraining model for keyword: {keyword}")
        y_train_keyword = y_train[:, i]
        y_test_keyword = y_test[:, i]
        
        # Check class distribution
        class_counts = np.bincount(y_train_keyword)
        logging.info(f"Class distribution in training data: {class_counts}")
        
        # Use class weights to handle imbalance
        class_weights = None
        if len(class_counts) > 1:  # Only if we have both classes
            class_weights = 'balanced'
            
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            class_weight=class_weights,  # Add class weights
            random_state=42
        )
        
        # Only train if we have positive examples
        if np.sum(y_train_keyword) > 0:
            model.fit(X_train, y_train_keyword)
            
            # Evaluate
            y_pred = model.predict(X_test)
            
            # Print metrics only if we have positive examples in test set
            if np.sum(y_test_keyword) > 0:
                logging.info("\nClassification Report:")
                logging.info(classification_report(y_test_keyword, y_pred))
            else:
                logging.warning("No positive examples in test set for evaluation")
        else:
            logging.warning(f"Skipping {keyword} - No positive examples in training data")
            continue
            
        # Save the model
        logging.info("\nSaving model...")
        joblib.dump(model, f'models/keyword_model_{keyword}.joblib')
    
    logging.info("\nDone! Models have been trained and saved.")

if __name__ == "__main__":
    main() 