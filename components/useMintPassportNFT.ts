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

  const { writeContractAsync } = useWriteContract();

  // Call this to mint
  const mint = async (tokenURI: string) => {
    if (!address) throw new Error('Wallet not connected');
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    try {
      const txHash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'mint',
        args: [tokenURI],
        chainId: chain?.id,
      });
      setTxHash(txHash);
      // Wait for confirmation
      await waitForTransactionReceipt(config, { hash: txHash, chainId: chain?.id });
      setIsSuccess(true);
      setEtherscanUrl(`https://holesky.etherscan.io/tx/${txHash}`);
      // Optionally parse logs for tokenId here
    } catch (err) {
      setError(err);
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
  };
}
