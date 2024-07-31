import { setGlobalDispatcher, Agent } from 'undici';
setGlobalDispatcher(
  new Agent({
    connections: 100,
  }),
);
import {
  PublicKey,
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import axios from 'axios';

const wallet = new Keypair();

const publicKey = wallet.publicKey;
const secretKey = wallet.secretKey;

const url = clusterApiUrl('devnet');
console.log(url);

const getWalletBalance = async () => {
  try {
    //   const resp = await axios.post(url, data, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   console.log(resp.data.result);
    //   console.log(
    //     `Wallet balance: ${resp.data.result.value / LAMPORTS_PER_SOL} SOL`,
    //   );

    const connection = new Connection(url, 'confirmed');
    const balance = await connection.getBalance(publicKey);
    console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
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
        id: 1,
        method: 'requestAirdrop',
        params: [publicKey, 2 * LAMPORTS_PER_SOL],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const fromAirDropSignature = resp.data;
    console.log('-------', fromAirDropSignature);
    await await axios.post(
      url,
      {
        jsonrpc: '2.0',
        id: 1,
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
    console.error(error);
  }
};
const main = async () => {
  await getWalletBalance();
  // await getWalletBalance();
};

main();
