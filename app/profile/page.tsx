import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {

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
  return (
    <div className='space-y-8 bg-card text-card-foreground px-4 lg:w-4/5 shadow-small rounded-large'>
      {/* Personal Info */}
    <Card >
      <CardHeader className='flex items-center flex-row justify-between'>
        <CardTitle className='text-base lg:text-lg'>Personal Information</CardTitle>
        <Button>Edit</Button>
      </CardHeader>
      <CardContent className='space-y-8'>
        <div className='flex flex-col items-center justify-center space-y-6 text-sm md:text-base lg:text-lg'>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>Gender</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>Full Name(as Per NID/BRC)</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>First Name</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>Sur Name</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>Profession</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>Religion</h1>
            <h1>Fakid Arman</h1>
          </div>
          <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
            <h1>Contact Number</h1>
            <h1>Fakid Arman</h1>
          </div>
        </div>

        <div className="flex items-center">
          <h1 className="mr-4 whitespace-nowrap">Birth Data</h1>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>
          <div className='flex flex-col items-center justify-center space-y-6 text-sm md:text-base lg:text-lg'>
        <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
          <h1>Country Of Birth</h1>
          <h1>Fakid Arman</h1>
        </div>
        <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
          <h1>Country Code</h1>
          <h1>Fakid Arman</h1>
        </div>
        <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
          <h1>District of Birth</h1>
          <h1>Fakid Arman</h1>
        </div>
        <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
          <h1>Birth Date</h1>
          <h1>Fakid Arman</h1>
        </div>
        <div className='grid grid-cols-[180px_1fr] gap-20 lg:gap-40'>
          <h1>Citizenship Type</h1>
          <h1>Fakid Arman</h1>
        </div>
        </div>
      </CardContent>
    </Card>
    
      {/* Address */}
      <Card>
        <CardHeader className="flex items-center flex-row justify-between">
          <CardTitle className='text-base lg:text-lg'>Address</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* Permanent Address */}
            <div className="space-y-6">
              <div className="flex items-center">
                <h1 className="mr-4 whitespace-nowrap text-sm font-semibold">Permanent Address</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-4 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
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
              <div className="space-y-4 flex flex-col items-center lg:flex-none lg:items-start">
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

      {/* ID Docs */}
      <Card>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-lg'>ID Documents</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-12'>
            <div className="space-y-12">
              <div className="flex items-center">
                <h1 className="mr-4 whitespace-nowrap">NID/BRC</h1>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>
              <div className='grid grid-cols-[180px_1fr] gap-12 text-sm md:text-base lg:text-lg'>
                <h1>National ID No.</h1>
                <h1>Fakid Arman</h1>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex items-center">
                <h1 className="mr-4 whitespace-nowrap">Dual Citizenship</h1>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>
              <div className='grid grid-cols-[180px_1fr] gap-12 text-sm md:text-base lg:text-lg'>
                <h1>Dual Citizenship</h1>
                <h1>Fakid Arman</h1>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parental Info */}

      <Card>
        <CardHeader className="flex items-center flex-row justify-between">
          <CardTitle className='text-base lg:text-lg'>Parental Information</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* Permanent Address */}
            <div className="space-y-6">
              <div className="flex items-center">
                <h1 className="mr-4 whitespace-nowrap text-sm font-semibold">Father Information</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-6 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
                {fields2.map((label, idx) => (
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
                <h1 className="mr-4 whitespace-nowrap text-sm font-semibold">Mother Information</h1>
                <div className="flex-1 border-t border-gray-400" />
              </div>
              <div className="space-y-6 flex flex-col items-center lg:flex-none lg:flex-row-none lg:items-start">
                {fields3.map((label, idx) => (
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
      
    </div>
  )
}

export default page
