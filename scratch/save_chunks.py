import json

transcript_path = r"C:\Users\Arya\.gemini\antigravity-ide\brain\48f1d26a-dbd6-4cbc-b3bc-a723f0bac1ed\.system_generated\logs\transcript_full.jsonl"

chunk_151 = None
chunk_155 = None

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            idx = data.get("step_index")
            if idx == 151:
                for tc in data.get('tool_calls', []):
                    chunk_151 = tc.get('args', {}).get('ReplacementChunk')
            elif idx == 155:
                for tc in data.get('tool_calls', []):
                    chunk_155 = tc.get('args', {}).get('ReplacementChunk')
        except Exception:
            pass

if chunk_151:
    with open("scratch/step151_chunk.css", "w", encoding="utf-8") as f:
        f.write(chunk_151)
    print("Saved step151_chunk.css, size:", len(chunk_151))

if chunk_155:
    with open("scratch/step155_chunk.html", "w", encoding="utf-8") as f:
        f.write(chunk_155)
    print("Saved step155_chunk.html, size:", len(chunk_155))
