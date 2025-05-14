"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { useFormStore } from '@/app/store';
import { emergencyContactFormSchema } from '@/app/UI_Schemas';
import { EmergencyContact_Inf } from '@/app/store';

interface EmergencyContactProps {
  goToNextForm: () => void;
}

const EmergencyContact = ({ goToNextForm }: EmergencyContactProps) => {
  const emergencyContactData = useFormStore((state) => state.formData.emergencyContact) as EmergencyContact_Inf;
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const prevCountryCodeRef = React.useRef<string | null>(null);

  const form = useForm<z.infer<typeof emergencyContactFormSchema>>({
    resolver: zodResolver(emergencyContactFormSchema),
    defaultValues: emergencyContactData,
    mode: 'onChange',
  });

  // Watch the `countryCode` field
  const selectedCountryCode = form.watch('countryCode');
  
  // Effect to update the mobile number field when country code changes
  useEffect(() => {
    // Skip if there's no country code selected yet
    if (!selectedCountryCode) return;
    
    // Skip if the previous value is the same (no change)
    if (prevCountryCodeRef.current === selectedCountryCode) return;
    
    // Extract the country code (e.g., "+880" from "BANGLADESH +880")
    const code = selectedCountryCode.split(' ').pop() || '';
    
    // Only update if mobile is empty or starts with a previous code
    const currentMobile = form.getValues('mobileNo') || '';
    const shouldUpdate = 
      currentMobile === '' || 
      (prevCountryCodeRef.current && 
        currentMobile.startsWith(prevCountryCodeRef.current.split(' ').pop() || ''));
    
    if (shouldUpdate) {
      // Update the mobile number to just the country code
      form.setValue('mobileNo', code);
    }
    
    // Update the ref with the current value for next comparison
    prevCountryCodeRef.current = selectedCountryCode;
  }, [selectedCountryCode, form]);

  // Ensure Zustand has loaded before rendering form
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Sync Zustand data to React Hook Form after hydration
  useEffect(() => {
    if (hydrated) {
      form.reset(emergencyContactData);
    }
  }, [hydrated, emergencyContactData, form]);

  function onSubmit(data: z.infer<typeof emergencyContactFormSchema>) {
    console.log(data);
    updateFormData('emergencyContact', data);
    // After saving the data, navigate to the next form
    goToNextForm();
  }

  if (!hydrated) {
    return <p>Loading...</p>;
  }

  // --- Select options constants ---
const RELATIONSHIP_OPTIONS = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Spouse", label: "Spouse" },
  { value: "Sibling", label: "Sibling" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];
const COUNTRY_OPTIONS = [
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "India", label: "India" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
];
const DISTRICT_OPTIONS = [
  { value: "Dhaka", label: "Dhaka" },
  { value: "Chittagong", label: "Chittagong" },
  { value: "Rajshahi", label: "Rajshahi" },
  { value: "Khulna", label: "Khulna" },
  { value: "Sylhet", label: "Sylhet" },
];
const POST_OFFICE_OPTIONS = [
  { value: "GPO", label: "GPO" },
  { value: "Banani", label: "Banani" },
  { value: "Gulshan", label: "Gulshan" },
  { value: "Mohakhali", label: "Mohakhali" },
  { value: "Dhanmondi", label: "Dhanmondi" },
  { value: "Mirpur", label: "Mirpur" },
];
const POLICE_STATION_OPTIONS = [
  { value: "Gulshan", label: "Gulshan" },
  { value: "Banani", label: "Banani" },
  { value: "Mohammadpur", label: "Mohammadpur" },
  { value: "Dhanmondi", label: "Dhanmondi" },
  { value: "Mirpur", label: "Mirpur" },
];
const COUNTRY_CODE_OPTIONS = [
  { value: "BANGLADESH +880", label: "BANGLADESH +880" },
  { value: "INDIA +91", label: "INDIA +91" },
  { value: "PAKISTAN +92", label: "PAKISTAN +92" },
  { value: "USA +1", label: "USA +1" },
  { value: "UK +44", label: "UK +44" },
];

// --- DRY helpers ---
const renderTextField = (
  name: keyof EmergencyContact_Inf,
  label: string,
  placeholder: string,
) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => {
      let safeValue = field.value;
      if (typeof safeValue === 'boolean' || typeof safeValue === 'undefined') {
        safeValue = '';
      }
      return (
        <FormItem className="w-full">
          <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
          <FormControl>
            <Input
              className="w-11/12 lg:w-2/3"
              placeholder={placeholder}
              {...field}
              value={safeValue}
              onChange={(e) => {
                field.onChange(e);
                setIsSubmitted(false);
              }}
            />
          </FormControl>
          {isSubmitted && <FormMessage className="text-destructive" />}
        </FormItem>
      );
    }}
  />
);

const renderSelectField = (
  name: keyof EmergencyContact_Inf,
  label: string,
  placeholder: string,
  options: { value: string; label: string }[],
) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full md:w-2/3">
        <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger className="w-[180px] border-input">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-popover text-popover-foreground">
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isSubmitted && <FormMessage className="text-destructive" />}
      </FormItem>
    )}
  />
);

  return (
    <div className="bg-card text-card-foreground px-4 lg:w-4/5 shadow-small rounded-large">
      <CardHeader>
        <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Emergency Contact</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mb-8">
          {/* Relationship Field */}
          {renderSelectField(
            "contactRelationShip",
            "Relationship",
            "Select Relationship",
            RELATIONSHIP_OPTIONS
          )}

          {/* Name Field */}
          {renderTextField(
            "name",
            "Full Name",
            "Contact's Full Name",
          )}

          {/* Country Field */}
          {renderSelectField(
            "country",
            "Country",
            "Select Country",
            COUNTRY_OPTIONS
          )}

          {/* District Field */}
          {renderSelectField(
            "district",
            "District",
            "Select District",
            DISTRICT_OPTIONS
          )}

          {/* City Field */}
          {renderTextField(
            "city",
            "City",
            "City",
          )}

          {/* Block Field */}
          {renderTextField(
            "block",
            "Block/Road/House",
            "Block/Road/House",
          )}

          {/* Post Office Field */}
          {renderSelectField(
            "postOffice",
            "Post Office",
            "Select Post Office",
            POST_OFFICE_OPTIONS
          )}

          {/* Postal Code Field */}
          {renderTextField(
            "postalCode",
            "Postal Code",
            "Postal Code",
          )}

          {/* Police Station Field */}
          {renderSelectField(
            "policeStation",
            "Police Station",
            "Select Police Station",
            POLICE_STATION_OPTIONS
          )}

          {/* Email Field */}
          {renderTextField(
            "email",
            "Email",
            "Email",
          )}

          {/* Country Code Field */}
          {renderSelectField(
            "countryCode",
            "Country Code",
            "Select Country Code",
            COUNTRY_CODE_OPTIONS
          )}

          {/* Mobile Number Field */}
          {renderTextField(
            "mobileNo",
            "Mobile Number",
            "Mobile Number",
          )}

          <Button 
            type="submit"
            onClick={() => setIsSubmitted(true)}
            variant="default"
            className="w-full md:w-auto"
          >
            Save and Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmergencyContact;
