import json

transcript_path = r"C:\Users\Arya\.gemini\antigravity-ide\brain\48f1d26a-dbd6-4cbc-b3bc-a723f0bac1ed\.system_generated\logs\transcript_full.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            idx = data.get("step_index")
            if idx == 155:
                for tc in data.get('tool_calls', []):
                    print("Step 155 Args:")
                    print("StartLine:", tc['args'].get('StartLine'))
                    print("EndLine:", tc['args'].get('EndLine'))
            if idx in (151, 155):
                for tc in data.get('tool_calls', []):
                    chunk = tc.get('args', {}).get('ReplacementChunk')
                    if chunk:
                        print(f"=== Step {idx} ReplacementChunk ({len(chunk)} chars) ===")
                        print(chunk[:500])
                        print("...\n" + chunk[-300:])
        except Exception:
            pass
