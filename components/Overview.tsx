import React, { useState } from 'react'
import { Button } from './ui/button'
import { useFormStore } from '@/app/store';
import { sha256 } from 'js-sha256';

const Overview = () => {
  const formData = useFormStore((state) => state.formData);
  const [hash, setHash] = useState<string | null>(null);

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

  function handleCreateToken() {
    // Only include personal sections up to Emergency Contact (in order)
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
  }

  return (
    <div className='bg-card flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-2xl bg-card flex flex-col items-center justify-center rounded-lg p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-6'>Application Overview</h2>
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
        <Button className='mt-6' onClick={handleCreateToken}>Create Token</Button>
        {hash && (
          <div className='mt-6 w-full break-all bg-muted p-4 rounded'>
            <div className='font-semibold mb-2'>Data Hash (SHA-256):</div>
            <div className='text-xs font-mono'>{hash}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview
