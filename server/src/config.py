import os
from pathlib import Path

from dotenv import load_dotenv

# API routes used by the server
API_PREFIX = '/claims'
CLAIMS_ROUTE = API_PREFIX
CLAIMS_STREAM_ROUTE = f'{API_PREFIX}/stream'

# Load `.env` from the server directory.
ENV_PATH = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=ENV_PATH)

# CORS configuration
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
CORS_METHODS = os.getenv('CORS_METHODS', '*').split(',')
CORS_HEADERS = os.getenv('CORS_HEADERS', '*').split(',')
