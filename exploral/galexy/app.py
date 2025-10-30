from flask import Flask, render_template, request, jsonify
import wikipediaapi
import google.generativeai as genai
import os

# ---------- Config ----------
app = Flask(__name__)
USER_AGENT = "Wikipedia2025ExplorerPRO/6.0 (Deepak Singh)"
wiki = wikipediaapi.Wikipedia(language='en', user_agent=USER_AGENT)
genai.configure(api_key="AIzaSyCWBp_K8vDpyxVl05ALnO0AmnQtUifU1x0")
MODEL_NAME = "models/gemini-2.0-flash"

# ---------- Routes ----------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query', '').strip()
    if not query:
        return jsonify({"error": "Empty query"}), 400

    page = wiki.page(query)
    if not page.exists():
        return jsonify({"error": "No result found"}), 404

    summary = page.summary[:1500]
    title = page.title
    return jsonify({"title": title, "summary": summary})

@app.route('/ai_explain', methods=['POST'])
def ai_explain():
    data = request.json
    summary = data.get('summary', '')
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        आप एक दोस्ताना भारतीय AI सहायक "आशी" हैं।
        नीचे दिए गए विकिपीडिया टेक्स्ट को आसान हिंदी में 200 शब्दों में समझाइए:
        {summary}
        """
        response = model.generate_content(prompt)
        return jsonify({"result": response.text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    
