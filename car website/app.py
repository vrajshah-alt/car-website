from flask import Flask, render_template, request, jsonify, send_from_directory, redirect
import json
import os

app = Flask(__name__, static_folder='.', template_folder='.')

# Mock database mapping from search.php
CAR_MAPPING = {
    "bmw": "BMW.html",
    "mercedes": "Mercedes.html",
    "jaguar": "Jaguar.html",
    "kia": "Kia.html",
    "maruti suzuki": "Maruti Suzuki.html",
    "maruti": "Maruti Suzuki.html",
    "toyota": "Toyota.html",
    "volkswagen": "volkswagen.html",
    "hundai": "Hundai.html",
    "hyundai": "Hundai.html",
    "rolls royce": "rolls royce.html",
    "mg": "mg.html",
    "land rover": "land rover.html",
    "audi": "audi.html",
    "lamborgini": "lamborgini.html"
}

# Ensure data directory exists
if not os.path.exists('data'):
    os.makedirs('data')

FEEDBACK_FILE = 'data/feedback.json'

@app.route('/')
def home():
    return send_from_directory('.', 'Home.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/search.php')
def search():
    webpage_name = request.args.get('webpage_name', '').lower().strip()
    
    # Simple search algorithm modeled after search.php
    target_file = None
    for key, val in CAR_MAPPING.items():
        if key in webpage_name:
            target_file = val
            break
            
    if target_file and os.path.exists(target_file):
        return redirect(f'/{target_file}')
    else:
        return "<h3>No results found for your search.</h3><a href='/Home.html'>Back to Home</a>", 404

@app.route('/database/database.php', methods=['GET', 'POST'])
def feedback():
    # Handle the feedback submission
    name = request.args.get('name') or request.form.get('name')
    email = request.args.get('email') or request.form.get('email')
    message = request.args.get('message') or request.form.get('message')
    
    if not name or not email or not message:
        return "Error: Missing data", 400
        
    feedback_entry = {
        "name": name,
        "email": email,
        "message": message
    }
    
    # Save to JSON file
    feedbacks = []
    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, 'r') as f:
            try:
                feedbacks = json.load(f)
            except:
                feedbacks = []
                
    feedbacks.append(feedback_entry)
    with open(FEEDBACK_FILE, 'w') as f:
        json.dump(feedbacks, f, indent=4)
        
    return f"""
    <script>
        alert('Thanks For Feedback!');
        window.location.href = '/Home.html';
    </script>
    """

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Antigravity Server on http://localhost:{port}")
    app.run(debug=True, host='127.0.0.1', port=port)
