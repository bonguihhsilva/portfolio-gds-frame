import json
from pathlib import Path

import pytest

from app import create_app
from app.certificates import AlreadyIssued, ChainUnavailable, data_hash
from app.recommender import Recommender

CATALOG = Path(__file__).resolve().parent.parent / "data" / "catalog.json"
PRODUCTS = json.loads(CATALOG.read_text(encoding="utf-8"))
BY_SLUG = {p["slug"]: p for p in PRODUCTS}


def slugs(recs):
    return [r["slug"] for r in recs]


def test_recomendacao_prefere_a_mesma_familia_olfativa():
    recs = Recommender(PRODUCTS).recommend(["khamrah-100ml"], limit=3)
    # Khamrah é árabe, oriental gourmand, canela/âmbar/baunilha: vizinhos devem ser perfumes, não maquiagem.
    assert recs and all(BY_SLUG[s]["category"].startswith("perfumes") for s in slugs(recs))
    assert recs[0]["sharedNotes"]


def test_recomendacao_nao_repete_item_nem_indisponivel():
    recs = Recommender(PRODUCTS).recommend(["asad-100ml"], limit=12)
    assert "asad-100ml" not in slugs(recs)
    assert all(BY_SLUG[s]["available"] for s in slugs(recs))


def test_recomendacao_de_skincare_fica_no_skincare():
    top = Recommender(PRODUCTS).recommend(["serum-vitamina-c-30ml"], limit=1)
    assert BY_SLUG[top[0]["slug"]]["category"] == "skin-care"


def test_recomendacao_com_varios_itens_e_slug_invalido():
    rec = Recommender(PRODUCTS)
    assert rec.recommend(["nao-existe"]) == []
    assert rec.recommend(["khamrah-100ml", "asad-100ml"], limit=4)


class FakeChain:
    def __init__(self):
        self.issued = {}

    def issue(self, product, lot):
        key = (product["slug"], lot)
        if key in self.issued:
            raise AlreadyIssued()
        self.issued[key] = data_hash(product, lot)
        return "0xabc"

    def verify(self, product, lot):
        stored = self.issued.get((product["slug"], lot))
        matches = stored == data_hash(product, lot)
        return {"exists": stored is not None, "matches": matches, "revoked": False, "issuedAt": 1, "valid": stored is not None and matches}


@pytest.fixture
def client():
    return create_app(chain=FakeChain(), admin_token="t").test_client()


def test_health_e_catalogo(client):
    assert client.get("/api/health").get_json()["products"] == 25
    assert len(client.get("/api/products?category=skin-care").get_json()) == 5
    assert client.get("/api/products/nao-existe").status_code == 404


def test_endpoint_de_recomendacao(client):
    recs = client.get("/api/recommendations?slugs=khamrah-100ml&limit=3").get_json()
    assert len(recs) == 3 and "score" in recs[0] and "name" in recs[0]


def test_emitir_exige_token(client):
    body = {"slug": "asad-100ml", "lot": "L1"}
    assert client.post("/api/certificates", json=body).status_code == 401
    assert client.post("/api/certificates", json=body, headers={"X-Admin-Token": "t"}).status_code == 201
    assert client.post("/api/certificates", json=body, headers={"X-Admin-Token": "t"}).status_code == 409


def test_emissao_desabilitada_sem_token_configurado():
    c = create_app(chain=FakeChain(), admin_token="").test_client()
    assert c.post("/api/certificates", json={"slug": "asad-100ml", "lot": "L1"}).status_code == 503


def test_verificacao_detecta_adulteracao_dos_dados(client, tmp_path):
    client.post("/api/certificates", json={"slug": "asad-100ml", "lot": "L1"}, headers={"X-Admin-Token": "t"})
    assert client.get("/api/certificates/asad-100ml/L1").get_json()["valid"] is True
    assert client.get("/api/certificates/asad-100ml/L2").get_json()["valid"] is False

    # Mesmo lote, mas o cadastro mudou (volume): o hash não bate mais.
    adulterado = [dict(p, volumeMl=50) if p["slug"] == "asad-100ml" else p for p in PRODUCTS]
    cat = tmp_path / "catalog.json"
    cat.write_text(json.dumps(adulterado), encoding="utf-8")
    chain = FakeChain()
    chain.issued[("asad-100ml", "L1")] = data_hash(BY_SLUG["asad-100ml"], "L1")
    c2 = create_app(chain=chain, catalog_path=cat, admin_token="t").test_client()
    assert c2.get("/api/certificates/asad-100ml/L1").get_json()["matches"] is False


def test_blockchain_fora_do_ar_vira_503():
    class Down:
        def verify(self, *a):
            raise ChainUnavailable("sem rpc")

    c = create_app(chain=Down(), admin_token="t").test_client()
    assert c.get("/api/certificates/asad-100ml/L1").status_code == 503
