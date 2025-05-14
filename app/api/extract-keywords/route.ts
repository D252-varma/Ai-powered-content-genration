import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Path to the Python script that will handle the ML model
    const pythonScript = path.join(process.cwd(), 'scripts', 'extract_keywords.py');
    
    // Check if the Python script exists
    if (!fs.existsSync(pythonScript)) {
      console.error('Python script not found at:', pythonScript);
      return NextResponse.json(
        { error: 'Keyword extraction service is not properly configured' },
        { status: 500 }
      );
    }

    // Check if the model files exist
    const modelPath = path.join(process.cwd(), 'ml_models', 'keyword_extractor_model.pkl');
    const mlbPath = path.join(process.cwd(), 'ml_models', 'keyword_mlb.pkl');

    if (!fs.existsSync(modelPath) || !fs.existsSync(mlbPath)) {
      console.error('Model files not found at:', { modelPath, mlbPath });
      return NextResponse.json(
        { error: 'Keyword extraction model files are missing' },
        { status: 500 }
      );
    }

    // Use Python from virtual environment
    const pythonExecutable = path.join(process.cwd(), 'venv', 'bin', 'python');
    
    // Spawn Python process with proper environment
    const pythonProcess = spawn(pythonExecutable, [pythonScript, content], {
      env: {
        ...process.env,
        PYTHONPATH: process.cwd(),
      },
    });

    return new Promise((resolve, reject) => {
      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
        console.error('Python process error:', data.toString());
      });

      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        resolve(
          NextResponse.json(
            { error: 'Failed to start keyword extraction process' },
            { status: 500 }
          )
        );
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python process failed with code:', code);
          console.error('Error output:', error);
          resolve(
            NextResponse.json(
              { error: 'Keyword extraction failed. Please try again.' },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const keywords = JSON.parse(result);
          resolve(NextResponse.json({ keywords }));
        } catch (e) {
          console.error('Failed to parse Python output:', e);
          console.error('Raw output:', result);
          resolve(
            NextResponse.json(
              { error: 'Failed to process keyword extraction results' },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 