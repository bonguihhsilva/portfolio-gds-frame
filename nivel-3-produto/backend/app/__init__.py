import hmac
import json
import os
from pathlib import Path

from flask import Flask, jsonify, request

from .certificates import AlreadyIssued, Chain, ChainUnavailable
from .chat import MAX_MESSAGE, ChatUnavailable, N8nChat, clean_history
from .recommender import Recommender

DEFAULT_CATALOG = Path(__file__).resolve().parent.parent / "data" / "catalog.json"


def create_app(chain=None, catalog_path=DEFAULT_CATALOG, admin_token=None, chat=None):
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 20_000
    products = json.loads(Path(catalog_path).read_text(encoding="utf-8"))
    by_slug = {p["slug"]: p for p in products}
    recommender = Recommender(products)
    admin_token = os.environ.get("ADMIN_TOKEN", "") if admin_token is None else admin_token
    chain = chain or Chain(
        os.environ.get("CHAIN_RPC_URL", "http://chain:8545"),
        os.environ.get("DEPLOYMENT_FILE", "/shared/deployment.json"),
    )

    chat = chat or N8nChat(os.environ.get("N8N_WEBHOOK_URL", "http://n8n:5678/webhook/loja-chat"))

    @app.post("/api/chat")
    def chat_message():
        body = request.get_json(silent=True) or {}
        message = body.get("message")
        if not isinstance(message, str) or not message.strip() or len(message.strip()) > MAX_MESSAGE:
            return {"error": f"envie uma mensagem de até {MAX_MESSAGE} caracteres"}, 400
        try:
            return chat.ask(message.strip(), clean_history(body.get("history")))
        except ChatUnavailable:
            return {
                "error": "atendimento automático indisponível",
                "reply": "O atendimento automático está fora do ar. A vendedora atende você pelo WhatsApp.",
                "handoff": True,
                "suggestions": [],
                "products": [],
                "source": "fallback",
            }, 503

    @app.get("/api/health")
    def health():
        return {"status": "ok", "products": len(products)}

    @app.get("/api/products")
    def list_products():
        category = request.args.get("category")
        return jsonify([p for p in products if not category or p["category"] == category])

    @app.get("/api/products/<slug>")
    def get_product(slug):
        if slug not in by_slug:
            return {"error": "produto não encontrado"}, 404
        return by_slug[slug]

    @app.get("/api/recommendations")
    def recommendations():
        slugs = [s for s in request.args.get("slugs", "").split(",") if s]
        limit = min(request.args.get("limit", default=4, type=int), 12)
        return jsonify([{**by_slug[r["slug"]], "score": r["score"], "sharedNotes": r["sharedNotes"]} for r in recommender.recommend(slugs, limit)])

    @app.post("/api/certificates")
    def issue_certificate():
        if not admin_token:
            return {"error": "emissão desabilitada: defina ADMIN_TOKEN"}, 503
        if not hmac.compare_digest(request.headers.get("X-Admin-Token", ""), admin_token):
            return {"error": "não autorizado"}, 401
        body = request.get_json(silent=True) or {}
        product, lot = by_slug.get(body.get("slug")), str(body.get("lot", "")).strip()
        if not product or not lot:
            return {"error": "informe slug válido e lot"}, 400
        try:
            tx = chain.issue(product, lot)
        except AlreadyIssued:
            return {"error": "certificado já emitido para este lote"}, 409
        except ChainUnavailable as exc:
            return {"error": f"blockchain indisponível: {exc}"}, 503
        return {"slug": product["slug"], "lot": lot, "tx": tx}, 201

    @app.get("/api/certificates/<slug>/<lot>")
    def verify_certificate(slug, lot):
        if slug not in by_slug:
            return {"error": "produto não encontrado"}, 404
        try:
            return chain.verify(by_slug[slug], lot)
        except ChainUnavailable as exc:
            return {"error": f"blockchain indisponível: {exc}"}, 503

    return app
