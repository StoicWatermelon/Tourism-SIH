"""
Supabase Client Singleton for Bharat Explore Backend.
Aligned with modern Supabase platform standards (SIH 2026).
Exports a single global client instance using create_client(SUPABASE_URL, KEY).
Supports modern key formats:
  - SUPABASE_ANON_KEY: begins with 'sb_publishable_'
  - SUPABASE_SERVICE_ROLE_KEY: begins with 'sb_secret_'
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Ensure .env is loaded
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    load_dotenv(override=True)

# Supabase Credentials
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip()
# Clean and normalize SUPABASE_URL (strip any /rest/v1 or trailing slashes)
if "/rest/v1" in SUPABASE_URL:
    SUPABASE_URL = SUPABASE_URL.split("/rest/v1")[0]
SUPABASE_URL = SUPABASE_URL.rstrip("/")

SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "").strip()
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()

# Priority: Service role key for administrative backend queries, or anon key
ACTIVE_KEY: str = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY

def is_supabase_configured() -> bool:
    """Returns True if valid non-placeholder Supabase credentials are configured."""
    if not SUPABASE_URL or "your-project-ref" in SUPABASE_URL:
        return False
    if not ACTIVE_KEY or "your_supabase" in ACTIVE_KEY:
        return False
    return True

# Initialize single global Supabase client instance
_client_url = SUPABASE_URL if is_supabase_configured() else "https://placeholder.supabase.co"
_client_key = ACTIVE_KEY if is_supabase_configured() else "sb_publishable_placeholder_token_for_initialization"

try:
    supabase: Client = create_client(_client_url, _client_key)
except Exception as _e:
    print(f"[Supabase] Warning during client initialization: {_e}")
    # Fallback to dummy client if necessary
    supabase = create_client("https://placeholder.supabase.co", "sb_publishable_placeholder")

# Dedicated Admin Client (using service_role key, never polluted by user sign-in sessions)
_admin_url = SUPABASE_URL if is_supabase_configured() else "https://placeholder.supabase.co"
_admin_key = SUPABASE_SERVICE_ROLE_KEY if (is_supabase_configured() and SUPABASE_SERVICE_ROLE_KEY and not "your_supabase" in SUPABASE_SERVICE_ROLE_KEY) else _client_key

try:
    supabase_admin: Client = create_client(_admin_url, _admin_key)
except Exception as _e:
    print(f"[Supabase] Warning initializing admin client: {_e}")
    supabase_admin = supabase

# Dedicated Anon Client (using publishable anon key for user authentications)
_anon_key = SUPABASE_ANON_KEY if (is_supabase_configured() and SUPABASE_ANON_KEY and not "your_supabase" in SUPABASE_ANON_KEY) else _client_key

try:
    supabase_anon: Client = create_client(_client_url, _anon_key)
except Exception as _e:
    print(f"[Supabase] Warning initializing anon client: {_e}")
    supabase_anon = supabase

def get_supabase_client() -> Client:
    """Returns the global Supabase client instance."""
    return supabase

def get_supabase_admin_client() -> Client:
    """Returns the dedicated service-role admin Supabase client."""
    return supabase_admin

def get_supabase_anon_client() -> Client:
    """Returns the publishable anon-role Supabase client instance."""
    return supabase_anon

__all__ = [
    "supabase",
    "supabase_admin",
    "supabase_anon",
    "get_supabase_client",
    "get_supabase_admin_client",
    "get_supabase_anon_client",
    "is_supabase_configured",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
]
