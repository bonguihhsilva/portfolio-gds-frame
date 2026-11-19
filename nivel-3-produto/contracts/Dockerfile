FROM node:24.22.1-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx hardhat compile
# Padrão: nó blockchain local. O serviço `deployer` sobrescreve o comando para publicar o contrato.
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]
