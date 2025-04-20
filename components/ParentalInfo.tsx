import { useFormStore } from '@/app/store';
import { parentalInfoFormSchema } from '@/app/UI_Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { z } from 'zod';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';


type FormValues = z.infer<typeof parentalInfoFormSchema>;

interface ParentalInfoProps {
    goToNextForm: () => void;
}

const ParentalInfo = ({ goToNextForm }: ParentalInfoProps) => {
  const parentalInfoForm = useFormStore((state) => state.formData.parentalInfo) || {};
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [fUnknown,setFunknown] = useState(parentalInfoForm.fInfoStatus);
  const [mUnknown,setMunknown] = useState(parentalInfoForm.mInfoStatus);
  const [lUnknown,setLunknown] = useState(parentalInfoForm.lgiStatus);
  

  const form = useForm<FormValues>({
    resolver: zodResolver(parentalInfoFormSchema),
    defaultValues: {
      fInfoStatus:parentalInfoForm.fInfoStatus,
      fatherName: parentalInfoForm.fatherName,
      fatherProfession: parentalInfoForm.fatherProfession,
      fatherNationality:parentalInfoForm.fatherNationality,
      fatherNid:parentalInfoForm.fatherNid,
      mInfoStatus: parentalInfoForm.mInfoStatus,
      motherName: parentalInfoForm.motherName,
      motherProfession: parentalInfoForm.motherProfession,
      motherNationality:parentalInfoForm.motherNationality,
      motherNid:parentalInfoForm.motherNid,
      lgiStatus:parentalInfoForm.lgiStatus,
      legalGname: parentalInfoForm.legalGname,
      legalGprofession: parentalInfoForm.legalGprofession,
      legalGnationality: parentalInfoForm.legalGnationality,
      mhaon: parentalInfoForm.mhaon,
    },
    mode: "onChange",
  });


  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      form.reset({
        fInfoStatus: parentalInfoForm.fInfoStatus,
        fatherName: parentalInfoForm.fatherName,
        fatherProfession: parentalInfoForm.fatherProfession,
        fatherNationality: parentalInfoForm.fatherNationality,
        fatherNid: parentalInfoForm.fatherNid,
        mInfoStatus: parentalInfoForm.mInfoStatus,
        motherName: parentalInfoForm.motherName,
        motherProfession: parentalInfoForm.motherProfession,
        motherNationality: parentalInfoForm.motherNationality,
        motherNid: parentalInfoForm.motherNid,
        lgiStatus: parentalInfoForm.lgiStatus,
        legalGname: parentalInfoForm.legalGname,
        legalGprofession: parentalInfoForm.legalGprofession,
        legalGnationality: parentalInfoForm.legalGnationality,
        mhaon: parentalInfoForm.mhaon,
      });
    }
  }, [hydrated, parentalInfoForm, form]);
  
  function onSubmit(values: FormValues) {
    console.log('🚀 ~ values:', values);
    updateFormData('parentalInfo', values);
    goToNextForm();
  }

  if (!hydrated) {
    return <p>Loading...</p>;
  }
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg text-card-foreground'>Parental Information</CardTitle>
      </CardHeader>
      <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fInfoStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-12 space-y-0 rounded-md border-none p-4 shadow">
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Father Information
                    </FormLabel>
                    
                  </div>
                <div className='flex gap-4'>
                 <FormControl >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(e)=>{
                        field.onChange(e);
                        {fUnknown?setFunknown(false):setFunknown(true)};
                        // setFunknown(true);
                      }}
                    />
                      
                   
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Unknown
                    </FormLabel>

                  </div>
                  </div> 
                  
                  
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Father Name</FormLabel>
                <FormControl>
                  <Input
                    disabled = {fUnknown}
                    className='w-1/2'
                    placeholder="Enter Father Name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setIsSubmitted(false);
                    }}
                  />
                </FormControl>
                {isSubmitted && <FormMessage className="text-destructive" />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fatherProfession"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Father Profession</FormLabel>
                <Select disabled={fUnknown} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Profession" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {isSubmitted && <FormMessage className="text-destructive" />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fatherNationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Father Nationality</FormLabel>
                <Select disabled={fUnknown} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Nationality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {isSubmitted && <FormMessage className="text-destructive" />}
              </FormItem>
            )}
          />

            <FormField
              control={form.control}
              name="fatherNid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">National ID No. (optional)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={fUnknown}
                      placeholder="Enter your 10-digit national ID"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSubmitted(false);
                      }}
                      className="w-full md:w-2/3"
                    // maxLength={10}
                    />
                  </FormControl>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />
          
          {/* mother */}

            <FormField
              control={form.control}
              name="mInfoStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-12 space-y-0 rounded-md border-none p-4 shadow">
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mother Information
                    </FormLabel>

                  </div>
                  <div className='flex gap-4'>
                    <FormControl >
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                          { mUnknown ? setMunknown(false) : setMunknown(true) };
                          // setFunknown(true);
                        }}
                      />


                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Unknown
                      </FormLabel>

                    </div>
                  </div>


                </FormItem>
              )}
            />    

          <FormField
            control={form.control}
            name="motherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Mother Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={mUnknown}
                    className='w-1/2'
                    placeholder="Enter Mother Name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setIsSubmitted(false);
                    }}
                  />
                </FormControl>
                {isSubmitted && <FormMessage className="text-destructive" />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motherProfession"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Mother Profession</FormLabel>
                <Select disabled={mUnknown} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Profession" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {isSubmitted && <FormMessage className="text-destructive" />}
              </FormItem>
            )}
          />
            <FormField
              control={form.control}
              name="motherNationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Mother Nationality</FormLabel>
                  <Select disabled={mUnknown} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] border-input">
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherNid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">National ID No. (optional)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={mUnknown}
                      placeholder="Enter your 10-digit national ID"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSubmitted(false);
                      }}
                      className="w-full md:w-2/3"
                    // maxLength={10}
                    />
                  </FormControl>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lgiStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-12 space-y-0 rounded-md border-none p-4 shadow">
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Legal Guardian Information
                    </FormLabel>

                  </div>
                  <div className='flex gap-4'>
                    <FormControl >
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                          { lUnknown ? setLunknown(false) : setLunknown(true) };
                          // setFunknown(true);
                        }}
                      />


                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Not Applicable
                      </FormLabel>

                    </div>
                  </div>


                </FormItem>
              )}
            />

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mb-6">
              <Label className="text-yellow-800 dark:text-yellow-200 font-medium">
                Note: Only applicable if you have a Legal Guardian Certificate from Ministry of Home Affairs as per Government Rule.
              </Label>
            </div>

            {/* legal */}

            <FormField
              control={form.control}
              name="legalGname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Legal Guardian's name (as per NID/BRC)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={lUnknown}
                      className="w-11/12 lg:w-2/3"
                      placeholder="Legal Guardian Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSubmitted(false);
                      }}
                    />
                  </FormControl>
                  {isSubmitted && <FormMessage />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalGprofession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Select Profession</FormLabel>
                  <Select disabled={lUnknown} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] border-input">
                        <SelectValue placeholder="Select Profession" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalGnationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Select Nationality</FormLabel>
                  <Select disabled={lUnknown} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] border-input">
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mhaon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Ministry of Home Affairs Order Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={lUnknown}
                      placeholder=""
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSubmitted(false);
                      }}
                      className="w-full md:w-2/3"
                    // maxLength={10}
                    />
                  </FormControl>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />
 
            <div className="pt-4">
              <Button type="submit"
                onClick={() => setIsSubmitted(true)}
                className="w-full md:w-auto">
                Save and Continue
              </Button>
            </div>
        </form>
        
      </Form>
      </CardContent>
    </Card>
  )
}

export default ParentalInfo
