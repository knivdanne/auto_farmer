const Router = artifacts.require('Router.sol');
const Weth = artifacts.require('Weth.sol');
const Dai = artifacts.require('Dai.sol');
const Roll = artifacts.require('Roll.sol');
const MasterChef = artifacts.require('MasterChef.sol');

// ETHEREUM NETWORK ADDRESSES


// UNI
// const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// SUSHI
// const ROUTER_ADDRESS = '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f';


// const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
// const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'; 

// Polygon NETWORK ADDRESSES
// Quickswap
// const ROUTER_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';
// Apeswap
const ROUTER_ADDRESS = '0xc0788a3ad43d79aa53b09c2eacc313a787d1d607';

// DFYN
// const ROUTER_ADDRESS = '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429';

const WETH_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'; // Actually wrapped matic
const DAI_ADDRESS = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'; 
const ROLL_ADDRESS = '0x4527D831ceFC76d0E5F8699f8fF4494611A6Bf31'; // Actually Neptune
const WMATIC_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';



module.exports = async done => {
  try {

    const [admin, _] = await web3.eth.getAccounts();
    console.log(admin);
    const roll = await Roll.at(ROLL_ADDRESS);
    const amountIn = await roll.balanceOf(admin);
    console.log(amountIn.toString(10));
    const router = await Router.at(ROUTER_ADDRESS);
    const weth = await Weth.at(WETH_ADDRESS);


    const amountsOut = await router.getAmountsOut(amountIn, [ROLL_ADDRESS, WETH_ADDRESS]);

    console.log(amountsOut[1].toString(10))

    const amountOutMin = amountsOut[1]
        .mul(web3.utils.toBN(90))
        .div(web3.utils.toBN(100));

    console.log('min',amountOutMin.toString(10))

    await weth.deposit({value: amountIn.toString(10)}) 
    await roll.approve(router.address, amountIn.toString(10));

    await router.swapExactTokensForTokens(
      amountIn.toString(10), 
      amountOutMin.toString(10),
      [ROLL_ADDRESS, WETH_ADDRESS],
      admin,
      Math.floor((Date.now() / 1000)) + 60 * 10
    );

  } catch(e) {
    console.log(e);
  }
  done();
};
