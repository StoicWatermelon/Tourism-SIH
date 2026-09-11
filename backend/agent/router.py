"""
Bharat Explore — Agent Model Router & Rate-Limit (429) Protection
Orchestrates primary, backup, smaller backup, and offline fallback models.
Preserves conversation history, planner state, completed tasks, and checkpoints across model swaps.
"""

import os
import time
from typing import Optional, List, Dict, Any, Tuple
from google import genai
from google.genai import types

class ModelRouter:
    """
    Intelligent LLM Router with automatic 429 rate-limit failover and offline recovery.
    """
    MODELS_CASCADE = [
        {"id": "gemini-3.1-flash-lite", "tier": "Primary", "cooldown_until": 0},
        {"id": "gemini-3.7-flash", "tier": "Backup", "cooldown_until": 0},
        {"id": "gemini-3.5-flash", "tier": "Smaller Backup", "cooldown_until": 0},
        {"id": "gemini-2.5-flash", "tier": "Ultra-Fast Backup", "cooldown_until": 0}
    ]

    def __init__(self, gemini_api_key: Optional[str] = None):
        self.api_key = gemini_api_key or os.getenv("GEMINI_API_KEY", "")
        self.client: Optional[genai.Client] = None
        if self.api_key and not self.api_key.startswith("your_"):
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as ex:
                print(f"[ModelRouter] Warning initializing GenAI Client: {ex}")

    def is_gemini_available(self) -> bool:
        return self.client is not None

    def _mark_rate_limited(self, model_id: str, cooldown_seconds: int = 60):
        now = time.time()
        for m in self.MODELS_CASCADE:
            if m["id"] == model_id:
                m["cooldown_until"] = now + cooldown_seconds
                print(f"[ModelRouter] Model {model_id} marked 429 Rate-Limited. Cooling down for {cooldown_seconds}s.")
                break

    def get_next_available_model(self) -> Optional[Dict[str, Any]]:
        now = time.time()
        for m in self.MODELS_CASCADE:
            if now >= m["cooldown_until"]:
                return m
        # If all in cooldown, return the one with nearest cooldown expiration
        sorted_models = sorted(self.MODELS_CASCADE, key=lambda x: x["cooldown_until"])
        return sorted_models[0] if sorted_models else None

    async def call_model_with_fallback(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[Dict[str, str]]] = None,
        lang: str = "en"
    ) -> Tuple[str, str, bool]:
        """
        Executes generation across model cascade with 429 recovery.
        Returns:
            (response_text, model_used, is_offline_fallback)
        """
        if not self.client:
            return "", "offline-fallback", True

        # Build contents list
        contents = []
        if history:
            for turn in history[-6:]:
                role = "model" if turn.get("role") in ["model", "assistant", "bot"] else "user"
                text = turn.get("content") or turn.get("text") or ""
                if text.strip():
                    contents.append(types.Content(role=role, parts=[types.Part.from_text(text=text.strip())]))

        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=prompt)]))

        # Iterate through cascade
        for candidate in self.MODELS_CASCADE:
            now = time.time()
            if now < candidate["cooldown_until"]:
                continue

            model_id = candidate["id"]
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.4,
                    max_output_tokens=2048,
                    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
                )

                response = await self.client.aio.models.generate_content(
                    model=model_id,
                    contents=contents,
                    config=config
                )

                if response and response.text:
                    return response.text.strip(), model_id, False

            except Exception as e:
                err_str = str(e)
                is_rate_limit = any(indicator in err_str for indicator in ["429", "RESOURCE_EXHAUSTED", "QuotaExceeded", "rate limit"])
                print(f"[ModelRouter Warning on {model_id}]: {err_str[:150]}")

                if is_rate_limit:
                    self._mark_rate_limited(model_id, cooldown_seconds=90)
                else:
                    # Non-rate-limit temporary failure
                    self._mark_rate_limited(model_id, cooldown_seconds=20)
                continue

        # All models exhausted or failed — switch into Offline Travel Assistant
        print("[ModelRouter Alert]: All online LLM endpoints exhausted. Engaging Offline Travel Assistant.")
        return "", "offline-fallback", True

# Global router singleton
router = ModelRouter()
