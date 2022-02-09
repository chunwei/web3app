import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import NFElement from '../artifacts/contracts/NFElement.sol/NFElement.json';

const contractAddress = '0xeF782aaFD7aD31f05efF9057CA0F969827460CdF'; //YOUR_DEPLOYED_CONTRACT_ADDRESS
//'0xeF782aaFD7aD31f05efF9057CA0F969827460CdF';//Mumbai
//'0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';//Localhost

const provider = new ethers.providers.Web3Provider(window.ethereum);
// 更改网络事件
window.ethereum.on('chainChanged', async (walletChainId) => {
  console.log('Matemask chainChanged', walletChainId)
  window.location.reload()
})
window.ethereum.on('accountsChanged', async (accounts) => {
  console.log('Matemask accountsChanged', accounts)
  window.location.reload()
})
// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, NFElement.abi, signer);

function NFTImage({ tokenId, getCount }) {
  const contentId = 'QmVya7kCZtkGED43mfvvJWgf5nmBDjddTQybDY6TNnZwTK'; //TODO:change folder CID
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    console.log(uri);
    alert(uri);
  }
  return (
    <div>
      <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
      <h5>ID #{tokenId}</h5>
      {!isMinted ? (
        <button onClick={mintToken}>Mint</button>
      ) : (
        <button onClick={getURI}>Taken! Show URI</button>
      )}
    </div>
  );
}

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
      <WalletBalance />

      {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <NFTImage tokenId={i} getCount={getCount} />
          </div>
        ))}
    </div>
  );
}

export default Home;
