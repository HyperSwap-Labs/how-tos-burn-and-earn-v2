require("dotenv").config();
const { ethers } = require("ethers");
// Minimal ERC20 ABI for LP balance lookup
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)"
];

const { delegateV2Position } = require("./src/delegateFeeFunctions");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const pairAddress = process.env.V2_PAIR_ADDRESS;
  const feeCollector = wallet.address; // Or any address you want as fee collector

  // Read full LP balance from the pair (LP token) contract, make sure to adjust LP token ammount you wish to burn (in this case, this is for the max)
  const lpToken = new ethers.Contract(pairAddress, erc20Abi, provider);
  const liquidity = await lpToken.balanceOf(wallet.address);
  if (liquidity === 0n) {
    throw new Error("No LP tokens found for this pair on this wallet.");
  }
  console.log("Delegating full LP balance:", liquidity.toString());

  await delegateV2Position(pairAddress, liquidity, feeCollector);
}

main().catch((err) => {
  console.error("❌ Error: ", err);
});
