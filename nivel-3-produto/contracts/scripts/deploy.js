const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const out = process.env.DEPLOYMENT_FILE || path.join(__dirname, "..", "deployment.json");

  // Idempotente: um `docker compose up` repetido não pode zerar os certificados já emitidos.
  // Só republica se o contrato registrado não existir mais na rede (nó reiniciado).
  if (fs.existsSync(out)) {
    const { address } = JSON.parse(fs.readFileSync(out, "utf-8"));
    if ((await hre.ethers.provider.getCode(address)) !== "0x") {
      console.log(`ProductCertificate já publicado em ${address}`);
      return;
    }
  }

  const cert = await (await hre.ethers.getContractFactory("ProductCertificate")).deploy();
  await cert.waitForDeployment();
  const address = await cert.getAddress();

  const artifact = await hre.artifacts.readArtifact("ProductCertificate");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ address, abi: artifact.abi }, null, 2));
  console.log(`ProductCertificate em ${address} -> ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
