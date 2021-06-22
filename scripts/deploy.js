const assert               = require('assert');
const config               = require('../lib/config');
const { ethers, upgrades } = require('hardhat');

function getInitialSupply() {

  const { decimals, initialSupply } = config;

  assert(decimals >= 0 && decimals <= 18, 'Invalid decimals value');

  assert(initialSupply > 0, 'Invalid initial supply value');

  return ethers.BigNumber.from(initialSupply).mul(10 ** decimals);
}


async function main() {

  const { admin } = config;

  assert(ethers.utils.isAddress(admin), 'Invalid admin address');

  const initialSupply = getInitialSupply();

  const Capital = await ethers.getContractFactory('CapitalToken');

  console.log(`[+] Deploying CPL token (admin = ${admin}, supply = ${initialSupply})...`);

  const capital = await upgrades.deployProxy(Capital, [admin, initialSupply]);

  await capital.deployed();
  
  console.log(`[+] CPL token deployed to: ${capital.address}`);
}

main().catch(console.error);
