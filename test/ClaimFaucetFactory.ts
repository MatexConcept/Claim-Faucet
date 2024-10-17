import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import hre from "hardhat";

describe("Claim Faucet Factory ", function () {
  async function deployClaimFaucetFactoryFixture() {
    const [deployer, otherAccount] = await hre.ethers.getSigners();

    const ClaimFaucetFactory = await hre.ethers.getContractFactory(
      "ClaimFaucetFactory"
    );
    const claimfaucetfactory = await ClaimFaucetFactory.deploy();


    return { claimfaucetfactory, deployer, otherAccount };
  }

  describe("Deploying ClaimFaucet contracts  ", () => {
    it("Should check if it deployed", async function () {
      const { claimfaucetfactory } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );
      expect(await claimfaucetfactory);
    });


    it("Should be able to deploy a new Claim Faucet", async function () {
        const { claimfaucetfactory, deployer } = await loadFixture(
            deployClaimFaucetFactoryFixture
          );
          const token = await claimfaucetfactory.connect(deployer).deployClaimFaucet("Opa Token", "OPK");
     
          token.wait();
          
      const deployedContracts = await claimfaucetfactory.getUserDeployedContracts();
      expect(deployedContracts.length).to.equal(1);
      expect(deployedContracts[0].deployer).to.equal(deployer.address);
    });

    it("Should be able to return all deployed contracts", async function () {
        const { claimfaucetfactory, deployer } = await loadFixture(deployClaimFaucetFactoryFixture);
        await claimfaucetfactory.connect(deployer).deployClaimFaucet("Opa Token", "OPK");
        await claimfaucetfactory.connect(deployer).deployClaimFaucet("Mato Token", "MAT");
  
        const allContracts = await claimfaucetfactory.getAllContractDeployed();
        expect(allContracts.length).to.equal(2);
      });

      it("Should be able to  retrieve user deployed contracts by index", async function () {
        const { claimfaucetfactory, deployer } = await loadFixture(deployClaimFaucetFactoryFixture);
        const token = await claimfaucetfactory.connect(deployer).deployClaimFaucet("Opa Token", "OPK");
        await token.wait();
  
        const deployedContract = await claimfaucetfactory.getUserDeployedContractByIndex(0);
        expect(deployedContract.deployer_).to.equal(deployer.address);
      });
      
      it("it Should revert when trying to get deployed contract by an out-of-bound index", async function () {
        const { claimfaucetfactory, deployer } = await loadFixture(deployClaimFaucetFactoryFixture);
        await claimfaucetfactory.connect(deployer).deployClaimFaucet("Opa Token", "OPK");
  
        await expect(claimfaucetfactory.getUserDeployedContractByIndex(1))
          .to.be.revertedWith("Out of bound");
      });
  

      
  
  });

  describe("Get token info from deployed contract", function () {
    it("Should retrieve token name and symbol from a deployed contract", async function () {
        const { claimfaucetfactory, deployer } = await loadFixture(deployClaimFaucetFactoryFixture);
       
        const token = await claimfaucetfactory.connect(deployer).deployClaimFaucet("DltToken", "DLT");
        await token.wait(); 

      
        const deployedContracts = await claimfaucetfactory.getUserDeployedContracts()

       
        const [tokenName, tokenSymbol] = await claimfaucetfactory.getInfoFromContract(deployedContracts[0].deployedContract);
        
        expect(tokenName).to.equal("DltToken");
        expect(tokenSymbol).to.equal("DLT");
    });
});

describe("Claim faucet from deployed contract and get balance", function () {
    it("Should allow a user to claim tokens from the faucet and get their balance", async function () {
        const { claimfaucetfactory, deployer } = await loadFixture(deployClaimFaucetFactoryFixture);
        
       
        const token = await claimfaucetfactory.connect(deployer).deployClaimFaucet("Mato Token", "MAT");
        await token.wait(); 

   
        const deployedContracts = await claimfaucetfactory.getUserDeployedContracts();

    
        const bal = await claimfaucetfactory.getBalanceFromDeployedContract(deployedContracts[0].deployedContract);
        expect(bal).to.equal(0);

        
        const claimToken = await claimfaucetfactory.connect(deployer).claimFaucetFromContract(deployedContracts[0].deployedContract);
        await claimToken.wait(); 

        
        const updatedBalance = await claimfaucetfactory.getBalanceFromDeployedContract(deployedContracts[0].deployedContract);
        expect(updatedBalance).to.be.greaterThan(0);
    });
});
  
});
