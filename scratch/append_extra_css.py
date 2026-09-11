# Append origin chip and speech mic styles to css/ai.css
ai_css_path = r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\css\ai.css"

with open(ai_css_path, "r", encoding="utf-8") as f:
    css = f.read()

extra_styles = """
/* Origin Badge & Mic Styling */
.planner-origin-bar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(82, 183, 136, 0.12);
  border: 1px solid rgba(82, 183, 136, 0.35);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12.5px;
  color: #1b4332;
  margin-top: 10px;
  backdrop-filter: blur(8px);
}
[data-theme="dark"] .planner-origin-bar {
  background: rgba(27, 67, 50, 0.6) !important;
  border-color: rgba(52, 211, 153, 0.35) !important;
  color: #e2eff5 !important;
}
.detected-origin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #2d6a4f;
  cursor: pointer;
}
[data-theme="dark"] .detected-origin-badge {
  color: #6ee7b7 !important;
}
.origin-source-tag {
  font-size: 10px;
  text-transform: uppercase;
  background: rgba(45, 106, 79, 0.15);
  color: #1b4332;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 800;
  letter-spacing: 0.04em;
}
[data-theme="dark"] .origin-source-tag {
  background: rgba(52, 211, 153, 0.2) !important;
  color: #34d399 !important;
}
.change-origin-btn {
  background: none;
  border: none;
  font-size: 11px;
  color: #2d6a4f;
  cursor: pointer;
  padding: 2px 4px;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.change-origin-btn:hover {
  opacity: 1;
  text-decoration: underline;
}
[data-theme="dark"] .change-origin-btn {
  color: #a7f3d0 !important;
}
.chat-origin-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(82, 183, 136, 0.12);
  border: 1px solid rgba(82, 183, 136, 0.3);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  color: #1b4332;
  margin-left: 8px;
}
[data-theme="dark"] .chat-origin-chip {
  background: rgba(27, 67, 50, 0.5) !important;
  border-color: rgba(52, 211, 153, 0.3) !important;
  color: #a7f3d0 !important;
}
.chat-mic-btn {
  background: transparent;
  border: 1px solid rgba(82, 183, 136, 0.35);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #2d6a4f;
  transition: all 0.2s ease;
  margin: 0 4px;
  flex-shrink: 0;
}
.chat-mic-btn:hover {
  background: rgba(82, 183, 136, 0.15);
  transform: scale(1.05);
}
.chat-mic-btn.listening {
  background: #e63946 !important;
  color: #fff !important;
  border-color: #e63946 !important;
  animation: pulseRed 1.2s infinite;
}
@keyframes pulseRed {
  0% { box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(230, 57, 70, 0); }
  100% { box-shadow: 0 0 0 0 rgba(230, 57, 70, 0); }
}
[data-theme="dark"] .chat-mic-btn {
  color: #74c69d !important;
  border-color: rgba(52, 211, 153, 0.3) !important;
}
.inbuilt-chat-cards-wrap {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.inbuilt-chat-cards-wrap .agent-card,
.inbuilt-chat-cards-wrap .itinerary-day-box,
.inbuilt-chat-cards-wrap .planner-hotel-card,
.inbuilt-chat-cards-wrap .planner-flight-card {
  width: 100%;
  box-sizing: border-box;
}
"""

if ".chat-origin-chip" not in css:
    with open(ai_css_path, "a", encoding="utf-8") as f:
        f.write(extra_styles)
    print("SUCCESS: Appended extra styles to ai.css")
else:
    print("Already present")
