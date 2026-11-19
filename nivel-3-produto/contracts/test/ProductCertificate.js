const { expect } = require("chai");
const { ethers } = require("hardhat");

const id = ethers.keccak256(ethers.toUtf8Bytes("asad-100ml|L1"));
const hash = ethers.keccak256(ethers.toUtf8Bytes("dados-do-produto"));
const outroHash = ethers.keccak256(ethers.toUtf8Bytes("dados-adulterados"));

async function deploy() {
  const [owner, estranho] = await ethers.getSigners();
  const cert = await (await ethers.getContractFactory("ProductCertificate")).deploy();
  return { cert, owner, estranho };
}

describe("ProductCertificate", () => {
  it("emite certificado e permite verificar", async () => {
    const { cert } = await deploy();
    await expect(cert.issue(id, hash)).to.emit(cert, "CertificateIssued").withArgs(id, hash);

    const [exists, matches, revoked, issuedAt] = await cert.verify(id, hash);
    expect(exists).to.equal(true);
    expect(matches).to.equal(true);
    expect(revoked).to.equal(false);
    expect(issuedAt).to.be.greaterThan(0n);
  });

  it("detecta dados diferentes do que foi registrado", async () => {
    const { cert } = await deploy();
    await cert.issue(id, hash);
    const [exists, matches] = await cert.verify(id, outroHash);
    expect(exists).to.equal(true);
    expect(matches).to.equal(false);
  });

  it("lote nunca emitido não existe", async () => {
    const { cert } = await deploy();
    const [exists] = await cert.verify(id, hash);
    expect(exists).to.equal(false);
  });

  it("só o dono emite e revoga", async () => {
    const { cert, estranho } = await deploy();
    await expect(cert.connect(estranho).issue(id, hash)).to.be.revertedWithCustomError(cert, "NotOwner");
    await cert.issue(id, hash);
    await expect(cert.connect(estranho).revoke(id)).to.be.revertedWithCustomError(cert, "NotOwner");
  });

  it("não deixa reescrever um certificado já emitido", async () => {
    const { cert } = await deploy();
    await cert.issue(id, hash);
    await expect(cert.issue(id, outroHash)).to.be.revertedWithCustomError(cert, "AlreadyIssued");
  });

  it("rejeita hash vazio", async () => {
    const { cert } = await deploy();
    await expect(cert.issue(id, ethers.ZeroHash)).to.be.revertedWithCustomError(cert, "EmptyHash");
  });

  it("revogação marca o certificado como revogado", async () => {
    const { cert } = await deploy();
    await cert.issue(id, hash);
    await expect(cert.revoke(id)).to.emit(cert, "CertificateRevoked").withArgs(id);
    const [, , revoked] = await cert.verify(id, hash);
    expect(revoked).to.equal(true);
  });

  it("não revoga o que nunca foi emitido", async () => {
    const { cert } = await deploy();
    await expect(cert.revoke(id)).to.be.revertedWithCustomError(cert, "NotFound");
  });
});
