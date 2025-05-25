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
  return (
    <div className='space-y-8 text-card-foreground px-4 lg:w-4/5 shadow-small rounded-large'>
      {/* Personal Info */}
            <Card >
              <CardHeader className='border-2 border-card bg-background flex items-center flex-row justify-between'>
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
            <Card>
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
            <Card>
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
      
            <Card>
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
            <Card>
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
      
            <Card>
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
            <Card>
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
      
            <Card>
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
      
    </div>
  )
}

export default page
