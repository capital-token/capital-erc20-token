const config               = require('../lib/config');
const { ethers, upgrades } = require('hardhat');
const { expect }           = require('chai');

const { account, decimals, initialSupply } = config;

describe('CapitalToken', function() {

  before(async function() {

    const [ owner, other ] = await ethers.getSigners();

    this.other = other,
    this.owner = owner;
  });

  before(async function() {
    this.Capital = await ethers.getContractFactory('CapitalToken');
  });

  beforeEach(async function() {

    this.capital = await upgrades.deployProxy(this.Capital, [account, initialSupply]);

    await this.capital.deployed();
  });

  describe('Deployment', function() {

    it('account has admin role', async function() {

      const role = await this.capital.DEFAULT_ADMIN_ROLE();

      const result = await this.capital.hasRole(role, account);

      expect(result).to.equal(true);
    });

    it('account has minter role', async function() {

      const role = await this.capital.MINTER_ROLE();

      const result = await this.capital.hasRole(role, account);

      expect(result).to.equal(true);
    });

    it('account has pauser role', async function() {

      const role = await this.capital.PAUSER_ROLE();

      const result = await this.capital.hasRole(role, account);

      expect(result).to.equal(true);
    });

    it('account holds the total supply', async function() {

      const balance = await this.capital.balanceOf(this.owner.address);
      const supply  = await this.capital.totalSupply();

      expect(balance).to.equal(supply);
    });

    it('total supply equals initial supply', async function() {

      const value = await this.capital.totalSupply();

      expect(value.toString()).to.equal(initialSupply.toString());
    });

    it('decimals returns the configured value', async function() {

      const value = await this.capital.decimals();

      expect(value).to.equal(decimals);
    });
  });

  describe('Administration', function() {

    it('account can mint new tokens', async function() {

      const amount = 1000;

      const oldSupply = await this.capital.totalSupply();

      await this.capital.mint(this.owner.address, amount);

      const newSupply = await this.capital.totalSupply();

      expect(newSupply).to.equal(oldSupply.add(amount));
    });

    it('account can burn tokens', async function() {

      const amount = 1000;

      const oldSupply = await this.capital.totalSupply();

      await this.capital.burn(amount);

      const newSupply = await this.capital.totalSupply();

      expect(newSupply).to.equal(oldSupply.sub(amount));
    });

    it('account can pause and unpause the contract', async function() {

      await this.capital.pause();

      await this.capital.unpause();
    });

    it('account can grant minter role', async function() {

      const role = await this.capital.MINTER_ROLE();

      await this.capital.grantRole(role, this.other.address);

      const hasRole = await this.capital.hasRole(role, this.other.address);

      expect(hasRole).to.equal(true);
    });

    it('account can grant pauser role', async function() {

      const role = await this.capital.PAUSER_ROLE();

      await this.capital.grantRole(role, this.other.address);

      const hasRole = await this.capital.hasRole(role, this.other.address);

      expect(hasRole).to.equal(true);
    });

    it('other account cannot mint new tokens', async function() {

      const role = await this.capital.MINTER_ROLE();

      const task = this.capital.connect(this.other).mint(this.owner.address, 1);

      await expect(task).to.be.revertedWith(
        `revert AccessControl: account ${this.other.address.toLowerCase()} is missing role ${role}`
      );
    });

    it('other account cannot pause the contract', async function() {

      const role = await this.capital.PAUSER_ROLE();

      const task = this.capital.connect(this.other).pause();

      await expect(task).to.be.revertedWith(
        `revert AccessControl: account ${this.other.address.toLowerCase()} is missing role ${role}`
      );
    });

    it('other account cannot unpause the contract', async function() {

      await this.capital.pause();

      const role = await this.capital.PAUSER_ROLE();

      const task = this.capital.connect(this.other).unpause();

      await expect(task).to.be.revertedWith(
        `revert AccessControl: account ${this.other.address.toLowerCase()} is missing role ${role}`
      );
    });

    it('other account cannot grant any role', async function() {

      const role = await this.capital.DEFAULT_ADMIN_ROLE();

      const task = this.capital.connect(this.other).grantRole(role, this.other.address);

      await expect(task).to.be.revertedWith(
        `revert AccessControl: account ${this.other.address.toLowerCase()} is missing role ${role}`
      )
    });
  });

  describe('Transactions', function() {

    it('can transfer tokens between accounts', async function () {

      const amount = 1000;
      const to     = this.other.address;

      await this.capital.transfer(to, amount);

      const balance = await this.capital.balanceOf(to);

      expect(balance).to.equal(amount);
    });

    it('cannot transfer tokens if balance is not enough', async function () {

      const balance = await this.capital.balanceOf(this.owner.address);

      const task = this.capital.transfer(this.other.address, balance.add(1));

      await expect(task).to.be.revertedWith(`revert ERC20: transfer amount exceeds balance`);
    });

    it('account can transfer tokens while contract is paused', async function() {

      await this.capital.pause();

      const amount = 1;
      const to     = this.other.address;

      await this.capital.transfer(to, amount);

      const balance = await this.capital.balanceOf(to);

      expect(balance).to.equal(amount);
    });

    it('account can mint new tokens while contract is paused', async function() {

      await this.capital.pause();

      await this.capital.mint(this.owner.address, 1);
    });

    it('other account cannot transfer tokens while contract is paused', async function() {

      await this.capital.pause();

      const task = this.capital.connect(this.other).transfer(this.owner.address, 1);

      await expect(task).to.be.revertedWith('revert Capital: token transfer while paused');
    });
  });
});
