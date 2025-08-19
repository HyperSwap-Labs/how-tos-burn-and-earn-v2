const { ethers } = require("ethers");
const vaultAbi = require("./abi/DelegatedPositionVault.json");

// Load environment variables
const {
  PRIVATE_KEY,
  RPC_URL,
  VAULT_ADDRESS,
  V2_FACTORY_ADDRESS,
} = process.env;

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize contracts
const v2FactoryAbi = [
  {
    type: "function",
    name: "getPair",
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" }
    ],
    outputs: [{ name: "pair", type: "address" }],
    stateMutability: "view"
  }
];

const erc20Abi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "amount", type: "uint256" }],
    stateMutability: "view"
  }
];

const vaultContract = new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);
const v2Factory = V2_FACTORY_ADDRESS ? new ethers.Contract(V2_FACTORY_ADDRESS, v2FactoryAbi, provider) : null;


/**
 * Resolve the V2 pair address from token addresses via the factory.
 * @param {string} tokenA
 * @param {string} tokenB
 * @returns {Promise<string>} pair address
 */
async function getV2PairAddress(tokenA, tokenB) {
  if (!v2Factory) throw new Error("V2_FACTORY_ADDRESS not set");
  const pair = await v2Factory.getPair(tokenA, tokenB);
  if (pair === ethers.ZeroAddress) throw new Error("Pair does not exist");
  return pair;
}

/**
 * Approve an LP (pair) token for a spender (Vault).
 * @param {string} pairAddress - V2 Pair (LP token) address
 * @param {string} spender - Address to approve
 * @param {bigint|string|number} amount - LP amount to approve
 */
async function approveLP(pairAddress, spender, amount) {
  const lp = new ethers.Contract(pairAddress, erc20Abi, signer);
  console.log(`🪪 Approving ${spender} to spend ${amount} LP from ${pairAddress}...`);
  const tx = await lp.approve(spender, amount);
  await tx.wait();
  console.log(`✅ LP approved. Tx Hash: ${tx.hash}`);
}

/**
 * @param {string} pairAddress - V2 Pair (LP token) address
 * @param {bigint|string|number} liquidity - LP amount to delegate/burn in Vault
 * @param {string} feeCollector - Address receiving the delegation/fees
 */
async function delegateV2Position(pairAddress, liquidity, feeCollector) {
  console.log(`📦 Approving Vault for V2 LP: ${pairAddress} amount: ${liquidity}...`);
  await approveLP(pairAddress, VAULT_ADDRESS, liquidity);

  console.log(`🔥 Vault burnV2 & delegate to: ${feeCollector}...`);
  const tx = await vaultContract.burnV2(pairAddress, liquidity, feeCollector);
  const receipt = await tx.wait();
  console.log(`✅ V2 LP delegated via Vault. Tx Hash: ${tx.hash}`);
  return receipt;
}




module.exports = {
  getV2PairAddress,
  approveLP,
  delegateV2Position,
};