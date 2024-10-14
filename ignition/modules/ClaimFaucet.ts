import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetModule = buildModule("ClaimFaucetModule", (m) => {
  

  const name = "DltToken";
  const symbol = "DLT";

 
  const claimFaucet = m.contract("ClaimFaucet", [name, symbol]);

  return { claimFaucet };
});

export default ClaimFaucetModule;
