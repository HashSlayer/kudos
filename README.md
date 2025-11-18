# 🙏 Kudos - A Distributed Gratitude Protocol

> *Inspired by the Indigenous Wampum system of binding relationships and shared memory*

## Overview

Kudos is a blockchain-native social infrastructure for expressing and propagating gratitude through semi-fungible tokens. Unlike traditional NFTs, Kudos tokens are designed to **spread through communities** rather than be hoarded, creating networks of shared acknowledgment and appreciation.

Built on **Scaffold-ETH 2**, Kudos combines the power of ERC-1155 tokens with a unique propagation mechanism that allows gratitude to multiply as it spreads through social networks.

## 🌟 Core Philosophy

- **Propagation over Transfer**: When you share gratitude, you don't lose yours—it multiplies
- **Story-First Design**: Every token carries a narrative of appreciation
- **Network Effects**: Value grows as gratitude spreads through social connections
- **Cultural Authenticity**: Based on Indigenous wampum principles of reciprocity and collective memory

## 🎯 Key Features

### 1. **Gratitude Propagation** ⭐
- **Default Behavior**: Creators and holders KEEP their tokens when distributing
- **Minting on Distribution**: New tokens are minted (up to supply cap) when propagated
- **Generation Tracking**: Each distribution is tracked with "hops from origin"
- **Network Visualization**: Full provenance graph showing how gratitude spread

### 2. **Flexible Token Models**
- **Semi-Fungible**: Multiple holders can own the same gratitude token
- **Supply Caps**: Creators set maximum circulation to maintain scarcity
- **Transferable Option**: Enable traditional transfers if desired (disabled by default)
- **Cultural Symbolism**: Visual identifiers inspired by wampum belt patterns
- **Media Support**: Optional URI for artwork, images, or other media (IPFS recommended)

### 3. **Social Graph Analytics**
- Track propagation depth (degrees of separation)
- Query holder generation (how many hops from creator)
- Calculate reach (total unique holders)
- View complete distribution history

## 📋 Contract Interface

### Creating Kudos

```solidity
function createKudos(
    string memory story,              // "Thank you for mentoring me!"
    uint256 maxSupply,                // 100 (max holders)
    address[] memory initialRecipients, // [0xAlice, 0xBob]
    string memory visualSymbol,       // "purple-blue-gradient" or "🌟"
    string memory mediaUri,           // "ipfs://QmXxx..." or "https://..."
    bool canPropagate,                // true (allow others to share)
    bool transferable                 // false (no selling)
) external returns (uint256 tokenId)
```

### Propagating Kudos (PRIMARY METHOD)

```solidity
function propagateKudos(
    uint256 tokenId,
    address[] memory recipients
) external
```

**Key Point**: You KEEP your token, recipients GET new ones! 🎉

## 🚀 Getting Started

### Requirements

- **Node.js**: >= 20.18.3
- **Yarn**: 3.2.3 (included in package.json)
- **Git**: For cloning the repository
- **MetaMask** (or other Web3 wallet): For interacting with the contract

### Setup & Development

Kudos is built on **Scaffold-ETH 2**, a Next.js + Hardhat development stack. Here's how to get started:

#### 1. Start Local Blockchain

```bash
yarn chain
```

**What this does:**
- Starts a local Hardhat network on `http://localhost:8545`
- Provides 20 test accounts with 10,000 ETH each
- Creates a fresh blockchain for testing (no data persists)
- **Keep this running** in a terminal window while developing

#### 2. Deploy the Kudos Contract

In a new terminal window:

```bash
yarn deploy
```

**What this does:**
- Compiles the Kudos smart contract (`packages/hardhat/contracts/Kudos.sol`)
- Deploys it to your local blockchain
- Generates TypeScript types and ABIs for the frontend
- Updates `packages/nextjs/contracts/deployedContracts.ts` automatically
- Outputs the contract address: `✅ Kudos deployed to: 0x...`

#### 3. Start the Frontend

In another terminal window:

```bash
yarn start
```

**What this does:**
- Starts the Next.js development server
- Opens the app at `http://localhost:3000`
- Hot-reloads on code changes
- Enables wallet connection via RainbowKit
- Provides UI to interact with the Kudos contract

**Development Flow:**
1. Terminal 1: `yarn chain` (keep running)
2. Terminal 2: `yarn deploy` (run once, or after contract changes)
3. Terminal 3: `yarn start` (keep running)

### Interacting with Kudos

Once your local environment is running:

1. **Connect Wallet**: Click "Connect Wallet" in the top right
2. **Fund Wallet**: Use the faucet button (if on local network) to get test ETH
3. **Create Kudos**: Navigate to the Create page and fill out the form
4. **Propagate**: Share your Kudos with others to watch the network grow!

## 💡 Use Cases & Examples

### DAO Contributor Recognition

Recognize team members for their contributions:

```javascript
await kudos.createKudos(
  "Shipped governance upgrade with zero bugs!",
  25,                                    // Max 25 people can receive this
  [contributorAddress],                  // Initial recipient
  "achievement-gold",                    // Visual symbol
  "ipfs://QmXxx.../achievement-art.png", // Artwork URI
  true,                                  // Allow propagation
  false                                  // No transfers (anti-speculation)
);
```

### Mentorship Networks

Build gratitude chains in educational settings:

```javascript
// Teacher creates Kudos for student
const tokenId = await kudos.createKudos(
  "Thank you for learning Solidity! Your dedication is inspiring.",
  10,
  [studentAddress],
  "mentorship-blue",
  "ipfs://QmYyy.../mentorship-card.jpg",
  true,
  false
);

// Student propagates to study group (they keep their token!)
await kudos.propagateKudos(tokenId, studyGroupAddresses);

// Now the teacher, student, AND study group all have the token!
```

### Community Appreciation

Show gratitude within organizations:

```javascript
// Create a Kudos for a community event organizer
await kudos.createKudos(
  "Thank you for organizing our Web3 meetup!",
  100,                                  // Allow up to 100 recipients
  [organizerAddress],
  "community-purple",
  "ipfs://QmZzz.../community-art.png",
  true,                                 // Let recipients propagate further
  false
);

// The organizer can now share this gratitude with volunteers
// Each volunteer can share with attendees
// Gratitude spreads exponentially through the community!
```

### Open Source Contributions

Acknowledge open source contributors:

```javascript
await kudos.createKudos(
  "Thank you for your amazing PR that fixed the bug!",
  50,
  [contributorAddress],
  "oss-green",
  "",                                   // Empty mediaUri is allowed
  true,
  false
);
```

## 🛠️ Development Commands

### Smart Contract

```bash
yarn compile          # Compile contracts
yarn deploy           # Deploy to local network
yarn test             # Run tests
yarn hardhat:clean    # Clean artifacts
```

### Frontend

```bash
yarn start            # Start dev server (localhost:3000)
yarn next:build       # Build for production
yarn lint             # Lint code
yarn format           # Format code with Prettier
```

### Testing

```bash
yarn test            # Run Hardhat tests
yarn hardhat:fork    # Fork mainnet for testing
```

## 📚 Project Structure

```
kudos/
├── packages/
│   ├── hardhat/          # Smart contract development
│   │   ├── contracts/
│   │   │   └── Kudos.sol # Main Kudos contract
│   │   ├── deploy/
│   │   │   └── 00_deploy_kudos.ts
│   │   └── test/
│   │
│   └── nextjs/           # Frontend (Next.js + React)
│       ├── app/          # App router pages
│       │   ├── page.tsx  # Home page
│       │   ├── create/   # Create Kudos page
│       │   └── my-kudos/ # Dashboard
│       ├── components/
│       │   └── kudos/    # Kudos-specific components
│       └── hooks/
│           └── scaffold-eth/ # Scaffold hooks
```

## 🎨 Design Philosophy

Kudos follows a **story-first, propagation-first** design:

- **No Financial UI**: No price charts, trading interfaces, or value displays
- **Network Visualization**: Always show how gratitude has spread
- **Celebration Moments**: Animate success states, show reach milestones
- **Warm Aesthetics**: Use organic shapes, warm colors, gratitude-focused language

## 📜 License

MIT - Built with respect for Indigenous knowledge systems

---

*"Gratitude shared is gratitude multiplied"* 🌱
