const assert               = require('assert');
const config               = require('../lib/config');
const { defender, ethers } = require('hardhat');

async function main() {

  const { address } = config;

  assert(ethers.utils.isAddress(address), 'Invalid contract address');

  const Capital = await ethers.getContractFactory('CapitalToken');

  console.log(`[+] Creating upgrade proposal for CPA token... (address = ${address})`);

  const proposal = await defender.proposeUpgrade(address, Capital);
  
  console.log(`[+] CPA token upgrade proposal created: ${proposal.url}`);
}

main().catch(console.error);
