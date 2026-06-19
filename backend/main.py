from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import tempfile
from video_processing import extract_frames
from agents import analyze_video

app = FastAPI(title="Deepfake Multi-Agent Orchestrator API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze_video_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith(('.mp4', '.mov', '.avi', '.webm')):
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    
    # Save the uploaded video to a temporary file
    temp_dir = tempfile.mkdtemp()
    temp_video_path = os.path.join(temp_dir, file.filename)
    
    with open(temp_video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Extract frames
        frames = extract_frames(temp_video_path, num_frames=5)
        
        # Run multi-agent analysis
        result = await analyze_video(frames)
        
        # Optional: Clean up extracted frames here if not needed for the UI
        # We can leave them for now or delete them depending on requirements
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the uploaded video
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
