import React, { useState } from 'react'
import { Button } from './ui/button'
import { useFormStore } from '@/app/store'
import { sha256 } from 'js-sha256'
import axios from 'axios'
import { useMintPassportNFT } from './useMintPassportNFT';

const CONTRACT_ADDRESS = '0x129A04E9E5aAdBc2bd933D9CE90b481d7E6d07c4';

const Overview = () => {
  const formData = useFormStore((state) => state.formData);
  const [hash, setHash] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string|null>(null);
  const [loading,setLoading] = useState(false);
  const {
    mint,
    isLoading: minting,
    isSuccess: mintSuccess,
    error: mintError,
    txHash,
    etherscanUrl,
  } = useMintPassportNFT(CONTRACT_ADDRESS);
  const [showModal, setShowModal] = useState(false);

  // Recursively sort object keys for consistent hashing
  function normalize(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(normalize);
    } else if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
      return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          acc[key] = normalize(obj[key]);
          return acc;
        }, {} as any);
    }
    return obj;
  }

  async function uploadImageToIPFS(file:File): Promise<string>{
    const formData = new FormData()
    formData.append('file',file);

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxContentLength:Infinity,
        headers:{
          'Content-Type': 'multipart/form-data',
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
        }
      }
    )

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
  }

  async function uploadMetadataToIPFS(metadata:object):Promise<string>{
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers:{
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
        },
      }
    )
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
  }

  async function handleCreateToken() {
    setLoading(true)
    try {
      const allowedSections = [
        'passportType',
        'personalInfo',
        'address',
        'idDocuments',
        'parentalInfo',
        'spouseInfo',
        'emergencyContact',
      ];
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([section]) => allowedSections.includes(section))
      );
      const normalized = normalize(filteredData);
      const serialized = JSON.stringify(normalized);
      const hashValue = sha256(serialized);
      setHash(hashValue);

      let imageUrl = null;
      if(imageFile){
        imageUrl = await uploadImageToIPFS(imageFile);
      }

      const metadata = {
        name: 'ePassport Application Token',
        description:
          'Digitally signed representation of user-submitted passport form',
        application_hash: hashValue,
        timestamp: new Date().toISOString(),
        image: imageUrl,
      }

      const metadataLink = await uploadMetadataToIPFS(metadata);
      setMetadataUrl(metadataLink);
      // Mint NFT after metadata is uploaded
      mint(metadataLink);
    } catch (err) {
      console.error('Error creating token:', err)
      alert('Error uploading to IPFS. Check console for details.')
    } finally {
      setLoading(false)
    }
    // Only include personal sections up to Emergency Contact (in order)
    
  }

  // Show modal only after mintSuccess
  React.useEffect(() => {
    if (mintSuccess) {
      setShowModal(true);
    }
  }, [mintSuccess]);

  return (
    <div className='bg-card flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-2xl bg-card flex flex-col items-center justify-center rounded-lg p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-6'>Application Overview</h2>

        {/* Image Upload */}
        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            if (e.target.files?.[0]) setImageFile(e.target.files[0])
          }}
          className='mb-6'
        />
        <div className='w-full space-y-4 text-left'>
          {Object.entries(formData).map(([section, data]) => (
            <div key={section} className='border-b pb-4 mb-4'>
              <h3 className='text-lg font-semibold capitalize mb-2'>{section.replace(/([A-Z])/g, ' $1')}</h3>
              <ul className='pl-4 space-y-1'>
                {typeof data === 'object' && data !== null ? (
                  Object.entries(data).map(([key, value]) => (
                    <li key={key} className='text-sm'>
                      <span className='font-medium'>{key.replace(/([A-Z])/g, ' $1')}: </span>
                      <span>{
                        value instanceof Date
                          ? value.toLocaleString()
                          : typeof value === 'boolean'
                            ? value ? 'Yes' : 'No'
                            : value === null || value === undefined || value === ''
                              ? <span className='text-muted-foreground italic'>N/A</span>
                              : value.toString()
                      }</span>
                    </li>
                  ))
                ) : (
                  <li className='text-sm text-muted-foreground'>No data</li>
                )}
              </ul>
            </div>
          ))}
        </div>
        {/* Create Token Button */}
        <Button className='mt-6' onClick={handleCreateToken} disabled={loading}>
          {loading ? 'Uploading...' : 'Create Token'}
        </Button>
        {hash && (
          <div className='mt-6 w-full break-all bg-muted p-4 rounded'>
            <div className='font-semibold mb-2'>Data Hash (SHA-256):</div>
            <div className='text-xs font-mono'>{hash}</div>
          </div>
        )}

        {/* Show Metadata IPFS Link */}
        {metadataUrl && (
          <div className='mt-6 w-full break-words bg-muted p-4 rounded'>
            <div className='font-semibold mb-2'>Metadata IPFS URL:</div>
            <a
              href={metadataUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs font-mono underline text-blue-600'
            >
              {metadataUrl}
            </a>
          </div>
        )}

        {/* Minting Success Modal */}
        {showModal && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-6 rounded shadow-lg max-w-md w-full'>
              <h3 className='text-lg font-bold mb-2'>NFT Minted!</h3>
              {imageFile && (
                <img src={URL.createObjectURL(imageFile)} alt='NFT' className='mb-4 max-h-48 mx-auto' />
              )}
              {metadataUrl && (
                <div className='mb-2'>
                  <span className='font-semibold'>IPFS Metadata: </span>
                  <a href={metadataUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline break-all text-xs'>{metadataUrl}</a>
                </div>
              )}
              {etherscanUrl && (
                <a href={etherscanUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline block mb-2'>View on Etherscan</a>
              )}
              <Button onClick={() => setShowModal(false)} className='w-full mt-2'>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview
