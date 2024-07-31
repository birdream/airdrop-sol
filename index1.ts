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

const wallet = new Keypair();

const publicKey = wallet.publicKey;
const secretKey = wallet.secretKey;

const url = clusterApiUrl('devnet');
console.log(publicKey);

const getWalletBalance = async () => {
  try {
    const connection = new Connection(url, 'confirmed');
    const balance = await connection.getBalance(publicKey);
    console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.error(error);
  }
};

const airDropSol = async () => {
  try {
    const connection = new Connection(url, 'confirmed');
    const airdropAmount = 2 * LAMPORTS_PER_SOL;
    const fromAirdropSignature = await connection.requestAirdrop(
      publicKey,
      airdropAmount,
    );
    console.log('Airdrop signature:', fromAirdropSignature);
    await connection.confirmTransaction(fromAirdropSignature);
    console.log('Airdrop successful');
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
};

main();
