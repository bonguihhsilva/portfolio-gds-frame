import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

from app import create_app
from app.chat import ChatUnavailable, N8nChat, clean_history, clean_reply


class FakeChat:
    def __init__(self, reply=None, error=None):
        self.reply, self.error, self.calls = reply, error, []

    def ask(self, message, history):
        self.calls.append((message, history))
        if self.error:
            raise self.error
        return self.reply


OK = {"reply": "Olá", "handoff": False, "suggestions": [], "products": [], "source": "faq"}


def client_with(chat):
    return create_app(chain=object(), admin_token="t", chat=chat).test_client()


def test_rejeita_mensagem_vazia_ou_longa_demais():
    chat = FakeChat(OK)
    client = client_with(chat)
    for body in ({}, {"message": ""}, {"message": "   "}, {"message": 42}, {"message": "a" * 501}):
        assert client.post("/api/chat", json=body).status_code == 400
    assert chat.calls == []


def test_repassa_mensagem_limpa_e_historico_filtrado():
    chat = FakeChat(OK)
    history = [{"role": "user", "text": f"m{i}"} for i in range(9)] + [{"role": "admin", "text": "x"}, "lixo", {"role": "bot"}]
    res = client_with(chat).post("/api/chat", json={"message": "  oi  ", "history": history})
    assert res.status_code == 200 and res.get_json()["reply"] == "Olá"
    message, sent = chat.calls[0]
    assert message == "oi"
    assert [h["text"] for h in sent] == [f"m{i}" for i in range(3, 9)]


def test_n8n_fora_do_ar_vira_503_com_saida_para_o_whatsapp():
    res = client_with(FakeChat(error=ChatUnavailable("sem n8n"))).post("/api/chat", json={"message": "oi"})
    assert res.status_code == 503
    assert res.get_json()["handoff"] is True


def test_resposta_do_n8n_e_filtrada_para_os_campos_esperados():
    raw = {**OK, "motivo": "diagnostico interno", "score": 0.9, "products": [{"slug": "asad-100ml", "name": "Lattafa Asad", "available": True, "extra": 1}, {"nome": "sem slug"}]}
    clean = clean_reply(raw)
    assert set(clean) == {"reply", "handoff", "suggestions", "products", "source"}
    assert clean["products"] == [{"slug": "asad-100ml", "name": "Lattafa Asad", "available": True}]
    with pytest.raises(ChatUnavailable):
        clean_reply({"semreply": 1})
    assert clean_history("não é lista") == []


class _N8nStub(BaseHTTPRequestHandler):
    seen = {}

    def do_POST(self):
        _N8nStub.seen = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        body = json.dumps({**OK, "motivo": "interno"}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


def test_n8nchat_fala_http_de_verdade_com_um_servidor_local():
    server = HTTPServer(("127.0.0.1", 0), _N8nStub)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        reply = N8nChat(f"http://127.0.0.1:{server.server_port}/webhook/loja-chat").ask("oi", [{"role": "user", "text": "a"}])
    finally:
        server.shutdown()
    assert _N8nStub.seen == {"message": "oi", "history": [{"role": "user", "text": "a"}]}
    assert reply["reply"] == "Olá" and "motivo" not in reply


def test_n8nchat_sem_servidor_levanta_chatunavailable():
    with pytest.raises(ChatUnavailable):
        N8nChat("http://127.0.0.1:1/webhook/loja-chat", timeout=1).ask("oi", [])
