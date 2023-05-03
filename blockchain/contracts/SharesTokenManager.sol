// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyTokenFactory.sol";
import "./RealEstateShareToken.sol";
import "./libs/PropertyLib.sol";

contract SharesTokenManager is Ownable {
    PropertyTokenFactory public propertyTokenFactory;
    RealEstateShareToken public sharesToken;

    constructor(address _propertyTokenFactory, address _sharesTokenAddress) {
        propertyTokenFactory = PropertyTokenFactory(_propertyTokenFactory);
        sharesToken = RealEstateShareToken(_sharesTokenAddress);
    }

    function buyShares(
        address payable from,
        uint256 sharesAmount,
        uint256 propertyTokenId
    ) public payable {
        uint256 sharePrice = getSharePrice(propertyTokenId);
        uint256 totalPrice = sharePrice * sharesAmount;

        require(msg.value >= totalPrice, "Insufficient payment");

        // Transfer the payment to the seller
        from.transfer(totalPrice);

        // Transfer the shares from the seller to the buyer
        transferShares(propertyTokenId, from, msg.sender, sharesAmount);
    }

    function getSharePrice(
        uint256 propertyTokenId
    ) public view returns (uint256) {
        PropertyLib.Property memory property = propertyTokenFactory.getProperty(
            propertyTokenId
        );
        require(property.shares > 0, "Property not found");
        return property.totalValue / property.shares;
    }

    function transferShares(
        uint256 propertyId,
        address sender,
        address recipient,
        uint256 amount
    ) public {
        sharesToken.transferPropertyShares(
            propertyId,
            sender,
            recipient,
            amount
        );
    }
}
