require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.3",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200, // Number of optimization runs
        },
    }
};