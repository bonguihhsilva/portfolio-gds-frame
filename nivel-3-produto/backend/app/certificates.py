"""Ponte entre a API e o smart contract ProductCertificate (registro de autenticidade por lote)."""
import json
from pathlib import Path

from web3 import Web3


def certificate_id(slug, lot):
    return Web3.keccak(text=f"{slug}|{lot}")


def data_hash(product, lot):
    """Hash canônico dos dados do produto. Se o cadastro mudar depois da emissão, a verificação falha."""
    payload = {
        "slug": product["slug"],
        "name": product["name"],
        "brand": product["brand"],
        "volumeMl": product["volumeMl"],
        "lot": lot,
    }
    return Web3.keccak(text=json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False))


class ChainUnavailable(Exception):
    pass


class AlreadyIssued(Exception):
    pass


class Chain:
    def __init__(self, rpc_url, deployment_path):
        self.rpc_url = rpc_url
        self.deployment_path = Path(deployment_path)
        self._w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={"timeout": 5}))

    def _connect(self):
        # O arquivo é relido a cada chamada: se o nó local for reiniciado e o contrato republicado,
        # o endereço novo vale sem reiniciar a API.
        try:
            deployment = json.loads(self.deployment_path.read_text())
            if not self._w3.is_connected():
                raise ConnectionError(self.rpc_url)
            return self._w3.eth.contract(address=deployment["address"], abi=deployment["abi"])
        except (OSError, ValueError, ConnectionError, KeyError) as exc:
            raise ChainUnavailable(str(exc)) from exc

    def issue(self, product, lot):
        if self.verify(product, lot)["exists"]:
            raise AlreadyIssued()
        contract = self._connect()
        try:
            # Conta 0 do nó local já vem desbloqueada: nenhuma chave privada precisa existir no projeto.
            tx = contract.functions.issue(certificate_id(product["slug"], lot), data_hash(product, lot)).transact(
                {"from": self._w3.eth.accounts[0]}
            )
            self._w3.eth.wait_for_transaction_receipt(tx)
        except Exception as exc:
            raise ChainUnavailable(str(exc)) from exc
        return Web3.to_hex(tx)

    def verify(self, product, lot):
        contract = self._connect()
        exists, matches, revoked, issued_at = contract.functions.verify(
            certificate_id(product["slug"], lot), data_hash(product, lot)
        ).call()
        return {
            "exists": exists,
            "matches": matches,
            "revoked": revoked,
            "issuedAt": issued_at,
            "valid": exists and matches and not revoked,
        }
