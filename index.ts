import {
  PublicKey,
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const wallet = new Keypair();

const publicKey = wallet.publicKey.toString();
const secretKey = wallet.secretKey;

const url = clusterApiUrl('devnet');

console.log(publicKey);
// console.log(secretKey);
console.log(uuidv4());

const getWalletBalance = async () => {
  try {
    const resp = await axios.post(
      url,
      {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'getBalance',
        params: [publicKey],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(resp.data.result);
    console.log(
      `Wallet balance: ${resp.data.result.value / LAMPORTS_PER_SOL} SOL`,
    );
  } catch (error) {
    console.error(error);
  }
};

const airDropSol = async () => {
  try {
    const resp = await axios.post(
      url,
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'requestAirdrop',
        params: [publicKey, 2 * LAMPORTS_PER_SOL],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const fromAirDropSignature = resp.data.result;
    console.log('-------', resp.data);
    console.log('-------', fromAirDropSignature);
    await await axios.post(
      url,
      {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'confirmTransaction',
        params: [fromAirDropSignature],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Airdrop successful');
  } catch (error) {
    console.error('error', error.message);
  }
};
const main = async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
};

main();
