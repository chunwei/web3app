/*
 * @Author: Chunwei Lu
 * @Date: 2022-02-09 19:51:15
 * @LastEditTime: 2022-02-09 21:00:28
 * @LastEditors: Chunwei Lu
 * @Description: 
 * @FilePath: /web3app/src/components/WalletBalance.jsx
 */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function WalletBalance() {
  const [balance, setBalance] = useState();
  const [myAccount, setAccount] = useState();
  useEffect(async () => {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(account);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  }, []);

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div>
      <h5>Your Account: {myAccount}</h5>
      <h5>Your Balance: {balance}</h5>
      <button onClick={() => getBalance()}>Show My Balance</button>
    </div>
  );
}

export default WalletBalance;
