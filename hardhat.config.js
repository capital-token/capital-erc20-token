require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-defender');
require('@openzeppelin/hardhat-upgrades');
require('hardhat-abi-exporter');

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  solidity: {
    version: '0.8.1',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  networks: {
    mainnet: {
      url: 'https://nodes.mewapi.io/rpc/eth',
      accounts: [process.env.PRIVATE_KEY]
    },
    rinkeby: {
      url: 'https://nodes.mewapi.io/rpc/rinkeby',
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY,
    apiSecret: process.env.DEFENDER_API_SECRET,
  }
};
