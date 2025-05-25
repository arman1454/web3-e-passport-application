import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useFormStore } from '@/app/store'
import { sha256 } from 'js-sha256'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMintPassportNFT } from './useMintPassportNFT';

const CONTRACT_ADDRESS = '0x129A04E9E5aAdBc2bd933D9CE90b481d7E6d07c4';

const Overview = () => {
  const fields = [
    "District",
    "City/Village/House",
    "Road/Block/Sector",
    "Post Office",
    "Postal code",
    "Police Station",
  ]
  const fields2 = [
    "Father's name(as per NID/BRC)",
    "Profession",
    "Nationality"
  ]
  const fields3 = [
    "Mother's name(as per NID/BRC)",
    "Profession",
    "Nationality"
  ]

  const fields4 = [
    "Country",
    "District",
    "City",
    "Block/Road/House",
    "Post Office",
  ]
  const fields5 = [
    "Postal Code",
    "Police Station",
    "Email",
    "Country Code",
    "Mobile Number"
  ]


  const formData = useFormStore((state) => state.formData);
  const [hash, setHash] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string|null>(null);
  const [loading,setLoading] = useState(false);
  const [metadataStatus, setMetadataStatus] = useState(false);
  const {
    mint,
    isLoading: minting,
    isSuccess: mintSuccess,
    error: mintError,
    txHash,
    etherscanUrl,
    stage: mintStageFromHook,
  } = useMintPassportNFT(CONTRACT_ADDRESS);
  const [ipfsUploading, setIpfsUploading] = useState(false);

  // Recursively sort object keys for consistent hashing
  function normalize(obj: any): any {
    if (Array.isArray(obj)) {
      console.log(formData);
      
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

  // useEffect(()=>{
  //   console.log(formData);
    
  // },[])

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
    setIpfsUploading(true);
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
      setMetadataStatus(true);
      setIpfsUploading(false);
      mint(metadataLink);
    } catch (err) {
      setIpfsUploading(false);
      console.error('Error creating token:', err)
      alert('Error uploading to IPFS. Check console for details.')
    }
  }

  // Modal animation logic: use ipfsUploading for IPFS, then use hook's stage for wallet/mining/done
  let effectiveMintStage: 'ipfs'|'wallet'|'mining'|'done'|'idle' = 'idle';
  if (ipfsUploading) effectiveMintStage = 'ipfs';
  else if (mintStageFromHook) effectiveMintStage = mintStageFromHook;

  // Listen for wallet confirmation and mining
  React.useEffect(() => {
    if (minting && effectiveMintStage === 'wallet') {
      setIpfsUploading(false); // User confirmed in wallet, now mining
    }
  }, [minting]);

  React.useEffect(() => {
    if (mintSuccess && effectiveMintStage !== 'done') {
      setIpfsUploading(false);
    }
  }, [mintSuccess]);

  return (
    <div className="border-none space-y-8 text-card-foreground">
                <CardHeader>
                    <CardTitle className='text-foreground text-lg lg:text-xl font-bold text-center'>Information Overview</CardTitle>
                </CardHeader>

       
      {/* Personal Info */}
      <Card className='shadow-sm rounded-xl'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Personal Information</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='flex flex-col items-center justify-center space-y-6 text-sm md:text-base lg:text-lg'>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Gender</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Full Name(as Per NID/BRC)</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">First Name</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Sur Name</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Profession</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Religion</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Contact Number</h1>
              <h1>Fakid Arman</h1>
            </div>
          </div>

          <div className="flex items-center text-sm md:text-base lg:text-lg ">
            <h1 className="mr-4 whitespace-nowrap">Birth Data</h1>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>
          <div className='flex flex-col items-center justify-center space-y-6 text-sm md:text-base lg:text-lg'>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Country Of Birth</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Country Code</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">District of Birth</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Birth Date</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Citizenship Type</h1>
              <h1>Fakid Arman</h1>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className='shadow-sm rounded-xl'>
        <CardHeader className="flex items-center flex-row justify-between">
          <CardTitle className='text-base lg:text-xl'>Address</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* Permanent Address */}
            <div className="space-y-6">
              <div className="flex items-center text-sm md:text-base lg:text-lg">
                <h1 className="mr-4 whitespace-nowrap font-semibold">Permanent Address</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-4 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
                {fields.map((label, idx) => (
                  <div className="text-sm md:text-base lg:text-lg grid grid-cols-[180px_1fr] gap-12" key={`present-${idx}`}>
                    <span className="text-muted-foreground">{label}</span>
                    <span>something</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Present Address */}
            <div className="space-y-6">
              <div className="flex items-center text-sm md:text-base lg:text-lg">
                <h1 className="mr-4 whitespace-nowrap font-semibold">Present Address</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-4 flex flex-col items-center lg:flex-none lg:items-start">
                {fields.map((label, idx) => (
                  <div className="text-sm md:text-base lg:text-lg grid grid-cols-[180px_1fr] gap-12" key={`present-${idx}`}>
                    <span className="text-muted-foreground">{label}</span>
                    <span>something</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Docs */}
      <Card className='shadow-sm rounded-xl'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>ID Documents</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-12'>
            <div className="space-y-12">
              <div className="flex items-center text-sm md:text-base lg:text-lg ">
                <h1 className="mr-4 whitespace-nowrap">NID/BRC</h1>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>
              <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
                <h1 className="text-muted-foreground">National ID No.</h1>
                <h1>Fakid Arman</h1>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex items-center text-sm md:text-base lg:text-lg">
                <h1 className="mr-4 whitespace-nowrap">Dual Citizenship</h1>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>
              <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
                <h1 className="text-muted-foreground">Dual Citizenship</h1>
                <h1>Fakid Arman</h1>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parental Info */}

      <Card className='shadow-sm rounded-xl'>
        <CardHeader className="flex items-center flex-row justify-between">
          <CardTitle className='text-base lg:text-xl'>Parental Information</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* Father Information */}
            <div className="space-y-6">
              <div className="flex items-center text-sm md:text-base lg:text-lg">
                <h1 className="mr-4 whitespace-nowrap font-semibold">Father Information</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-6 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
                {fields2.map((label, idx) => (
                  <div className="text-sm md:text-base lg:text-lg grid grid-cols-[180px_1fr] gap-12" key={`permanent-${idx}`}>
                    <span className="text-muted-foreground">{label}</span>
                    <span>something</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mother Information */}
            <div className="space-y-6">
              <div className="text-sm md:text-base lg:text-lg  flex items-center">
                <h1 className="mr-4 whitespace-nowrap font-semibold">Mother Information</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-6 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
                {fields3.map((label, idx) => (
                  <div className="text-sm md:text-base lg:text-lg grid grid-cols-[180px_1fr] gap-12" key={`present-${idx}`}>
                    <span className="text-muted-foreground">{label}</span>
                    <span>something</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spouse Info */}
      <Card className='shadow-sm rounded-xl'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Spouse Information</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center space-y-6'>

          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Marital Status</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Spouse's name (as per NID/BRC)</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Profession</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Nationality</h1>
            <h1>Fakid Arman</h1>
          </div>

        </CardContent>
      </Card>

      {/* Emergency Contact */}

      <Card className='shadow-sm rounded-xl'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Emergency Contact</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='space-y-6 flex flex-col items-center text-sm md:text-base lg:text-lg'>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Emergency Contact relationship</h1>
              <h1>Fakid Arman</h1>
            </div>
            <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
              <h1 className="text-muted-foreground">Name (as per NID/BRC)</h1>
              <h1>Fakid Arman</h1>
            </div>
          </div>

          <div className="flex items-center text-sm md:text-base lg:text-lg">
            <h1 className="mr-4 whitespace-nowrap font-semibold">Address</h1>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            <div className="text-sm md:text-base lg:text-lg space-y-4 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
              {fields4.map((label, idx) => (
                <div className="text-sm md:text-base lg:text-lg grid grid-cols-[180px_1fr] gap-12" key={`permanent-${idx}`}>
                  <span className="text-muted-foreground">{label}</span>
                  <span >something</span>
                </div>
              ))}
            </div>

            <div className="text-sm md:text-base lg:text-lg space-y-4 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
              {fields5.map((label, idx) => (
                <div className="text-sm md:text-base lg:text-lg grid grid-cols-[180px_1fr] gap-12" key={`present-${idx}`}>
                  <span className="text-muted-foreground">{label}</span>
                  <span>something</span>
                </div>
              ))}
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Passport Options */}
      <Card className='shadow-sm rounded-xl'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Passport Options</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center space-y-6'>

          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Validity</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Passport Price</h1>
            <h1>Fakid Arman</h1>
          </div>

        </CardContent>
      </Card>

      {/* Delivery Options and appointment */}

      <Card className='shadow-sm rounded-xl'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Delivery Options and Appointment</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center space-y-6'>

          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Delivery Type</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Delivery Fee</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Appointment Date</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40 text-sm md:text-base lg:text-lg'>
            <h1 className="text-muted-foreground">Appointment Time</h1>
            <h1>Fakid Arman</h1>
          </div>

        </CardContent>
      </Card>                

        {/* <div className='w-full space-y-4 text-left'>
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
        </div> */}
        {/* Create Token Button */}
        
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
        {/* Image Upload */}
        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            if (e.target.files?.[0]) setImageFile(e.target.files[0])
          }}
          className='mb-6'
        />
        <Dialog open={effectiveMintStage !== 'idle'}>
          <DialogTrigger asChild>
            <Button className='mt-6' onClick={handleCreateToken} disabled={ipfsUploading || mintStageFromHook !== 'idle'}>
              {ipfsUploading ? 'Uploading...' : 'Create Token'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Mint Passport NFT</DialogTitle>
              <DialogDescription>
                Follow the steps to mint your e-passport NFT. Please do not close this window.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {effectiveMintStage === 'ipfs' && (
                <Spinner classNames={{ label: "text-foreground mt-4" }} label="Uploading to IPFS..." variant="wave" />
              )}
              {effectiveMintStage === 'wallet' && (
                <Spinner classNames={{ label: "text-foreground mt-4" }} label="Waiting for wallet confirmation... Please confirm in MetaMask." variant="dots" />
              )}
              {effectiveMintStage === 'mining' && (
                <Progress isIndeterminate aria-label="Waiting for transaction..." className="max-w-md" size="sm" />
              )}
              {effectiveMintStage === 'done' && (
                <div className='p-6 rounded shadow-lg max-w-md w-full'>
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
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => { window.location.reload(); }} disabled={effectiveMintStage !== 'done'}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      
    </div>
  );
}

export default Overview
