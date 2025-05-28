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
import { format } from 'date-fns'
import {
  personalInfoAllLabels, addressAllLabels,
  idDocumentAllLabels,
  parentalInfoAllLabels,
  spouseInfoAllLabels,
  emergencyContactAllLabels,
  passportOptionsAllLabels,
  deliveryAndAppointmentLabels } from '@/app/cardLabels'


const CONTRACT_ADDRESS = '0x129A04E9E5aAdBc2bd933D9CE90b481d7E6d07c4';

// Add prop type for onEditSection
interface OverviewProps {
  onEditSection?: (index: number) => void;
}

const Overview: React.FC<OverviewProps> = ({ onEditSection }) => {


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

  useEffect(()=>{
    console.log(formData);   
    
  },[])

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
            
            <Card>
              <CardHeader className='flex items-center flex-row justify-between'>
                <CardTitle className='text-base lg:text-xl'>Personal Information</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(1)}>Edit</Button>
              </CardHeader>
              <CardContent className='space-y-8'>
                <div className='mx-auto w-full max-w-2xl'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm md:text-base lg:text-lg'>
                    {personalInfoAllLabels.slice(0, 7).map(({ label, key }) => (
                      <React.Fragment key={label}>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground font-medium">{label}</span>
                          <span className="font-semibold text-right">{(formData.personalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-sm md:text-base lg:text-lg mt-8">
                  <h1 className="mr-4 whitespace-nowrap font-semibold">Birth Data</h1>
                  <div className="flex-1 border-t border-gray-400"></div>
                </div>
                <div className='mx-auto w-full max-w-2xl'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm md:text-base lg:text-lg'>
                    {personalInfoAllLabels.slice(7, 12).map(({ label, key }) => (
                      <React.Fragment key={label}>
                        <div className="flex flex-row items-center py-1">
                          <span className="text-muted-foreground font-medium w-1/2 text-left">{label}</span>
                          <span className="font-semibold w-1/2 text-right break-words">{(formData.personalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
      
      
            {/* Address */}
            <Card>
              <CardHeader className="flex items-center flex-row justify-between">
                <CardTitle className='text-base lg:text-xl'>Address</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(2)}>Edit</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Permanent Address */}
                  <div className="space-y-6">
                    <div className="lg:w-11/12 flex items-center text-sm md:text-base lg:text-lg">
                      <h1 className="mr-4 whitespace-nowrap font-semibold">Permanent Address</h1>
                      <div className="flex-1 border-t border-gray-400" />
                    </div>
                    <div className="space-y-4 flex flex-col items-center lg:items-start">
                      {addressAllLabels.map(({ label, key }) => (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`permanent-${key}`}> 
                          <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                          <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formData.address as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Present Address */}
                  <div className="space-y-6">
                    <div className="lg:w-11/12 flex items-center text-sm md:text-base lg:text-lg">
                      <h1 className="mr-4 whitespace-nowrap font-semibold">Present Address</h1>
                      <div className="flex-1 border-t border-gray-400" />
                    </div>
                    <div className="space-y-4 flex flex-col items-center lg:items-start">
                      {addressAllLabels.map(({ label, key }) => (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`present-${key}`}> 
                          <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                          <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formData.address as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      
            {/* ID Docs */}
            <Card className="shadow-sm rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-base lg:text-xl font-semibold">ID Documents</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(3)}>Edit</Button>
              </div>
              <div className="border-t border-border mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
                {idDocumentAllLabels.map(({ label, key }) => (
                  <div key={key}>
                    <span className="text-muted-foreground">{label}</span>
                    <div className="font-bold">{(formData.idDocuments as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</div>
                  </div>
                ))}
              </div>
            </Card>
      
            {/* Parental Info */}
      
            <Card>
              <CardHeader className="flex items-center flex-row justify-between">
                <CardTitle className='text-base lg:text-xl'>Parental Information</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(4)}>Edit</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Permanent Address */}
                  <div className="space-y-6">
                    <div className="lg:w-11/12 flex items-center text-sm md:text-base lg:text-lg">
                      <h1 className="mr-4 whitespace-nowrap font-semibold">Father Information</h1>
                      <div className="flex-1 border-t border-gray-400" />
                    </div>
                    <div className="space-y-4 flex flex-col items-center lg:items-start">
                      {parentalInfoAllLabels.slice(0, 3).map(({ label, key }) => (
                        <React.Fragment key={label}>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`permanent-${key}`}>
                            <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                            <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formData.parentalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  {/* Present Address */}
                  <div className="space-y-6">
                    <div className="lg:w-11/12 flex items-center text-sm md:text-base lg:text-lg">
                      <h1 className="mr-4 whitespace-nowrap font-semibold">Mother Information</h1>
                      <div className="flex-1 border-t border-gray-400" />
                    </div>
                    <div className="space-y-4 flex flex-col items-center lg:items-start">
                      {parentalInfoAllLabels.slice(3, 6).map(({ label, key }) => (
                        <React.Fragment key={label}>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`permanent-${key}`}>
                            <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                            <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formData.parentalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      
            {/* Spouse Info */}
            <Card className="shadow-sm rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-base lg:text-xl font-semibold">Spouse Information</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(5)}>Edit</Button>
              </div>
              <div className="border-t border-border mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
                {((formData.spouseInfo as any).maritalStatus === 'Single') ? (
                  <div>
                    <span className="text-muted-foreground">Marital Status</span>
                    <div className="font-bold">Single</div>
                  </div>
                ) : (
                  spouseInfoAllLabels.map(({ label, key }) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{label}</span>
                      <div className="font-bold">{(formData.spouseInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</div>
                    </div>
                  ))
                )}
              </div>
            </Card>
      
      
            {/* Emergency Contact */}
      
            <Card>
              <CardHeader className='flex items-center flex-row justify-between'>
                <CardTitle className='text-base lg:text-xl'>Emergency Contact</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(6)}>Edit</Button>
              </CardHeader>
              <CardContent className='space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm md:text-base lg:text-lg'>
                  {emergencyContactAllLabels.slice(0,2).map(({ label, key }) => (
                     <React.Fragment key={label}>
                      <div className="w-11/12 flex justify-between items-center py-1" key={label}>
                        <span className="text-muted-foreground font-medium">{label}</span>
                        <span className="font-semibold text-right">{(formData.emergencyContact as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
      
                <div className="flex items-center text-sm md:text-base lg:text-lg">
                  <h1 className="mr-4 whitespace-nowrap font-semibold">Address</h1>
                  <div className="flex-1 border-t border-gray-400"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                  
                  <div className="space-y-4 flex flex-col items-center lg:items-start">
                    {emergencyContactAllLabels.slice(2, 7).map(({ label, key }) => (
                      <React.Fragment key={label}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`permanent-${key}`}>
                          <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                          <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formData.emergencyContact as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
      
                  <div className="space-y-4 flex flex-col items-center lg:items-start">
                    {emergencyContactAllLabels.slice(7, 12).map(({ label, key }) => (
                      <React.Fragment key={label}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`permanent-${key}`}>
                          <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                          <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formData.emergencyContact as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
      
                </div>
              </CardContent>
            </Card>
            
      
            {/* Passport Options */}
            <Card className="shadow-sm rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-base lg:text-xl font-semibold">Passport Options</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(7)}>Edit</Button>
              </div>
              <div className="border-t border-border mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
                {passportOptionsAllLabels.map(({label,key})=>(
                  <div key={key}>
                    <span className="text-muted-foreground">{label}</span>
                    <div className="font-bold">{(formData.passportOptions as any )[key]}</div>
                  </div>
                ))}
              </div>
            </Card>
      
      
            {/* Delivery Options and appointment */}
      
            <Card className="shadow-sm rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-base lg:text-xl font-semibold">Delivery Options and Appointment</CardTitle>
                <Button onClick={() => onEditSection && onEditSection(8)}>Edit</Button>
              </div>
              <div className="border-t border-border mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
                {deliveryAndAppointmentLabels.map(({ label, key }) => {
                  let value: string | JSX.Element = '';
                  if (key === 'appointmentDate') {
                    const dt = formData.deliveryAndAppointment?.dateTime;
                    value = dt ? new Date(dt).toLocaleDateString() : <span className="italic text-muted-foreground">N/A</span>;
                  } else if (key === 'appointmentTime') {
                    const dt = formData.deliveryAndAppointment?.dateTime;
                    value = dt ? new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span className="italic text-muted-foreground">N/A</span>;
                  } else {
                    value = (formData.deliveryAndAppointment as any)?.[key] || <span className="italic text-muted-foreground">N/A</span>;
                  }
                  return (
                    <div key={key}>
                      <span className="text-muted-foreground">{label}</span>
                      <div className="font-bold">{value}</div>
                    </div>
                  );
                })}
              </div>
            </Card>               
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
