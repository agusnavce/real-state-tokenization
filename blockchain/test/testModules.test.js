const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = ethers;

describe("PropertyTokenFactory", function () {
  let RealEstateShareToken, PropertyTokenManager, PropertyTokenFactory;
  let realEstateShareToken, propertyTokenManager, propertyTokenFactory;
  let addr1;
  let propertyRequest;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    RealEstateShareToken = await ethers.getContractFactory("RealEstateShareToken");
    PropertyTokenFactory = await ethers.getContractFactory("PropertyTokenFactory");
    PropertyTokenManager = await ethers.getContractFactory("PropertyTokenManager");

    realEstateShareToken = await RealEstateShareToken.deploy("RealEstateShareToken", "REST");
    await realEstateShareToken.deployed();

    propertyTokenFactory = await PropertyTokenFactory.deploy("PropertyNFT", "PNFT", realEstateShareToken.address);
    await propertyTokenFactory.deployed();

    propertyTokenManager = await PropertyTokenManager.deploy(realEstateShareToken.address, propertyTokenFactory.address);
    await propertyTokenManager.deployed();

    propertyRequest = {
      name: "Test Property",
      description: "A test property",
      location: "Test Location",
      totalValue: BigNumber.from(1000),
      shares: BigNumber.from(100),
    };
  });

  it("Should create a property request and approve it", async function () {
    await propertyTokenFactory.connect(addr1).requestProperty(
      propertyRequest.name,
      propertyRequest.description,
      propertyRequest.location,
      propertyRequest.totalValue,
      propertyRequest.shares
    );

    const request = await propertyTokenFactory.getPropertyRequest(1);

    expect(request.name).to.equal(propertyRequest.name);
    expect(request.description).to.equal(propertyRequest.description);
    expect(request.location).to.equal(propertyRequest.location);
    expect(request.totalValue).to.equal(propertyRequest.totalValue);
    expect(request.shares).to.equal(propertyRequest.shares);

    await propertyTokenFactory.approvePropertyRequest(1);
    const approvedRequest = await propertyTokenFactory.getPropertyRequest(1);
    expect(approvedRequest.status).to.equal(1); // Approved status
  });

  it("Should create a property token and pay for shares", async function () {
    await propertyTokenFactory.connect(addr1).requestProperty(
      propertyRequest.name,
      propertyRequest.description,
      propertyRequest.location,
      propertyRequest.totalValue,
      propertyRequest.shares
    );

    await propertyTokenFactory.approvePropertyRequest(1);

    await propertyTokenManager.connect(addr1).payForShares(1, { value: propertyRequest.totalValue });
    const property = await propertyTokenFactory.getPropertyRequest(1);

    expect(property.name).to.equal(propertyRequest.name, 'name should be the same');
    expect(property.description).to.equal(propertyRequest.description, 'description should be the same');
    expect(property.location).to.equal(propertyRequest.location, 'location should be the same');
    expect(property.totalValue).to.equal(propertyRequest.totalValue, 'totalValue should be the same');
    expect(property.shares).to.equal(propertyRequest.shares, 'Shares should be the same');
    expect(property.status).to.equal(2, 'Status should be the same');

    const sharesholders = await realEstateShareToken
      .getPropertyShareholders(1);
    expect(sharesholders[0].shareAmount.toNumber()).to.equal(propertyRequest.shares, 'Shares amount should be the same');
    const address = await addr1.getAddress();
    expect(sharesholders[0].shareholder).to.equal(address, 'address shoudl be the same');
  });

  it("Should fail if user sends insufficient funds to pay for shares", async function () {
    await propertyTokenFactory.connect(addr1).requestProperty(
      propertyRequest.name,
      propertyRequest.description,
      propertyRequest.location,
      propertyRequest.totalValue,
      propertyRequest.shares
    );

    await propertyTokenFactory.approvePropertyRequest(1);

    await expect(
      propertyTokenManager.connect(addr1).payForShares(1, { value: propertyRequest.totalValue.sub(1) })
    ).to.be.revertedWith("Insufficient funds to pay for shares");
  });

  it("Should fail if user sends insufficient funds to pay for shares", async function () {
    await propertyTokenFactory.connect(addr1).requestProperty(
      propertyRequest.name,
      propertyRequest.description,
      propertyRequest.location,
      propertyRequest.totalValue,
      propertyRequest.shares
    );

    await propertyTokenFactory.approvePropertyRequest(1);

    await expect(
      propertyTokenManager.connect(addr1).payForShares(1, { value: propertyRequest.totalValue.sub(1) })
    ).to.be.revertedWith("Insufficient funds to pay for shares");
  });

  it("Should transfer Ether to the contract and increase its balance", async function () {
    await propertyTokenFactory.connect(addr1).requestProperty(
      propertyRequest.name,
      propertyRequest.description,
      propertyRequest.location,
      propertyRequest.totalValue,
      propertyRequest.shares
    );

    await propertyTokenFactory.approvePropertyRequest(1);

    const initialContractBalance = await ethers.provider.getBalance(propertyTokenManager.address);

    await propertyTokenManager.connect(addr1).payForShares(1, { value: propertyRequest.totalValue });

    const finalContractBalance = await ethers.provider.getBalance(propertyTokenManager.address);

    expect(finalContractBalance.toNumber()).to.equal(initialContractBalance.add(propertyRequest.totalValue).toNumber());
  });

  it("Should create a property token after payment is successful", async function () {
    await propertyTokenFactory.connect(addr1).requestProperty(
      propertyRequest.name,
      propertyRequest.description,
      propertyRequest.location,
      propertyRequest.totalValue,
      propertyRequest.shares
    );

    await propertyTokenFactory.approvePropertyRequest(1);

    await propertyTokenManager.connect(addr1).payForShares(1, { value: propertyRequest.totalValue });

    const ownerOfToken = await propertyTokenFactory.ownerOf(1);
    expect(ownerOfToken).to.equal(owner.address);
  });

})
