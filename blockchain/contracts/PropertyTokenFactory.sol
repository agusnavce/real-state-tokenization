// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RealEstateShareToken.sol";
import "./PropertyRequestFactory.sol";
import "./libs/PropertyLib.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyTokenFactory is Ownable, PropertyRequestFactory, ERC721 {
    using Counters for Counters.Counter;
    using PropertyLib for PropertyLib.Property;

    RealEstateShareToken public sharesToken;

    mapping(uint256 => PropertyLib.Property) private propertyMap;

    event PropertyTokenCreated(uint256 propertyId);

    constructor(
        string memory name,
        string memory symbol,
        address _sharesTokenAddress
    ) ERC721(name, symbol) {
        sharesToken = RealEstateShareToken(_sharesTokenAddress);
    }

    function createPropertyToken(PropertyLib.Property memory request) public {
        PropertyLib.validInputs(
            request.name,
            request.description,
            request.location,
            request.totalValue,
            request.shares
        );

        _safeMint(owner(), request.id);

        PropertyLib.Property memory property = PropertyLib.Property(
            request.id,
            request.name,
            request.description,
            request.location,
            request.totalValue,
            request.shares,
            PropertyLib.RequestStatus.SharesPaid,
            false,
            request.requestOwner
        );

        propertyMap[request.id] = property;

        emit PropertyTokenCreated(request.id);
    }

    function getPropertyShares(
        uint256 propertyId,
        address account
    ) public view returns (uint256) {
        return sharesToken.propertyBalanceOf(propertyId, account);
    }

    function getProperty(
        uint256 propertyId
    ) public view returns (PropertyLib.Property memory) {
        return propertyMap[propertyId];
    }

    function approvePropertyRequest(uint _requestId) public onlyOwner {
        approveRequest(_requestId);
    }

    function toggleAvailability(
        uint256 propertyId,
        bool isAvailable
    ) public onlyOwner {
        propertyMap[propertyId].isAvailableForTrade = isAvailable;
    }
}
