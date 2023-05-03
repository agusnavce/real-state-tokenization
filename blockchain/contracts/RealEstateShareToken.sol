// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RealEstateShareToken is ERC20 {
    using SafeMath for uint256;

    struct Shareholder {
        address shareholder;
        uint256 shareAmount;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    mapping(uint256 => address[]) private _propertyShareHolders;

    mapping(uint256 => mapping(address => uint256))
        private _propertyShareBalances;

    mapping(address => uint256[]) private _userPropertyIds;

    function addShareholder(uint256 propertyId, address shareholder) private {
        bool isShareholder = false;
        for (uint256 i = 0; i < _propertyShareHolders[propertyId].length; i++) {
            if (_propertyShareHolders[propertyId][i] == shareholder) {
                isShareholder = true;
                break;
            }
        }

        if (!isShareholder) {
            _propertyShareHolders[propertyId].push(shareholder);
            _userPropertyIds[shareholder].push(propertyId);
        }
    }

    function propertyBalanceOf(
        uint256 propertyId,
        address account
    ) public view returns (uint256) {
        return _propertyShareBalances[propertyId][account];
    }

    function mintPropertyShares(
        uint256 propertyId,
        address account,
        uint256 amount
    ) public {
        _mint(account, amount);
        _propertyShareBalances[propertyId][account] += amount;
        addShareholder(propertyId, account);
    }

    function transferPropertyShares(
        uint256 propertyId,
        address sender,
        address recipient,
        uint256 amount
    ) public {
        _transfer(sender, recipient, amount);
        _propertyShareBalances[propertyId][sender] -= amount;
        if (_propertyShareBalances[propertyId][sender] == 0) {
            removeShareholder(propertyId, sender);
        }
        _propertyShareBalances[propertyId][recipient] += amount;
        addShareholder(propertyId, recipient);
    }

    function getPropertyShareholders(
        uint256 propertyId
    ) public view returns (Shareholder[] memory) {
        address[] memory shareholders = _propertyShareHolders[propertyId];
        Shareholder[] memory shareholdersWithAmounts = new Shareholder[](
            shareholders.length
        );

        for (uint256 i = 0; i < shareholders.length; i++) {
            Shareholder memory shareholderData = Shareholder({
                shareholder: shareholders[i],
                shareAmount: _propertyShareBalances[propertyId][shareholders[i]]
            });
            shareholdersWithAmounts[i] = shareholderData;
        }

        return shareholdersWithAmounts;
    }

    function removeShareholder(uint256 propertyId, address shareholder) public {
        // Check if the shareholder has a zero balance for the property
        uint256 balance = _propertyShareBalances[propertyId][shareholder];
        require(
            balance == 0,
            "Shareholder must have a zero balance for this property"
        );

        // Find the index of the shareholder in the propertyShareHolders array
        address[] storage shareholders = _propertyShareHolders[propertyId];
        uint256 indexToDelete = shareholders.length; // Initialize with an invalid index

        for (uint256 i = 0; i < shareholders.length; i++) {
            if (shareholders[i] == shareholder) {
                indexToDelete = i;
                break;
            }
        }

        // Check if the shareholder is in the list
        require(
            indexToDelete < shareholders.length,
            "Shareholder not found in the property shareholders list"
        );

        // Remove the shareholder from the list by swapping it with the last element and then shortening the array
        if (indexToDelete != shareholders.length - 1) {
            shareholders[indexToDelete] = shareholders[shareholders.length - 1];
        }
        shareholders.pop();

        // Remove the property ID from the shareholder's list
        uint256[] storage propertyIds = _userPropertyIds[shareholder];
        indexToDelete = propertyIds.length; // Initialize with an invalid index

        for (uint256 i = 0; i < propertyIds.length; i++) {
            if (propertyIds[i] == propertyId) {
                indexToDelete = i;
                break;
            }
        }

        // Check if the property ID is in the list
        require(
            indexToDelete < propertyIds.length,
            "Property ID not found in the shareholder's property ID list"
        );

        // Remove the property ID from the list by swapping it with the last element and then shortening the array
        if (indexToDelete != propertyIds.length - 1) {
            propertyIds[indexToDelete] = propertyIds[propertyIds.length - 1];
        }
        propertyIds.pop();
    }

    function getPropertiesForShareholder(
        address shareholder
    ) public view returns (uint256[] memory) {
        return _userPropertyIds[shareholder];
    }
}
