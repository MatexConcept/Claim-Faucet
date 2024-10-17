import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetModule = buildModule("ClaimFaucetModule", (m) => {
  

  const name = "DltToken";
  const symbol = "DLT";

 
  const claimFaucet = m.contract("ClaimFaucet", [name, symbol]);

  const claimFaucetFactory = m.contract("ClaimFaucetFactory", []);

  return { claimFaucet,  claimFaucetFactory };
});

export default ClaimFaucetModule;
