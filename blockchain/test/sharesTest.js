const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstateShareToken", function () {
    let RealEstateShareToken, sharesToken;

    beforeEach(async function () {
        RealEstateShareToken = await ethers.getContractFactory("RealEstateShareToken");
        sharesToken = await RealEstateShareToken.deploy("Real Estate Shares", "RES");
        await sharesToken.deployed();
    });

    it("Should mint property shares", async function () {
        const [owner] = await ethers.getSigners();
        await sharesToken.mintPropertyShares(1, owner.address, 1000);

        const balance = await sharesToken.propertyBalanceOf(1, owner.address);
        expect(balance.toNumber()).to.equal(1000);
    });

    it("Should transfer property shares", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await sharesToken.mintPropertyShares(1, owner.address, 1000);
        await sharesToken.transferPropertyShares(1, owner.address, addr1.address, 500);

        const ownerBalance = await sharesToken.propertyBalanceOf(1, owner.address);
        const addr1Balance = await sharesToken.propertyBalanceOf(1, addr1.address);

        expect(ownerBalance.toNumber()).to.equal(500);
        expect(addr1Balance.toNumber()).to.equal(500);
    });

    it("Should get property shareholders and their share amounts", async function () {
        const [owner, addr1] = await ethers.getSigners();

        await sharesToken.mintPropertyShares(1, owner.address, 1000);
        await sharesToken.mintPropertyShares(1, addr1.address, 2000);

        const shareholders = await sharesToken.getPropertyShareholders(1);

        expect(shareholders.length).to.equal(2);
        expect(shareholders[0].shareholder).to.equal(owner.address);
        expect(shareholders[0].shareAmount.toNumber()).to.equal(1000);
        expect(shareholders[1].shareholder).to.equal(addr1.address);
        expect(shareholders[1].shareAmount.toNumber()).to.equal(2000);
    });

    it("Should remove a shareholder when their property shares balance is zero", async function () {
        const [owner, addr1] = await ethers.getSigners();

        await sharesToken.mintPropertyShares(1, owner.address, 1000);
        await sharesToken.mintPropertyShares(1, addr1.address, 2000);

        await sharesToken.transferPropertyShares(1, owner.address, addr1.address, 1000);

        const shareholders = await sharesToken.getPropertyShareholders(1);

        expect(shareholders.length).to.equal(1);
        expect(shareholders[0].shareholder).to.equal(addr1.address);
        expect(shareholders[0].shareAmount.toNumber()).to.equal(3000);

        const properties = await sharesToken.getPropertiesForShareholder(addr1.address);
        expect(properties.length).to.equal(1);
        expect(properties[0]).to.equal(1);
    });


});
