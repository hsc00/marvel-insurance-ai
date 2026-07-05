import os
from pathlib import Path

from dotenv import find_dotenv, load_dotenv

# API routes used by the server
API_PREFIX = '/claims'
CLAIMS_ROUTE = API_PREFIX
CLAIMS_STREAM_ROUTE = f'{API_PREFIX}/stream'

# Load the closest .env starting from the current module's directory.
# This finds `server/.env` first, regardless of where `uvicorn` is started from.
REPO_ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = find_dotenv(filename='.env', usecwd=False) or str(REPO_ROOT / '.env')
load_dotenv(dotenv_path=ENV_PATH)

# CORS configuration
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
CORS_METHODS = os.getenv('CORS_METHODS', '*').split(',')
CORS_HEADERS = os.getenv('CORS_HEADERS', '*').split(',')
