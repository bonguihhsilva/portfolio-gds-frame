require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // Nó local rodando no serviço `chain` do docker-compose.
    docker: { url: "http://chain:8545" },
  },
};
