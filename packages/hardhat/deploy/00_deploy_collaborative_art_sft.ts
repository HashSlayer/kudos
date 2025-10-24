// 00_deploy_collaborative_art_sft.ts
// Place this in: packages/hardhat/deploy/

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * DEPLOYMENT SCRIPT FOR COLLABORATIVE ART SFT
 *
 * This script:
 * 1. Deploys the CollaborativeArtSFT contract
 * 2. Sets up initial configuration
 * 3. Creates a sample artwork for testing
 * 4. Verifies the deployment
 *
 * SCAFFOLD-ETH 2 FEATURES:
 * - Auto-generates TypeScript types
 * - Updates frontend contract info automatically
 * - Provides deployment address to UI
 */
const deployCollaborativeArtSFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🎨 Deploying CollaborativeArtSFT...\n");

  // ============================================
  // DEPLOYMENT CONFIGURATION
  // ============================================

  /**
   * BASE URI OPTIONS:
   *
   * OPTION 1: IPFS (Decentralized, permanent)
   * baseURI = "ipfs://QmYourCIDHere/metadata/"
   *
   * OPTION 2: Centralized API (Flexible, can update)
   * baseURI = "https://api.yourplatform.com/metadata/"
   *
   * OPTION 3: Arweave (Permanent, pay once)
   * baseURI = "https://arweave.net/your-tx-id/"
   *
   * For development, we'll use a placeholder
   */
  const baseURI = "https://api.example.com/artwork/metadata/";

  // ============================================
  // DEPLOY CONTRACT
  // ============================================

  const collaborativeArtSFT = await deploy("CollaborativeArtSFT", {
    from: deployer,
    args: [baseURI],
    log: true,
    autoMine: true, // Speed up deployment on local network
  });

  console.log(`✅ CollaborativeArtSFT deployed at: ${collaborativeArtSFT.address}`);

  // ============================================
  // POST-DEPLOYMENT SETUP
  // ============================================

  // Get contract instance for interaction
  const contract = await hre.ethers.getContractAt("CollaborativeArtSFT", collaborativeArtSFT.address);

  // Only create sample artwork on local/test networks
  const chainId = await hre.getChainId();
  const isLocalNetwork = chainId === "31337" || chainId === "1337"; // Hardhat network

  if (isLocalNetwork) {
    console.log("\n🎨 Creating sample artwork for testing...\n");

    /**
     * CREATE SAMPLE ARTWORK
     *
     * Parameters:
     * - initialSupply: 100 shares
     * - maxSupply: 1000 shares maximum
     * - minSharesForPermission: 10 shares needed to add owners
     * - uri: Custom metadata URI (empty = use base URI + token ID)
     */
    const tx = await contract.createArtwork(
      100, // Initial supply
      1000, // Max supply
      10, // Min shares for permission
      "", // Use default URI pattern
    );

    await tx.wait();
    console.log("✅ Sample artwork created with ID: 1");
    console.log(`   - Initial supply: 100 shares`);
    console.log(`   - Max supply: 1000 shares`);
    console.log(`   - Min shares for permission: 10`);
    console.log(`   - Deployer owns all 100 initial shares\n`);

    // Display ownership info
    const balance = await contract.balanceOf(deployer, 1);
    console.log(`📊 Deployer balance for token #1: ${balance.toString()} shares`);

    const canAdd = await contract.canAddNewOwners(1, deployer);
    console.log(`✅ Deployer can add owners: ${canAdd}`);
  }

  // ============================================
  // VERIFICATION INFO
  // ============================================

  console.log("\n📝 Contract Information:");
  console.log(`   - Name: CollaborativeArtSFT`);
  console.log(`   - Address: ${collaborativeArtSFT.address}`);
  console.log(`   - Base URI: ${baseURI}`);
  console.log(`   - Deployer: ${deployer}`);

  // ============================================
  // ETHERSCAN VERIFICATION
  // ============================================

  if (!isLocalNetwork && process.env.ETHERSCAN_API_KEY) {
    console.log("\n⏳ Waiting 30 seconds before Etherscan verification...\n");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: collaborativeArtSFT.address,
        constructorArguments: [baseURI],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error);
    }
  }

  console.log("\n🎉 Deployment complete!\n");
};

export default deployCollaborativeArtSFT;

/**
 * ============================================
 * DEPLOYMENT TAGS
 * ============================================
 *
 * Tags allow you to run specific deployments:
 * - yarn deploy --tags CollaborativeArtSFT
 * - yarn deploy --tags all
 */
deployCollaborativeArtSFT.tags = ["CollaborativeArtSFT", "all"];

/**
 * ============================================
 * NETWORK-SPECIFIC CONFIGURATION
 * ============================================
 *
 * LOCALHOST (Development):
 * - Fast deployment
 * - Sample data created
 * - No verification needed
 *
 * TESTNET (Sepolia, Goerli):
 * - Real wallet needed
 * - Faucet ETH required
 * - Etherscan verification available
 *
 * MAINNET (Production):
 * - IPFS/Arweave for metadata
 * - Security audit recommended
 * - Higher gas costs
 *
 * To deploy to different networks:
 * yarn deploy --network localhost
 * yarn deploy --network sepolia
 * yarn deploy --network mainnet
 *
 * ============================================
 * ENVIRONMENT VARIABLES NEEDED
 * ============================================
 *
 * In packages/hardhat/.env:
 *
 * DEPLOYER_PRIVATE_KEY=0x...
 * ALCHEMY_API_KEY=...
 * ETHERSCAN_API_KEY=...
 *
 * For production, also set:
 * METADATA_BASE_URI=https://your-api.com/metadata/
 */

/**
 * ============================================
 * POST-DEPLOYMENT CHECKLIST
 * ============================================
 *
 * [ ] Contract deployed successfully
 * [ ] Verified on Etherscan (if mainnet/testnet)
 * [ ] Metadata server is running
 * [ ] Sample metadata JSON accessible
 * [ ] Frontend can read contract
 * [ ] Wallet can connect
 * [ ] Test creating artwork
 * [ ] Test adding co-owner
 * [ ] Test permission system
 * [ ] Test batch operations
 *
 * ============================================
 * METADATA SERVER SETUP
 * ============================================
 *
 * Your metadata endpoint should return JSON like:
 *
 * GET https://api.example.com/artwork/metadata/1.json
 *
 * Response:
 * {
 *   "name": "Sunset Dreams",
 *   "description": "A collaborative digital artwork",
 *   "image": "ipfs://QmImageHash",
 *   "external_url": "https://yourplatform.com/artwork/1",
 *   "attributes": [
 *     {
 *       "trait_type": "Artist",
 *       "value": "Alice"
 *     },
 *     {
 *       "trait_type": "Co-owners",
 *       "value": 5
 *     },
 *     {
 *       "trait_type": "Total Supply",
 *       "value": 100
 *     }
 *   ],
 *   "properties": {
 *     "created": "2025-01-15",
 *     "category": "Digital Art"
 *   }
 * }
 *
 * ============================================
 * TESTING COMMANDS
 * ============================================
 *
 * After deployment, test with Hardhat console:
 *
 * yarn hardhat console --network localhost
 *
 * const sft = await ethers.getContractAt("CollaborativeArtSFT", "0xYourAddress")
 *
 * // Check balance
 * await sft.balanceOf("0xYourAddress", 1)
 *
 * // Create artwork
 * await sft.createArtwork(100, 1000, 10, "")
 *
 * // Add co-owner
 * await sft.addCoOwner(1, "0xRecipient", 10, true)
 */
