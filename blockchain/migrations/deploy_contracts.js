async function main () {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const SharesToken = await hre.ethers.getContractFactory("RealEstateShareToken");
  const sharesToken = await SharesToken.deploy("RealEstateShareToken", "REST");
  await sharesToken.deployed();
  console.log("RealEstateShareToken deployed to:", sharesToken.address);

  const PropertyTokenFactory = await hre.ethers.getContractFactory("PropertyTokenFactory");
  const propertyTokenFactory = await PropertyTokenFactory.deploy("PropertyNFT", "PNFT", sharesToken.address);
  await propertyTokenFactory.deployed();
  console.log("PropertyTokenFactory deployed to:", propertyTokenFactory.address);

  const PropertyTokenManager = await hre.ethers.getContractFactory("PropertyTokenManager");
  const propertyTokenManager = await PropertyTokenManager.deploy(sharesToken.address, propertyTokenFactory.address);
  await propertyTokenManager.deployed();
  console.log("PropertyTokenManager deployed to:", propertyTokenManager.address);

  const SharesTokenManager = await hre.ethers.getContractFactory("SharesTokenManager");
  const sharesTokenManager = await SharesTokenManager.deploy(propertyTokenFactory.address, sharesToken.address);
  await sharesTokenManager.deployed();
  console.log("SharesTokenManager deployed to:", sharesTokenManager.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
