from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Ajouter cette ligne pour permettre toutes les origines

from routes.ventes import ventes_bp
from routes.analyse import analytics_bp
from routes.finance import finance_bp
from routes.risk_score import risk_score_bp

app.register_blueprint(ventes_bp, url_prefix='/ventes')
app.register_blueprint(analytics_bp, url_prefix='/analytics')
app.register_blueprint(finance_bp, url_prefix='/finance')
app.register_blueprint(risk_score_bp, url_prefix='/risk_score')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
