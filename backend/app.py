from flask import Flask
from app.routes.ventes import ventes_bp
from app.routes.analyse import analyse_bp
from app.routes.finance import finance_bp
from app.routes.risk_score import risk_score_bp

app = Flask(__name__)

# Enregistrer les Blueprints
app.register_blueprint(ventes_bp, url_prefix='/sales')
app.register_blueprint(analyse_bp, url_prefix='/analytics')
app.register_blueprint(finance_bp, url_prefix='/finance')
app.register_blueprint(risk_score_bp, url_prefix='/risk')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')