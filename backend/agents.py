import asyncio
import random
from typing import Dict, Any

async def mock_biometric_expert(frames: list[str]) -> Dict[str, Any]:
    await asyncio.sleep(random.uniform(1.0, 2.0))
    # We will randomly introduce anomalies for testing
    has_anomaly = random.choice([True, False, False]) # Bias towards false
    score = random.uniform(0.8, 0.98) if has_anomaly else random.uniform(0.05, 0.3)
    
    return {
        "agent_name": "Biometric Expert",
        "anomaly_detected": has_anomaly,
        "confidence_score": round(score, 2),
        "reasoning": (
            "Noticeable blending artifacts detected around the jawline." if has_anomaly 
            else "Facial geometry and skin texture appear consistent."
        )
    }

async def mock_temporal_expert(frames: list[str]) -> Dict[str, Any]:
    await asyncio.sleep(random.uniform(1.2, 2.2))
    has_anomaly = random.choice([True, False, False])
    score = random.uniform(0.8, 0.95) if has_anomaly else random.uniform(0.1, 0.35)
    
    return {
        "agent_name": "Temporal Expert",
        "anomaly_detected": has_anomaly,
        "confidence_score": round(score, 2),
        "reasoning": (
            "Sudden spatial shift detected between frames 2 and 3, suggesting a face-swap filter dropped." if has_anomaly 
            else "Motion flows naturally across the sequence without unnatural micro-movements."
        )
    }

async def mock_context_expert(frames: list[str]) -> Dict[str, Any]:
    await asyncio.sleep(random.uniform(0.8, 1.8))
    has_anomaly = random.choice([True, False, False])
    score = random.uniform(0.75, 0.99) if has_anomaly else random.uniform(0.02, 0.2)
    
    return {
        "agent_name": "Context Expert",
        "anomaly_detected": has_anomaly,
        "confidence_score": round(score, 2),
        "reasoning": (
            "Lighting reflections in the eyes do not match the ambient light of the environment." if has_anomaly 
            else "Lighting and behavioral cues are consistent with a natural recording environment."
        )
    }

async def analyze_video(frames: list[str]) -> Dict[str, Any]:
    """
    Orchestrates the 3 agents in parallel and acts as the Coordinator to aggregate results.
    """
    # Run the 3 agents concurrently
    results = await asyncio.gather(
        mock_biometric_expert(frames),
        mock_temporal_expert(frames),
        mock_context_expert(frames)
    )
    
    # Coordinator Logic
    is_deepfake = False
    max_confidence = 0.0
    
    for res in results:
        if res["confidence_score"] > 0.80:
            is_deepfake = True
        if res["confidence_score"] > max_confidence:
            max_confidence = res["confidence_score"]
            
    verdict = "SYNTHETIC MEDIA DETECTED" if is_deepfake else "REAL HUMAN"
    
    return {
        "verdict": verdict,
        "overall_confidence": max_confidence,
        "agent_logs": results
    }
