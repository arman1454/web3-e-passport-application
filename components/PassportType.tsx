import React from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from './ui/button'


const PassportType = () => {
  return (
    <div className='flex flex-col gap-4'>
        <h2>Passport Type</h2>
        <h1>Select the Passport Type for your applications!</h1>

          <RadioGroup className='pt-2 pb-4 flex flex-col gap-10' defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Ordinary Passport</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Official Passport</Label>
              </div>
          </RadioGroup>
          <Button className='w-40'>Save and continue</Button>
    </div>
  )
}

export default PassportType
