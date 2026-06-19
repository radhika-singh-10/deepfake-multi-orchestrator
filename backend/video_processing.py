import cv2
import os
import tempfile
import math

def extract_frames(video_path: str, num_frames: int = 5) -> list[str]:
    """
    Extracts a specified number of frames from a video.
    Returns a list of paths to the extracted image files.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video at {video_path}")
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    if total_frames <= 0:
        raise ValueError("Video has no frames.")
        
    # Calculate interval to get evenly spaced frames
    interval = max(1, math.floor(total_frames / num_frames))
    
    extracted_paths = []
    
    temp_dir = tempfile.mkdtemp(prefix="deepfake_frames_")
    
    for i in range(num_frames):
        frame_idx = i * interval
        if frame_idx >= total_frames:
            break
            
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        
        if ret:
            frame_filename = os.path.join(temp_dir, f"frame_{i}.jpg")
            cv2.imwrite(frame_filename, frame)
            extracted_paths.append(frame_filename)
            
    cap.release()
    return extracted_paths
