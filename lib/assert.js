const assert     = require('assert');
const { ethers } = require('hardhat');

module.exports = {

  ...assert,

  address(address, message) {
    assert.ok(ethers.utils.isAddress(address), message);
  },

  empty(str, message) {
    assert.ok(str?.trim()?.length, message);
  }
};
