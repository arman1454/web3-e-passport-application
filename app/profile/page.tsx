import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {

  const formDatas =  {
    passportType: { type: "ordinary" },
    personalInfo: {
      gender: "Male",
        fullName: "John Michael Doe",
          firstName: "John",
            surName: "Doe",
              profession: "Software Engineer",
                religion: "Christianity",
                  countryCode: "+1",
                    mobileNo: "1234567890",
                      birthCountry: "USA",
                        birthDistrict: "Los Angeles",
                          birthDate: "1990-05-15",
                            citizenType: "By Birth"
    },
    address: {
      district: "Dhaka",
        city: "Uttara",
          block: "C",
            postOffice: "Uttara PO",
              postalCode: "1230",
                policeStation: "Uttara East",
                  yes: true,
                    no: false,
                      country: "Bangladesh",
                        district2: "Dhaka",
                          city2: "Motijheel",
                            block2: "B",
                              postOffice2: "Motijheel PO",
                                postalCode2: "1000",
                                  policeStation2: "Motijheel PS",
                                    officeType: "Regional Passport Office (RPO)"
    },
    idDocuments: {
      prevPassport: "AB1234567",
        otherPassport: "nothing",
          nid: "1990123456789"
    },
    parentalInfo: {
      fInfoStatus: true,
        fatherName: "Michael Doe",
          fatherProfession: "Doctor",
            fatherNationality: "American",
              fatherNid: "1980123456789",
                mInfoStatus: true,
                  motherName: "Jane Doe",
                    motherProfession: "Teacher",
                      motherNationality: "American",
                        motherNid: "1981123456789",
                          lgiStatus: true,
                            legalGname: "Robert Smith",
                              legalGprofession: "Lawyer",
                                legalGnationality: "American",
                                  mhaon: "Yes"
    },
    spouseInfo: {
      maritalStatus: "Married",
        spouseName: "Anna Doe",
          spouseProfession: "Architect",
            spouseNationality: "American"
    },
    emergencyContact: {
      contactRelationShip: "Brother",
        name: "David Doe",
          country: "USA",
            district: "New York",
              city: "Brooklyn",
                block: "D",
                  postOffice: "Brooklyn PO",
                    postalCode: "11201",
                      policeStation: "Brooklyn PS",
                        email: "david.doe@example.com",
                          countryCode: "+1",
                            mobileNo: "9876543210"
    },
    passportOptions: {
      validity: "10 Years",
        price: "5000 BDT"
    },
    deliveryAndAppointment: {
      deliveryType: "Express",
        price: "1000 BDT",
      dateTime: "2025-05-28T03:00:00.000Z"
    }
  }


  // Combine all labels for this card in a single array, with a 'section' property for grouping
  const personalInfoAllLabels = [
    { label: "Gender", key: "gender" },
    { label: "Full Name(as Per NID/BRC)", key: "fullName" },
    { label: "First Name", key: "firstName" },
    { label: "Sur Name", key: "surName" },
    { label: "Profession", key: "profession" },
    { label: "Religion", key: "religion" },
    { label: "Contact Number", key: "mobileNo" },
    { label: "Country Of Birth", key: "birthCountry" },
    { label: "Country Code", key: "countryCode" },
    { label: "District of Birth", key: "birthDistrict" },
    { label: "Birth Date", key: "birthDate" },
    { label: "Citizenship Type", key: "citizenType" },
  ];

  const addressAllLabels = [
    { label: "District", key: "district" },
    { label: "City/Village/House", key: "city" },
    { label: "Road/Block/Sector", key: "block" },
    { label: "Post Office", key: "postOffice" },
    { label: "Postal Code", key: "postalCode" },
    { label: "Police Station", key: "policeStation" },
  ]

  const idDocumentAllLabels = [
    { label: "National ID No.", key: "nid" },
    { label: "Dual Citizenship", key: "otherPassport" },
  ]

  const parentalInfoAllLabels = [
    { label: "Father's name(as per NID/BRC)",key:"fatherName"},
    { label: "Profession",key:"fatherProfession"},
    { label: "Nationality",key:"fatherNationality"},
    { label: "Mother's name(as per NID/BRC)",key:"motherName"},
    { label: "Profession",key:"motherProfession"},
    { label: "Nationality",key:"motherNationality"},
  ]

  const spouseInfoAllLabels = [
    { label:"Marital Status",key:"maritalStatus"},
    { label:"Spouse's name (as per NID/BRC)",key:"spouseName"},
    { label:"Profession",key:"spouseProfession"},
    { label:"Nationality",key:"spouseNationality"},
  ]

  const emergencyContactAllLabels = [
    { label:"Emergency Contact relationship",key:"contactRelationShip"},
    { label:"Name (as per NID/BRC)",key:"name"},
    { label:"Country",key:"country"},
    { label:"District",key:"district"},
    { label:"City",key:"city"},
    { label:"Block/Road/House",key:"block"},
    { label:"Post Office",key:"postOffice"},
    { label:"Postal Code",key:"postalCode"},
    { label:"Police Station",key:"policeStation"},
    { label:"Email",key:"email"},
    { label:"Country Code",key:"countryCode"},
    { label:"Mobile Number",key:"mobileNo"},
  ]

  const passportOptionsAllLabels = [
    { label:"Validity",key:"validity"},
    { label:"Passport Price",key:"price"},
  ]

  // Delivery and Appointment labels: use unique keys for date and time, but both map to dateTime in data
  const deliveryAndAppointmentLabels = [
    { label: "Delivery Type", key: "deliveryType" },
    { label: "Delivery Fee", key: "price" },
    { label: "Appointment Date", key: "appointmentDate" },
    { label: "Appointment Time", key: "appointmentTime" },
  ];
  

  return (
    <div className='space-y-8 text-card-foreground px-4 lg:w-4/5 shadow-small rounded-large'>
      
      {/* Personal Info */}
      
      <Card>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Personal Information</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='mx-auto w-full max-w-2xl'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm md:text-base lg:text-lg'>
              {personalInfoAllLabels.slice(0, 7).map(({ label, key }) => (
                <React.Fragment key={label}>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground font-medium">{label}</span>
                    <span className="font-semibold text-right">{(formDatas.personalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
                    <span className="font-semibold w-1/2 text-right break-words">{(formDatas.personalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
          <Button>Edit</Button>
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
                    <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formDatas.address as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
                    <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formDatas.address as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
          <Button>Edit</Button>
        </div>
        <div className="border-t border-border mb-4" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
          {idDocumentAllLabels.map(({ label, key }) => (
            <div key={key}>
              <span className="text-muted-foreground">{label}</span>
              <div className="font-bold">{(formDatas.idDocuments as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Parental Info */}

      <Card>
        <CardHeader className="flex items-center flex-row justify-between">
          <CardTitle className='text-base lg:text-xl'>Parental Information</CardTitle>
          <Button>Edit</Button>
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
                      <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formDatas.parentalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
                      <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formDatas.parentalInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
          <Button>Edit</Button>
        </div>
        <div className="border-t border-border mb-4" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
          {((formDatas.spouseInfo as any).maritalStatus === 'Single') ? (
            <div>
              <span className="text-muted-foreground">Marital Status</span>
              <div className="font-bold">Single</div>
            </div>
          ) : (
            spouseInfoAllLabels.map(({ label, key }) => (
              <div key={key}>
                <span className="text-muted-foreground">{label}</span>
                <div className="font-bold">{(formDatas.spouseInfo as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</div>
              </div>
            ))
          )}
        </div>
      </Card>


      {/* Emergency Contact */}

      <Card>
        <CardHeader className='flex items-center flex-row justify-between'>
          <CardTitle className='text-base lg:text-xl'>Emergency Contact</CardTitle>
          <Button>Edit</Button>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm md:text-base lg:text-lg'>
            {emergencyContactAllLabels.slice(0,2).map(({ label, key }) => (
               <React.Fragment key={label}>
                <div className="w-11/12 flex justify-between items-center py-1" key={label}>
                  <span className="text-muted-foreground font-medium">{label}</span>
                  <span className="font-semibold text-right">{(formDatas.emergencyContact as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
                    <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formDatas.emergencyContact as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="space-y-4 flex flex-col items-center lg:items-start">
              {emergencyContactAllLabels.slice(7, 12).map(({ label, key }) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 w-full lg:w-11/12" key={`permanent-${key}`}>
                    <span className="text-muted-foreground font-medium w-full sm:w-1/2 text-left">{label}</span>
                    <span className="font-semibold w-full sm:w-1/2 text-right break-words">{(formDatas.emergencyContact as any)[key] || <span className="italic text-muted-foreground">N/A</span>}</span>
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
          <Button>Edit</Button>
        </div>
        <div className="border-t border-border mb-4" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
          {passportOptionsAllLabels.map(({label,key})=>(
            <div key={key}>
              <span className="text-muted-foreground">{label}</span>
              <div className="font-bold">{(formDatas.passportOptions as any )[key]}</div>
            </div>
          ))}
        </div>
      </Card>


      {/* Delivery Options and appointment */}

      <Card className="shadow-sm rounded-xl p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-base lg:text-xl font-semibold">Delivery Options and Appointment</CardTitle>
          <Button>Edit</Button>
        </div>
        <div className="border-t border-border mb-4" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base lg:text-lg">
          {deliveryAndAppointmentLabels.map(({ label, key }) => {
            let value: string | JSX.Element = '';
            if (key === 'appointmentDate') {
              const dt = formDatas.deliveryAndAppointment.dateTime;
              value = dt ? new Date(dt).toLocaleDateString() : <span className="italic text-muted-foreground">N/A</span>;
            } else if (key === 'appointmentTime') {
              const dt = formDatas.deliveryAndAppointment.dateTime;
              value = dt ? new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span className="italic text-muted-foreground">N/A</span>;
            } else {
              value = (formDatas.deliveryAndAppointment as any)[key] || <span className="italic text-muted-foreground">N/A</span>;
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







    </div>
  )
}

export default page
