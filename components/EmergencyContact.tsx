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

  return (
    <div className="bg-card text-card-foreground px-4 lg:w-4/5 shadow-small rounded-large">
      <CardHeader>
        <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Emergency Contact</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mb-8">
          {/* Relationship Field */}
          <FormField
            control={form.control}
            name="contactRelationShip"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Relationship</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-11/12 lg:w-2/3"
                    placeholder="Contact's Full Name"
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

          {/* Country Field */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* District Field */}
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">District</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                    <SelectItem value="Chittagong">Chittagong</SelectItem>
                    <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                    <SelectItem value="Khulna">Khulna</SelectItem>
                    <SelectItem value="Sylhet">Sylhet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* City Field */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">City</FormLabel>
                <FormControl>
                  <Input
                    className="w-11/12 lg:w-2/3"
                    placeholder="City"
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

          {/* Block Field */}
          <FormField
            control={form.control}
            name="block"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Block/Road/House</FormLabel>
                <FormControl>
                  <Input
                    className="w-11/12 lg:w-2/3"
                    placeholder="Block/Road/House"
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

          {/* Post Office Field */}
          <FormField
            control={form.control}
            name="postOffice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Post Office</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Post Office" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="GPO">GPO</SelectItem>
                    <SelectItem value="Banani">Banani</SelectItem>
                    <SelectItem value="Gulshan">Gulshan</SelectItem>
                    <SelectItem value="Mohakhali">Mohakhali</SelectItem>
                    <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Postal Code Field */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Postal Code</FormLabel>
                <FormControl>
                  <Input
                    className="w-11/12 lg:w-2/3"
                    placeholder="Postal Code"
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

          {/* Police Station Field */}
          <FormField
            control={form.control}
            name="policeStation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Police Station</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Police Station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="Gulshan">Gulshan</SelectItem>
                    <SelectItem value="Banani">Banani</SelectItem>
                    <SelectItem value="Mohammadpur">Mohammadpur</SelectItem>
                    <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                    <SelectItem value="Mirpur">Mirpur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-11/12 lg:w-2/3"
                    placeholder="Email"
                    type="email"
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

          {/* Country Code Field */}
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Country Code</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px] border-input">
                      <SelectValue placeholder="Select Country Code" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="BANGLADESH +880">BANGLADESH +880</SelectItem>
                    <SelectItem value="INDIA +91">INDIA +91</SelectItem>
                    <SelectItem value="PAKISTAN +92">PAKISTAN +92</SelectItem>
                    <SelectItem value="USA +1">USA +1</SelectItem>
                    <SelectItem value="UK +44">UK +44</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Mobile Number Field */}
          <FormField
            control={form.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    className="w-11/12 lg:w-2/3"
                    placeholder="Mobile Number"
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

          <Button 
            type="submit"
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
