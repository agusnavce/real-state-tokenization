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

    using PropertyLib for PropertyLib.SaleOrder;

    PropertyLib.SaleOrder[] public saleOrders;

    function getSharePrice(
        uint256 propertyTokenId
    ) public view returns (uint256) {
        PropertyLib.Property memory property = propertyTokenFactory.getProperty(
            propertyTokenId
        );
        require(property.shares > 0, "Property not found");
        return property.totalValue / property.shares;
    }

    function createSaleOrder(uint256 propertyId, uint256 shareAmount) public {
        // Check if the user has enough shares
        require(
            sharesToken.propertyBalanceOf(propertyId, msg.sender) >=
                shareAmount,
            "Not enough shares"
        );

        uint256 pricePerShare = getSharePrice(propertyId);

        // Create the sale order
        PropertyLib.SaleOrder memory newOrder = PropertyLib.SaleOrder({
            index: saleOrders.length,
            seller: msg.sender,
            propertyId: propertyId,
            shareAmount: shareAmount,
            pricePerShare: pricePerShare
        });

        // Add the sale order to the list
        saleOrders.push(newOrder);
    }

    function cancelSaleOrder(uint256 index) public {
        // Check if the index is valid
        require(index < saleOrders.length, "Invalid index");
        require(saleOrders[index].seller == msg.sender, "Not the seller");

        // Remove the sale order at the given index
        uint256 lastIndex = saleOrders.length - 1;
        saleOrders[index] = saleOrders[lastIndex];
        saleOrders.pop();
    }

    function getAllSaleOrders()
        public
        view
        returns (PropertyLib.SaleOrder[] memory)
    {
        return saleOrders;
    }

    function getSaleOrdersByUser(
        address user
    ) public view returns (PropertyLib.SaleOrder[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < saleOrders.length; i++) {
            if (saleOrders[i].seller == user) {
                count++;
            }
        }

        PropertyLib.SaleOrder[] memory userOrders = new PropertyLib.SaleOrder[](
            count
        );
        uint256 userOrdersIndex = 0;
        for (uint256 i = 0; i < saleOrders.length; i++) {
            if (saleOrders[i].seller == user) {
                userOrders[userOrdersIndex] = saleOrders[i];
                userOrdersIndex++;
            }
        }

        return userOrders;
    }

    function buySharesFromSaleOrder(uint256 index) public payable {
        // Check if the index is valid
        require(index < saleOrders.length, "Invalid index");

        // Check if the buyer has enough Ether
        PropertyLib.SaleOrder memory order = saleOrders[index];
        uint256 totalPrice = order.shareAmount * order.pricePerShare;
        require(msg.value >= totalPrice, "Insufficient funds");

        // Transfer shares from seller to buyer
        transferShares(
            order.propertyId,
            order.seller,
            msg.sender,
            order.shareAmount
        );

        // Transfer Ether from buyer to seller
        (bool sent, ) = order.seller.call{value: totalPrice}("");
        require(sent, "Failed to send Ether");

        // Remove the sale order
        uint256 lastIndex = saleOrders.length - 1;
        saleOrders[index] = saleOrders[lastIndex];
        saleOrders.pop();
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
