import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import MultiLabelBinarizer
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

def create_and_train_model():
    """Create and train the keyword extraction model"""
    print("\n=== Model Creation Process ===")
    
    # 1. Create TF-IDF Vectorizer
    print("\n1. Creating TF-IDF Vectorizer...")
    tfidf = TfidfVectorizer(
        analyzer='word',
        ngram_range=(1, 3),  # Use unigrams, bigrams, and trigrams
        max_features=10000,  # Maximum number of features
        min_df=2,            # Minimum document frequency
        max_df=0.95,         # Maximum document frequency
        stop_words='english' # Remove English stop words
    )
    
    # 2. Create Classifier
    print("\n2. Creating Classifier...")
    base_classifier = LogisticRegression(
        class_weight='balanced',
        max_iter=1000,
        solver='liblinear'
    )
    classifier = OneVsRestClassifier(base_classifier)
    
    # 3. Create Pipeline
    print("\n3. Creating Pipeline...")
    from sklearn.pipeline import Pipeline
    model = Pipeline([
        ('tfidf', tfidf),
        ('clf', classifier)
    ])
    
    return model

def demonstrate_model_usage():
    """Demonstrate how to use the trained model"""
    print("\n=== Model Usage Demonstration ===")
    
    try:
        # Load the trained model and MLB
        print("\n1. Loading trained model and MultiLabelBinarizer...")
        model = joblib.load("ml_models/keyword_extractor_model.pkl")
        mlb = joblib.load("ml_models/keyword_mlb.pkl")
        
        # Example text
        example_text = """
        Artificial Intelligence is transforming the way we work and live. 
        Machine learning algorithms are becoming increasingly sophisticated, 
        enabling new applications in healthcare, finance, and social media.
        """
        
        print("\n2. Processing example text...")
        processed_text = preprocess_text(example_text)
        print(f"Processed text: {processed_text[:100]}...")
        
        # Make prediction
        print("\n3. Making prediction...")
        probabilities = model.predict_proba([processed_text])
        
        # Get keywords above threshold
        threshold = 0.2
        predictions = (probabilities > threshold).astype(int)
        keywords = mlb.inverse_transform(predictions)
        
        print("\n4. Extracted Keywords:")
        for keyword in keywords[0]:
            print(f"- {keyword}")
            
        # Show probabilities for top keywords
        print("\n5. Keyword Probabilities:")
        for i, (keyword, prob) in enumerate(zip(mlb.classes_, probabilities[0])):
            if prob > 0.1:  # Show probabilities above 0.1
                print(f"{keyword}: {prob:.3f}")
                
    except Exception as e:
        print(f"Error in demonstration: {str(e)}")

def main():
    print("=== Keyword Extraction Model Demonstration ===")
    
    # Show model creation process
    model = create_and_train_model()
    print("\nModel created successfully!")
    
    # Demonstrate model usage
    demonstrate_model_usage()

if __name__ == "__main__":
    main() 