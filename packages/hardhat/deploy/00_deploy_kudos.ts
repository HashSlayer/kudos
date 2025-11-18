import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployKudos: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🙏 Deploying Kudos - Distributed Gratitude Protocol...\n");

  await deploy("Kudos", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const kudos = await hre.ethers.getContract<Contract>("Kudos", deployer);
  console.log("✅ Kudos deployed to:", await kudos.getAddress());
  console.log("\n🎉 Ready to propagate gratitude!\n");
};

export default deployKudos;
deployKudos.tags = ["Kudos"];
