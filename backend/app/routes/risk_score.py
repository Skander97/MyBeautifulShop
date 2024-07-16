# routes/risk_score.py
from flask import Blueprint, request, jsonify
from utils.database import get_analytics_collection  # Suppose the risk scores are part of analytics
from utils.helpers import json_serializable

risk_score_bp = Blueprint('risk_score', __name__)

@risk_score_bp.route('/', methods=['GET'])
def get_risk_scores():
    analytics_collection = get_analytics_collection()
    risk_scores = list(analytics_collection.find())
    risk_scores = json_serializable(risk_scores)
    return jsonify(risk_scores)

@risk_score_bp.route('/calculate', methods=['POST'])
def calculate_risk_score():
    data = request.get_json()
    analytics_collection = get_analytics_collection()
    risk_score = compute_risk_score(data)
    analytics_collection.insert_one(risk_score)
    return jsonify({"message": "Risk score calculated and stored", "risk_score": json_serializable(risk_score)})

def compute_risk_score(data):
    # Exemple de calcul de score de risque
    weight_variability = 0.25
    weight_dependency = 0.25
    weight_stability = 0.25
    weight_satisfaction = 0.25

    risk_score = {
        'seller_id': data['seller_id'],
        'score': (
            weight_variability * data.get('variability', 0) +
            weight_dependency * data.get('dependency', 0) +
            weight_stability * data.get('stability', 0) +
            weight_satisfaction * data.get('satisfaction', 0)
        )
    }
    return risk_score
