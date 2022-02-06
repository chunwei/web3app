const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFElement', function () {
  it('Should mint and transfer an NFT to someone', async function () {
    const NFElement = await ethers.getContractFactory('NFElement');
    const nfelement = await NFElement.deploy();
    await nfelement.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; //local test account #0
    const metadataURI = 'cid/test.png';

    let balance = await nfelement.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await nfelement.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await nfelement.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await nfelement.isContentOwned(metadataURI)).to.equal(true);
    const newlyMintedToken2 = await nfelement.payToMint(recipient, 'foo', {
      value: ethers.utils.parseEther('0.05'),
    });
  });
});
