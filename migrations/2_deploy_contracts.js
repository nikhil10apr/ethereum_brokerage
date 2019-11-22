//var Lottery = artifacts.require("./Lottery.sol");
var Brokerage = artifacts.require("./Brokerage.sol");

module.exports = function(deployer) {
  deployer.deploy(Brokerage);
};