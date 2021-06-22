const assert               = require('assert');
const config               = require('../lib/config');
const { ethers, upgrades } = require('hardhat');

async function main() {

  const { address } = config;

  assert(ethers.utils.isAddress(address), 'Invalid contract address');

  const Capital = await ethers.getContractFactory('CapitalToken');

  console.log('[+] Upgrading CPL token...');

  await upgrades.upgradeProxy(address, Capital);
  
  console.log('[+] CPL token upgraded');
}

main().catch(console.error);
