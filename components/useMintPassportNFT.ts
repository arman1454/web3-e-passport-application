import { useAccount, usePublicClient, useConfig } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useState } from 'react';
import contractABI from './ABI.json';

export function useMintPassportNFT(contractAddress: string) {
  const { address, chain } = useAccount();
  const config = useConfig();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  const [etherscanUrl, setEtherscanUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<any>(null);
  const [stage, setStage] = useState<'idle'|'wallet'|'mining'|'done'>('idle');

  const { writeContractAsync } = useWriteContract();

  // Call this to mint
  const mint = async (tokenURI: string) => {
    if (!address) throw new Error('Wallet not connected');
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setStage('wallet'); // Waiting for wallet confirmation
    try {
      const txHash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'mint',
        args: [tokenURI],
        chainId: chain?.id,
      });
      setTxHash(txHash);
      setStage('mining'); // User confirmed, now mining
      // Wait for confirmation
      await waitForTransactionReceipt(config, { hash: txHash, chainId: chain?.id });
      setIsSuccess(true);
      setEtherscanUrl(`https://sepolia.etherscan.io/tx/${txHash}`);
      setStage('done');
      // Optionally parse logs for tokenId here
    } catch (err) {
      setError(err);
      setStage('idle');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mint,
    isLoading,
    isSuccess,
    error,
    txHash,
    etherscanUrl,
    mintedTokenId,
    stage,
  };
}
