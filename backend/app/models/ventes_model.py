# models/ventes_model.py

class Vente:
    def __init__(self, vente_id, produit, client, date, montant):
        self.vente_id = vente_id
        self.produit = produit
        self.client = client
        self.date = date
        self.montant = montant
