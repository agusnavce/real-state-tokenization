// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library PropertyLib {
    struct Property {
        uint256 id;
        string name;
        string description;
        string location;
        uint256 totalValue;
        uint256 shares;
        RequestStatus status;
        bool isAvailableForTrade;
        address requestOwner;
    }

    function validInputs(
        string memory name,
        string memory description,
        string memory location,
        uint256 propertyValue,
        uint256 totalShares
    ) internal pure {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(totalShares > 0, "Shares amount must be greater than 0");
        require(propertyValue > 0, "Property Value must be greater than 0");
    }

    enum RequestStatus {
        PendingApproval,
        Approved,
        SharesPaid,
        Rejected
    }

    struct SaleOrder {
        uint256 index;
        address seller;
        uint256 propertyId;
        uint256 shareAmount;
        uint256 pricePerShare;
    }
}
