# 🔥 Hyperswap V2 Burn & Delegate Script

This project demonstrates how to interact with the [Hyperswap V2 DelegatedPositionVault](https://docs.hyperswap.exchange/hyperswap/protocol-concepts/liquidity-pool/burn-and-delegate) to:

- ✅ Permanently lock Uniswap V2-style LP positions
- 🎁 Delegate fee collection rights via NFT
- 💸 Claim accumulated fees from the vault

Built with Node.js, `ethers.js`, and CommonJS modules.

---

## 🧠 What is "Burn & Delegate"?

Hyperswap's `DelegatedPositionVault` lets LPs:
- **Burn** their V3 or V2 positions, locking liquidity permanently.
- **Receive an ERC721 NFT** in return, which grants the right to collect the fees.
- **Claim** those fees at any time using the NFT.

Perfect for long-term liquidity provisioning or DAO fee delegation systems.

---

## 🛠️ Project Structure

📁 how-tos-burn/
├── index.js                # Entry point: run and test delegation
├── src/
│   └── delegateFeeFunctions.js         # Core logic for approval, burn, and claim
│   └──abi/
│      └── DelegatedPositionVault.json
│   
├── .env                    # Your configuration and private key
├── package.json

---

## ⚙️ Requirements

- Node.js ≥ 16
- NPM or Yarn
- Private key with LP position ownership
- A `.env` file (see below)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/how-tos-burn-v2.git
cd how-tos-burn-v2
npm install
```

## 🔐 Environment Configuration
```env
RPC_URL=https://rpc.hyperliquid.xyz/evm
PRIVATE_KEY=0xYourPrivateKey
VAULT_ADDRESS=0x744C89B7b7F8Cb1E955B1Dcd842A5378d75c96Dc
V2_FACTORY_ADDRESS=0x724412C00059bf7d6ee7d4a1d0D5cd4de3ea1C48
FEE_COLLECTOR=0xFeeCollector
V2_PAIR_ADDRESS=0xV2PairAddress
```

## 🛡️ Important Notes
	•	Burn is irreversible. Once burned, the LP position is locked forever.
	•	Keep your NFT safe. It’s your only way to access the fees.
	•	You can use bulkClaim() if managing multiple positions.
