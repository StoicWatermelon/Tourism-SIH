"""
Bharat Explore — Agent Multi-Tier Cache Subsystem
Caches city information, tourist attractions, common itineraries, weather, and hotel search results.
Implements TTL expiry and memory management to drastically cut LLM token usage and latency.
"""

import time
import json
from typing import Any, Optional, Dict
from pathlib import Path

class AgentCache:
    def __init__(self, default_ttl_seconds: int = 3600 * 4):
        self.default_ttl = default_ttl_seconds
        self._store: Dict[str, Dict[str, Any]] = {}
        self._disk_cache_dir = Path(__file__).resolve().parent.parent.parent / "scratch" / "agent_cache"
        try:
            self._disk_cache_dir.mkdir(parents=True, exist_ok=True)
        except Exception:
            pass

    def _generate_key(self, namespace: str, key: str) -> str:
        clean_key = str(key).strip().lower().replace(" ", "_")
        return f"{namespace}:{clean_key}"

    def get(self, namespace: str, key: str) -> Optional[Any]:
        cache_key = self._generate_key(namespace, key)
        now = time.time()
        
        # Check in-memory store first
        if cache_key in self._store:
            entry = self._store[cache_key]
            if now < entry["expires_at"]:
                return entry["value"]
            else:
                del self._store[cache_key]

        # Check disk cache as backup
        disk_file = self._disk_cache_dir / f"{cache_key.replace(':', '__')}.json"
        if disk_file.exists():
            try:
                with open(disk_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if now < data.get("expires_at", 0):
                    # Restore to in-memory store
                    self._store[cache_key] = data
                    return data["value"]
                else:
                    disk_file.unlink(missing_ok=True)
            except Exception:
                pass

        return None

    def set(self, namespace: str, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        cache_key = self._generate_key(namespace, key)
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        now = time.time()
        entry = {
            "key": cache_key,
            "value": value,
            "created_at": now,
            "expires_at": now + ttl
        }
        self._store[cache_key] = entry

        # Persist to disk cache
        try:
            disk_file = self._disk_cache_dir / f"{cache_key.replace(':', '__')}.json"
            with open(disk_file, "w", encoding="utf-8") as f:
                json.dump(entry, f, ensure_ascii=False)
        except Exception:
            pass

    def clear(self, namespace: Optional[str] = None):
        if namespace:
            prefix = f"{namespace}:"
            keys_to_remove = [k for k in self._store if k.startswith(prefix)]
            for k in keys_to_remove:
                del self._store[k]
        else:
            self._store.clear()

# Global singleton cache instance
cache = AgentCache()
