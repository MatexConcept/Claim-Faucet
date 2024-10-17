import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import hre from "hardhat";

describe("Claim Faucet test ", function () {
  async function deployClaimFaucetFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const ClaimFaucet = await hre.ethers.getContractFactory("ClaimFaucet");
    const claimfaucet = await ClaimFaucet.deploy("DltToken", "DLT");

    return { claimfaucet, owner, otherAccount };
  }

  describe("deployment ", () => {
    it("Should check if it deployed", async function () {
      const { claimfaucet } = await loadFixture(deployClaimFaucetFixture);

      const tokenName = await claimfaucet.getTokenName();
      const tokenSymbol = await claimfaucet.getSymbol();

      expect(tokenName).to.equal("DltToken");
      expect(tokenSymbol).to.equal("DLT");
    });
  });

  describe("Should be able to claim faucet ", () => {
    it("Should check claimable amount", async function () {
      const { claimfaucet } = await loadFixture(deployClaimFaucetFixture);

      const claimableAmt = await claimfaucet.CLAIMABLE_AMOUNT();

      expect(claimableAmt).to.equal(10);
    });

    it("Should be able to cliam faucet ", async function () {
      const { claimfaucet, otherAccount } = await loadFixture(
        deployClaimFaucetFixture
      );

      await claimfaucet.connect(otherAccount).claimToken(otherAccount.address);

      const claimerBal = await claimfaucet.balanceOf(otherAccount.address);
      expect(claimerBal).to.equal(hre.ethers.parseUnits("10", 18));
    });

    it("Should prevent claiming faucet again within 24 hours", async function () {
      const { claimfaucet, otherAccount } = await loadFixture(
        deployClaimFaucetFixture
      );

      await claimfaucet.connect(otherAccount).claimToken(otherAccount.address);

      await hre.network.provider.send("evm_increaseTime", [8400]);
      await hre.network.provider.send("evm_mine");

      await claimfaucet.connect(otherAccount).claimToken(otherAccount.address);

      await hre.network.provider.send("evm_increaseTime", [86400 - 8400]);
      await hre.network.provider.send("evm_mine");

      await expect(
        claimfaucet.connect(otherAccount).claimToken(otherAccount.address)
      ).to.be.revertedWith("You claim once after 24 hours");
    });

    it("Should allow claiming after 24 hours", async function () {
      const { claimfaucet, otherAccount } = await loadFixture(
        deployClaimFaucetFixture
      );

      await claimfaucet.connect(otherAccount).claimToken(otherAccount.address);

      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine", []);

      await claimfaucet.connect(otherAccount).claimToken(otherAccount.address);

      const totalClaimBal = await claimfaucet.balanceOf(otherAccount.address);
      expect(totalClaimBal).to.equal(hre.ethers.parseUnits("20", 18));
    });
  });
});
