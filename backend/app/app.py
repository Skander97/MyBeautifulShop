# app.py
from flask import Flask
from routes.ventes import ventes_bp
from routes.analyse import analyse_bp
from routes.finance import finance_bp

app = Flask(__name__)

# Enregistrer les Blueprints
app.register_blueprint(ventes_bp, url_prefix='/sales')
app.register_blueprint(analyse_bp, url_prefix='/analytics')
app.register_blueprint(finance_bp, url_prefix='/finance')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
