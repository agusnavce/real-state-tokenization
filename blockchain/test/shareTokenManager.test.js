const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther } = ethers.utils;

describe("SharesTokenManager", () => {
    let realEstateShareToken, sharesTokenManager, propertyTokenFactory, propertyTokenManager;
    let owner, addr1, addr2;
    let propertyId, totalValue, shares;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

        const SharesTokenManager = await ethers.getContractFactory("SharesTokenManager");
        const RealEstateShareToken = await ethers.getContractFactory("RealEstateShareToken");
        const PropertyTokenFactory = await ethers.getContractFactory("PropertyTokenFactory");
        const PropertyTokenManager = await ethers.getContractFactory("PropertyTokenManager");

        realEstateShareToken = await RealEstateShareToken.deploy("RealEstateShareToken", "REST");
        await realEstateShareToken.deployed();

        propertyTokenFactory = await PropertyTokenFactory.deploy("PropertyNFT", "PNFT", realEstateShareToken.address);
        await propertyTokenFactory.deployed();

        sharesTokenManager = await SharesTokenManager.deploy(propertyTokenFactory.address, realEstateShareToken.address);
        await sharesTokenManager.deployed();

        propertyTokenManager = await PropertyTokenManager.deploy(realEstateShareToken.address, propertyTokenFactory.address);
        await propertyTokenManager.deployed();

        propertyId = 1;
        shares = 1000;
        totalValue = parseEther("1");
        await propertyTokenFactory.connect(addr1).requestProperty("Test Property", "Property Description", "Property Location", totalValue, shares);
        await propertyTokenFactory.getPropertyRequest(propertyId);
        await propertyTokenFactory.approvePropertyRequest(propertyId);
        await propertyTokenManager.connect(addr1).payForShares(propertyId, { value: totalValue });
    });

    it("createSaleOrder: should create a new sale order", async () => {
        // Create a new sale order
        const shareAmount = 100;
        await sharesTokenManager.connect(addr1).createSaleOrder(propertyId, shareAmount);

        const saleOrders = await sharesTokenManager.getAllSaleOrders();
        expect(saleOrders.length).to.equal(1);
        expect(saleOrders[0].seller).to.equal(addr1.address);
        expect(saleOrders[0].propertyId).to.equal(propertyId);
        expect(saleOrders[0].shareAmount).to.equal(shareAmount);
        expect(saleOrders[0].pricePerShare).to.equal(totalValue.div(shares));
    });

    it("cancelSaleOrder: Should cancel a sale order", async () => {
        const shareAmount = 100;
        await sharesTokenManager.connect(addr1).createSaleOrder(propertyId, shareAmount);

        let saleOrders = await sharesTokenManager.getAllSaleOrders();
        await sharesTokenManager.connect(addr1).cancelSaleOrder(saleOrders[0].index);

        saleOrders = await sharesTokenManager.getAllSaleOrders();
        expect(saleOrders.length).to.equal(0);
    });

    it("getAllSaleOrders: Should return all sale orders", async () => {
        const shareAmount = 100;
        await sharesTokenManager.connect(addr1).createSaleOrder(propertyId, shareAmount);

        const saleOrders = await sharesTokenManager.getAllSaleOrders();
        expect(saleOrders.length).to.equal(1);
        expect(saleOrders[0].seller).to.equal(addr1.address);
        expect(saleOrders[0].propertyId).to.equal(propertyId);
        expect(saleOrders[0].shareAmount).to.equal(shareAmount);
        expect(saleOrders[0].pricePerShare).to.equal(parseEther("0.001"));

    });

    it("getSaleOrdersByUser: Should return sale orders by user", async () => {
        const shareAmount = 100;
        await sharesTokenManager.connect(addr1).createSaleOrder(propertyId, shareAmount);

        const userOrders = await sharesTokenManager.getSaleOrdersByUser(addr1.address);
        expect(userOrders.length).to.equal(1);
        expect(userOrders[0].seller).to.equal(addr1.address);
        expect(userOrders[0].propertyId).to.equal(propertyId);
        expect(userOrders[0].shareAmount).to.equal(shareAmount);
    });

    it("buySharesFromSaleOrder: Should buy shares from a sale order", async () => {
        const shareAmount = 100;
        await sharesTokenManager.connect(addr1).createSaleOrder(propertyId, shareAmount);

        const saleOrders = await sharesTokenManager.getAllSaleOrders();
        const index = saleOrders[0].index;
        const pricePerShare = formatEther(saleOrders[0].pricePerShare)
        const value = pricePerShare * shareAmount;

        let addr1Balance = await realEstateShareToken.propertyBalanceOf(propertyId, addr1.address);
        let addr2Balance = await realEstateShareToken.propertyBalanceOf(propertyId, addr2.address);

        expect(addr1Balance).to.equal(shares);
        expect(addr2Balance).to.equal(0);

        await sharesTokenManager.connect(addr2).buySharesFromSaleOrder(index, { value: parseEther(value.toString()) });

        addr1Balance = await realEstateShareToken.propertyBalanceOf(propertyId, addr1.address);
        addr2Balance = await realEstateShareToken.propertyBalanceOf(propertyId, addr2.address);

        expect(addr1Balance).to.equal(shares - shareAmount);
        expect(addr2Balance).to.equal(shareAmount);
    });

    it("transferShares: Should transfer shares between users", async () => {
        const shareAmount = 100;
        await sharesTokenManager.connect(addr1).transferShares(propertyId, addr1.address, addr2.address, shareAmount);

        const addr1Balance = await realEstateShareToken.propertyBalanceOf(propertyId, addr1.address);
        const addr2Balance = await realEstateShareToken.propertyBalanceOf(propertyId, addr2.address);

        expect(addr1Balance).to.equal(shares - shareAmount);
        expect(addr2Balance).to.equal(shareAmount);
    });
});

