// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./libs/PropertyLib.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyRequestFactory is Ownable {
    using PropertyLib for PropertyLib.Property;

    mapping(uint256 => PropertyLib.Property) public propertyMap;
    PropertyLib.Property[] private requestedProperties;
    uint256 public propertyRequestCount;

    mapping(address => uint256[]) private userPropertyRequests;

    function requestProperty(
        string memory _name,
        string memory _description,
        string memory _location,
        uint _totalValue,
        uint _shares
    ) public {
        propertyRequestCount++;
        uint requestId = propertyRequestCount;
        PropertyLib.Property memory newRequest = PropertyLib.Property(
            requestId,
            _name,
            _description,
            _location,
            _totalValue,
            _shares,
            PropertyLib.RequestStatus.PendingApproval,
            false,
            msg.sender
        );
        propertyMap[requestId] = newRequest;
        userPropertyRequests[msg.sender].push(requestId);
        requestedProperties.push(newRequest);
    }

    function getPropertyRequest(
        uint256 _requestId
    ) public view returns (PropertyLib.Property memory) {
        return propertyMap[_requestId];
    }

    function getUserPropertys(
        address user
    ) public view returns (PropertyLib.Property[] memory) {
        uint256[] storage userRequestIds = userPropertyRequests[user];
        PropertyLib.Property[] memory userRequests = new PropertyLib.Property[](
            userRequestIds.length
        );

        for (uint256 i = 0; i < userRequestIds.length; i++) {
            uint256 requestId = userRequestIds[i];
            userRequests[i] = propertyMap[requestId];
        }

        return userRequests;
    }

    function approveRequest(uint256 _requestId) public onlyOwner {
        require(
            propertyMap[_requestId].status ==
                PropertyLib.RequestStatus.PendingApproval,
            "Request is not pending approval"
        );

        propertyMap[_requestId].status = PropertyLib.RequestStatus.Approved;

        uint256 indexToRemove = 0;
        for (uint256 i = 0; i < requestedProperties.length; i++) {
            if (requestedProperties[i].id == _requestId) {
                indexToRemove = i;
                break;
            }
        }

        // Remove the approved property from the requestedProperties array
        requestedProperties[indexToRemove] = requestedProperties[
            requestedProperties.length - 1
        ];
        requestedProperties.pop();
    }

    function rejectRequest(uint256 _requestId) public onlyOwner {
        require(
            propertyMap[_requestId].status ==
                PropertyLib.RequestStatus.PendingApproval,
            "Request is not pending approval"
        );

        propertyMap[_requestId].status = PropertyLib.RequestStatus.Rejected;

        uint256 indexToAdjust = 0;
        for (uint256 i = 0; i < requestedProperties.length; i++) {
            if (requestedProperties[i].id == _requestId) {
                indexToAdjust = i;
                break;
            }
        }

        requestedProperties[indexToAdjust].status = PropertyLib
            .RequestStatus
            .Rejected;
    }

    function getAllRequestedProperties()
        public
        view
        returns (PropertyLib.Property[] memory)
    {
        return requestedProperties;
    }
}
