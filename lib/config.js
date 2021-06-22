const config = require('../config');

const network = process.env.HARDHAT_NETWORK || 'localhost';

module.exports = config[network];
