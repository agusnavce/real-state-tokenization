const fs = require("fs").promises;

async function copyJsonFile (sourceFilePath, destFilePath) {
    try {
        const jsonData = await fs.readFile(sourceFilePath, 'utf-8');
        await fs.writeFile(destFilePath, jsonData);
        console.log(`Successfully copied ${sourceFilePath} to ${destFilePath}`);
    } catch (err) {
        console.error(`Error copying ${sourceFilePath} to ${destFilePath}: ${err}`);
    }
}

async function main () {
    const [deployer, addr1] = await hre.ethers.getSigners();
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

    const userSigner = await ethers.getSigner("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")

    // Add a default property
    await propertyTokenFactory.connect(userSigner).requestProperty(
        "Default Property",
        "A beautiful default house",
        "456 Main St, Anytown",
        1,
        100
    );

    console.log("Default property request created");

    await propertyTokenFactory.approvePropertyRequest(1);

    console.log("Default property request approved");

    await propertyTokenManager.connect(userSigner).payForShares(1, { value: 1 });

    console.log("Default property token created");

    console.log("Example shareholder has received", 100, "shares of Property ID:", 1);


    // Write contract addresses to config.js
    const configContent = `
export const SHARES_TOKEN_ADDRESS = "${sharesToken.address}";
export const PROPERTY_TOKEN_FACTORY_ADDRESS = "${propertyTokenFactory.address}";
export const PROPERTY_TOKEN_MANAGER_ADDRESS = "${propertyTokenManager.address}";
`;

    await copyJsonFile("artifacts/contracts/PropertyTokenFactory.sol/PropertyTokenFactory.json",
        "../frontend/src/contracts/PropertyTokenFactory.json")
    await copyJsonFile("artifacts/contracts/RealEstateShareToken.sol/RealEstateShareToken.json",
        "../frontend/src/contracts/RealEstateShareToken.json")
    await copyJsonFile("artifacts/contracts/PropertyTokenManager.sol/PropertyTokenManager.json",
        "../frontend/src/contracts/PropertyTokenManager.json")
    await fs.writeFile("../frontend/src/config.js", configContent);
    console.log("Contract addresses written to config.js");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
