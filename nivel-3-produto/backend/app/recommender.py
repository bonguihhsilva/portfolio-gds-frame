"""Recomendação baseada em conteúdo: TF-IDF sobre atributos do produto + similaridade de cosseno."""
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _notes(product):
    n = product["notes"]
    return n["saida"] + n["coracao"] + n["fundo"]


def _document(product):
    # Repetição = peso: notas olfativas e família pesam mais que o texto de marketing.
    parts = [product["category"]] * 2 + [product["brand"]] + [product["line"]] * 2
    parts += _notes(product) * 3 + [product["description"]]
    return " ".join(parts)


class Recommender:
    def __init__(self, products):
        self.products = products
        self.index = {p["slug"]: i for i, p in enumerate(products)}
        vectorizer = TfidfVectorizer(strip_accents="unicode", lowercase=True)
        self.matrix = vectorizer.fit_transform(_document(p) for p in products)

    def recommend(self, slugs, limit=4):
        """Produtos mais parecidos com o perfil médio dos `slugs` informados (ex.: itens do carrinho)."""
        liked = [self.index[s] for s in slugs if s in self.index]
        if not liked:
            return []

        profile = np.asarray(self.matrix[liked].mean(axis=0))
        scores = cosine_similarity(profile, self.matrix).ravel()
        for i, p in enumerate(self.products):
            if i in liked or not p["available"]:
                scores[i] = -1

        liked_notes = {n for i in liked for n in _notes(self.products[i])}
        result = []
        for i in np.argsort(-scores)[:limit]:
            if scores[i] <= 0:
                break
            shared = sorted(liked_notes & set(_notes(self.products[i])))
            result.append({"slug": self.products[i]["slug"], "score": round(float(scores[i]), 3), "sharedNotes": shared})
        return result
