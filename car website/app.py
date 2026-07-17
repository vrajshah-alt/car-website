from flask import Flask, render_template, request, jsonify, send_from_directory, redirect
import json
import os
import random

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

BOOKINGS_FILE = 'data/bookings.json'
LISTINGS_FILE = 'data/listings.json'

@app.route('/api/booking', methods=['POST'])
def create_booking():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        bookings = []
        if os.path.exists(BOOKINGS_FILE):
            with open(BOOKINGS_FILE, 'r') as f:
                try:
                    bookings = json.load(f)
                except Exception:
                    bookings = []
                    
        bookings.append(data)
        with open(BOOKINGS_FILE, 'w') as f:
            json.dump(bookings, f, indent=4)
            
        return jsonify({"success": True, "bookingId": data.get("bookingId")}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sell-car', methods=['POST'])
def create_listing():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        listings = []
        if os.path.exists(LISTINGS_FILE):
            with open(LISTINGS_FILE, 'r') as f:
                try:
                    listings = json.load(f)
                except Exception:
                    listings = []
                    
        listings.append(data)
        with open(LISTINGS_FILE, 'w') as f:
            json.dump(listings, f, indent=4)
            
        return jsonify({"success": True, "listingId": data.get("id")}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

ACTIVE_OTPS = {}
USERS_FILE = 'data/users.json'

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        phone = data.get('phone')
        if not phone or len(phone) < 10:
            return jsonify({"error": "Valid phone number is required"}), 400
            
        # Generate random 6 digit OTP
        otp = str(random.randint(100000, 999999))
        ACTIVE_OTPS[phone] = otp
        
        print(f"========================================")
        print(f" OTP for {phone} is: {otp}")
        print(f"========================================")
        
        return jsonify({"success": True, "otp": otp}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        phone = data.get('phone')
        otp = data.get('otp')
        
        if not phone or not otp:
            return jsonify({"error": "Phone and OTP are required"}), 400
            
        expected_otp = ACTIVE_OTPS.get(phone)
        if expected_otp == otp:
            # Clear OTP after verification
            if phone in ACTIVE_OTPS:
                del ACTIVE_OTPS[phone]
                
            # Register user if they don't exist
            users = []
            if os.path.exists(USERS_FILE):
                with open(USERS_FILE, 'r') as f:
                    try:
                        users = json.load(f)
                    except Exception:
                        users = []
            
            # Check if user already exists
            user_exists = False
            for u in users:
                if u.get('phone') == phone:
                    user_exists = True
                    user = u
                    break
            
            if not user_exists:
                user = {
                    "phone": phone,
                    "name": f"User {phone[-4:]}",
                    "registeredAt": os.popen('date').read().strip()
                }
                users.append(user)
                with open(USERS_FILE, 'w') as f:
                    json.dump(users, f, indent=4)
                    
            return jsonify({"success": True, "user": user}), 200
        else:
            return jsonify({"error": "Invalid OTP. Please try again."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Antigravity Server on http://localhost:{port}")
    app.run(debug=True, host='127.0.0.1', port=port)
