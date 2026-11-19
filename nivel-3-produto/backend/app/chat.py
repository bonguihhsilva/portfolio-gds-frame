"""Ponte com o chatbot: o workflow `chat-loja` do n8n. O navegador nunca fala direto com o n8n."""
import json
import urllib.error
import urllib.request

MAX_MESSAGE = 500
MAX_HISTORY = 6


class ChatUnavailable(Exception):
    pass


def clean_history(raw):
    items = raw if isinstance(raw, list) else []
    valid = [
        {"role": h["role"], "text": h["text"][:MAX_MESSAGE]}
        for h in items
        if isinstance(h, dict) and h.get("role") in ("user", "bot") and isinstance(h.get("text"), str)
    ]
    return valid[-MAX_HISTORY:]


def clean_reply(data):
    """Só passa adiante o que o frontend espera. O n8n também devolve campos de diagnóstico (motivo, score)."""
    if not isinstance(data, dict) or not isinstance(data.get("reply"), str):
        raise ChatUnavailable("resposta inesperada do n8n")
    products = [
        {"slug": str(p.get("slug", "")), "name": str(p.get("name", "")), "available": bool(p.get("available", True))}
        for p in (data.get("products") or [])
        if isinstance(p, dict) and p.get("slug")
    ][:3]
    return {
        "reply": data["reply"],
        "handoff": data.get("handoff") is True,
        "suggestions": [s for s in (data.get("suggestions") or []) if isinstance(s, str)][:6],
        "products": products,
        "source": str(data.get("source", "")),
    }


class N8nChat:
    def __init__(self, url, timeout=25):
        self.url = url
        self.timeout = timeout

    def ask(self, message, history):
        request = urllib.request.Request(
            self.url,
            data=json.dumps({"message": message, "history": history}).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                return clean_reply(json.loads(response.read()))
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            raise ChatUnavailable(str(exc)) from exc
