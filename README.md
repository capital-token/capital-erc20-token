# capital-erc20-token

Capital ERC20 token implementation.

## Deploy token

```
npm run deploy-<bsc|local|mainnet|rinkeby>
```

## Upgrade token

```
npm run upgrade-<bsc|local|mainnet|rinkeby>
```

## Transfer proxy admin ownership

```
npx hardhat run --network <bsc|local|mainnet|rinkeby> scripts/transferOwnership.js
```

## Verify contract

```
npx hardhat verify --network <bsc|mainnet|rinkeby> <contract address>
```