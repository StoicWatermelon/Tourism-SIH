import sys
from pathlib import Path

# Force the project root directory into sys.path so Vercel can locate the 'backend' package
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the configured FastAPI app from the core backend server file
from backend.server import app
