import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  const fields = [
    "District",
    "City/Village/House",
    "Postal code",
    "Police Station",
    "Post Office"
  ]
  return (
    <div>
    <Card className='w-1/2'>
      <CardHeader className='flex items-center flex-row justify-between'>
        <CardTitle >Personal Information</CardTitle>
        <Button className='bg-card'>Edit</Button>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div>
          <div className='flex justify-between'>
            <h1>Full Name(as Per NID/BRC)</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='flex justify-between'>
            <h1>Sur Name</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='flex justify-between'>
            <h1>Profession</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='flex justify-between'>
            <h1>Contact Number</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='flex justify-between'>
            <h1>Given Name</h1>
            <h1>Fakid Arman</h1>
          </div>
        </div>

        <div className="flex items-center">
          <h1 className="mr-4 whitespace-nowrap">Birth Data</h1>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>
        <div>
        <div className='flex justify-between'>
          <h1>Full Name(as Per NID/BRC)</h1>
          <h1>Fakid Arman</h1>
        </div>
        <div className='flex justify-between'>
          <h1>Sur Name</h1>
          <h1>Fakid Arman</h1>
        </div>
        </div>
      </CardContent>
    </Card>
      <Card className="w-1/2">
        <CardHeader className="flex items-center flex-row justify-between">
          <CardTitle>Address</CardTitle>
          <Button className='bg-card'>Edit</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-12">
            {/* Permanent Address */}
            <div className="space-y-6">
              <div className="flex items-center">
                <h1 className="mr-4 whitespace-nowrap text-sm font-semibold">Permanent Address</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-4">
                {fields.map((label, idx) => (
                  <div className="grid grid-cols-[180px_1fr] gap-12" key={`permanent-${idx}`}>
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm">something</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Present Address */}
            <div className="space-y-6">
              <div className="flex items-center">
                <h1 className="mr-4 whitespace-nowrap text-sm font-semibold">Present Address</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-4">
                {fields.map((label, idx) => (
                  <div className="grid grid-cols-[180px_1fr] gap-12" key={`present-${idx}`}>
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm">something</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='w-1/2'>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle >ID Documents</CardTitle>
          <Button className='bg-card'>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-12'>
          <div className="space-y-12">
          <div className="flex items-center">
            <h1 className="mr-4 whitespace-nowrap">NID/BRC</h1>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>
         
            <div className='grid grid-cols-[180px_1fr] gap-12'>
              <h1>National ID No.</h1>
              <h1>Fakid Arman</h1>
            </div>
          </div>
          
          <div className="space-y-12">
          <div className="flex items-center">
            <h1 className="mr-4 whitespace-nowrap">Dual Citizenship</h1>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>
            <div className='grid grid-cols-[180px_1fr] gap-12'>
              <h1>Dual Citizenship</h1>
              <h1>Fakid Arman</h1>
            </div>
          </div> 
          </div> 
        </CardContent>
      </Card>

    </div>
  )
}

export default page
