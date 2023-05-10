// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RealEstateShareToken.sol";
import "./PropertyTokenFactory.sol";
import "./PropertyRequestFactory.sol";
import "./libs/PropertyLib.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyTokenManager is Ownable {
    PropertyTokenFactory public propertyTokenFactory;
    RealEstateShareToken public sharesToken;

    constructor(address _sharesTokenAddress, address _propertyTokenFactory) {
        sharesToken = RealEstateShareToken(_sharesTokenAddress);
        propertyTokenFactory = PropertyTokenFactory(_propertyTokenFactory);
    }

    function payForShares(uint256 _requestId) public payable {
        PropertyLib.Property memory request = propertyTokenFactory
            .getPropertyRequest(_requestId);

        require(
            request.status == PropertyLib.RequestStatus.Approved,
            "Request must be approved"
        );
        require(
            msg.value >= request.totalValue,
            "Insufficient funds to pay for shares"
        );

        request.status = PropertyLib.RequestStatus.SharesPaid;

        propertyTokenFactory.createPropertyToken(request);

        // Mint property shares for the user
        sharesToken.mintPropertyShares(request.id, msg.sender, request.shares);
    }
}
