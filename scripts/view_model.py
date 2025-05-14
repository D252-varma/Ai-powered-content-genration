import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

def view_model_contents():
    try:
        # Load the model
        print("\nLoading keyword_extractor_model.pkl...")
        model = joblib.load("ml_models/keyword_extractor_model.pkl")
        
        # Display model information
        print("\nModel Type:", type(model))
        if isinstance(model, Pipeline):
            print("\nPipeline Steps:")
            for i, (name, step) in enumerate(model.steps):
                print(f"\nStep {i+1}: {name}")
                print(f"Type: {type(step)}")
                if hasattr(step, 'get_params'):
                    print("Parameters:", step.get_params())
        
        # Load the MultiLabelBinarizer
        print("\nLoading keyword_mlb.pkl...")
        mlb = joblib.load("ml_models/keyword_mlb.pkl")
        
        # Display MLB information
        print("\nMultiLabelBinarizer Information:")
        print(f"Number of classes: {len(mlb.classes_)}")
        print("\nFirst 10 classes:")
        for i, class_name in enumerate(mlb.classes_[:10]):
            print(f"{i}: {class_name}")
            
    except Exception as e:
        print(f"Error loading files: {str(e)}")

if __name__ == "__main__":
    view_model_contents() 