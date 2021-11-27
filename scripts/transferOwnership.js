const assert               = require('assert');
const config               = require('../lib/config');
const { ethers, upgrades } = require('hardhat');

async function main() {

  const { proxyOwner } = config;

  assert(ethers.utils.isAddress(proxyOwner), 'Invalid proxy owner address');
  
  console.log('[+] Transferring ownership of ProxyAdmin...');

  await upgrades.admin.transferProxyAdminOwnership(proxyOwner);

  console.log(`[+] Transferred ownership of ProxyAdmin to: ${proxyOwner}`);
}

main().catch(console.error);
