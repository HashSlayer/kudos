# 🙏 Kudos - A Distributed Gratitude Protocol

> *Inspired by the Indigenous Wampum system of binding relationships and shared memory*

## Overview

Kudos is a blockchain-native social infrastructure for expressing and propagating gratitude through semi-fungible tokens. Unlike traditional NFTs, Kudos tokens are designed to **spread through communities** rather than be hoarded, creating networks of shared acknowledgment and appreciation.

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
    string memory visualSymbol,       // "purple-blue-gradient"
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

## 🚀 Quick Start (Scaffold-ETH 2)

```bash
# 1. Add contract to your project
cp Kudos.sol packages/hardhat/contracts/

# 2. Deploy
yarn deploy

# 3. Interact
yarn chain
```

## 💡 Use Cases

### DAO Contributor Recognition
```javascript
await kudos.createKudos(
  "Shipped governance upgrade with zero bugs!",
  25,
  [contributorAddress],
  "achievement-gold",
  true,
  false
);
```

### Mentorship Networks
```javascript
// Teacher → Student
const tokenId = await kudos.createKudos(
  "Thank you for learning Solidity!",
  10,
  [studentAddress],
  "mentorship-blue",
  true,
  false
);

// Student → Study Group (propagation)
await kudos.propagateKudos(tokenId, studyGroupAddresses);
```

## 📜 License

MIT - Built with respect for Indigenous knowledge systems

---

*"Gratitude shared is gratitude multiplied"* 🌱