from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)
incidents = []

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/incidents", methods=["POST"])
def create_incident():
    data = request.get_json()
    incident = {
        "id": len(incidents) + 1,
        "title": data.get("title", "Untitled"),
        "description": data.get("description", ""),
        "timestamp": datetime.utcnow().isoformat()
    }
    incidents.append(incident)
    return jsonify(incident), 201

@app.route("/incidents", methods=["GET"])
def list_incidents():
    return jsonify(incidents), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)