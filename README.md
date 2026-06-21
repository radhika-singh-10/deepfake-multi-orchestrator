# Deepfake Multi-Agent Orchestrator

This project is a multi-agent AI system designed to detect synthetic media (deepfakes). It uses an orchestrator pattern with multiple specialized agents (Biometric, Temporal, and Context Experts) that evaluate videos concurrently to provide a comprehensive detection verdict.

The project is split into a **FastAPI backend** and a **React/Vite frontend**.

---

## 🛠️ Prerequisites

Make sure you have the following installed:
- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- npm (comes with Node.js)

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)

The backend handles video processing and running the multi-agent orchestration.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment (Mac/Linux)
   source venv/bin/activate
   
   # Activate virtual environment (Windows)
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   *(Assuming you have a `requirements.txt`. If not, you'll need `fastapi`, `uvicorn`, and `python-multipart`)*
   ```bash
   pip install fastapi uvicorn python-multipart
   ```

4. **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will be available at `http://127.0.0.1:8000`. You can view the interactive API documentation at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup (React + Vite)

The frontend provides the user interface for uploading videos and displaying the agents' analysis.

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend UI will be available at `http://localhost:5173` (or the port specified by Vite).

---

## 🏗️ Architecture

- **Backend (`/backend`)**: Contains `main.py` which exposes the `/analyze` endpoint. It processes the uploaded video, extracts frames (`video_processing.py`), and routes them to the agent coordinator (`agents.py`).
- **Agents (`agents.py`)**: Defines three asynchronous expert agents (Biometric, Temporal, Context) that process the frames in parallel, alongside a coordinator that aggregates their confidence scores.
- **Frontend (`/frontend`)**: A modern React interface built with Vite, TypeScript, and Lucide React icons for a responsive user experience.