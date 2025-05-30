"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Label } from './ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { idDocsFormSchema } from '@/app/UI_Schemas';
import { useFormStore } from '@/app/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { Image } from '@heroui/react';
import { Skeleton } from '@/components/ui/skeleton';

type FormValues = z.infer<typeof idDocsFormSchema>;

interface ID_DocumentsProps {
  goToNextForm: () => void;
}

const ID_Documents = ({ goToNextForm }: ID_DocumentsProps) => {
  const idDocuments = useFormStore((state) => state.formData.idDocuments) || {};
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Initialize the form with stored values
  const form = useForm<FormValues>({
    resolver: zodResolver(idDocsFormSchema),
    defaultValues: {
      prevPassport: (idDocuments?.prevPassport as "MRP" | "ePP" | "nothing") || undefined,
      otherPassport: idDocuments?.otherPassport === true ? "yes" : (idDocuments?.otherPassport === false ? "no" : undefined),
      nid: idDocuments?.nid || "",
    },
    mode: "onChange",
  });

  // Handle hydration once
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Only reset form values once on initial hydration
  useEffect(() => {
    if (hydrated && idDocuments) {
      // Using a ref to track if we've already reset the form
      const initialValues = {
        prevPassport: (idDocuments?.prevPassport as "MRP" | "ePP" | "nothing") || undefined,
        otherPassport: idDocuments?.otherPassport === true ? "yes" : (idDocuments?.otherPassport === false ? "no" : undefined) as "yes" | "no" | undefined,
        nid: idDocuments?.nid || "",
      };
      
      form.reset(initialValues);
    }
  }, [hydrated]); // Only depend on hydrated state, not on form or idDocuments

  const onSubmit = useCallback((values: FormValues) => {
    console.log('ID Documents Form Data:', values);
    
    // Convert the string values to the appropriate types for storage
    const formattedValues = {
        ...values,
        otherPassport: values.otherPassport === "yes" // Convert to boolean
    };
    
    updateFormData('idDocuments', formattedValues);
    goToNextForm();
  }, [updateFormData, goToNextForm]);

  if (!hydrated) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
        </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-foreground text-lg lg:text-xl font-bold">ID Documents</CardTitle>
        <CardDescription className="text-center lg:text-start text-muted-foreground text-sm md:text-md lg:text-lg">
          Please provide information about your identification documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mb-6">
          <Label className="text-yellow-800 dark:text-yellow-200 font-medium">
            Note: If you hide your previous passport (MRP/ePP), the ePP central system will reject your application. 
            Your payment for the application will be lost and non-refundable.
          </Label>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="prevPassport"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Do you have any previous passport?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col lg:flex-row gap-4"
                    >
                      <Card className='flex-1 transition-transform duration-200 hover:scale-95'>
                        <label>
                          <CardContent>
                            <Image
                              alt="Card background"
                              className="object-cover rounded-xl"
                              src="./passportImgs/MRP.jpg"
                              width={270}
                              height={156}
                            />
                          </CardContent>
                          <CardFooter>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="MRP" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes, I have a Machine Readable Passport (MRP)</FormLabel>
                            </FormItem>
                          </CardFooter>
                        </label>
                      </Card>
                      <Card className='flex-1 transition-transform duration-200 hover:scale-95'>
                        <label>
                          <CardContent>
                            <Image
                              alt="Card background"
                              className="object-cover rounded-xl"
                              src="./passportImgs/ePP.jpg"
                              width={270}
                              height={158}
                            />
                          </CardContent>
                          <CardFooter>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ePP" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes, I have an Electronic Passport (ePP)</FormLabel>
                            </FormItem>
                          </CardFooter>
                        </label>
                      </Card>
                      <Card className='flex-1 transition-transform duration-200 hover:scale-95'>
                        <label>
                          <CardContent>
                            <Image
                              alt="Card background"
                              className="object-cover rounded-xl"
                              src="./passportImgs/No.jpg"
                              width={270}
                              height={158}
                            />
                          </CardContent>
                          <CardFooter>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="nothing" />
                              </FormControl>
                              <FormLabel className="font-normal">No, I don't have any previous passport / handwritten passport</FormLabel>
                            </FormItem>
                          </CardFooter>
                        </label>
                      </Card>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherPassport"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Do you have another passport from a different country?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No, I don't have</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes, I have another passport</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">National ID Number</FormLabel>
                  <FormControl>
                    <Input
                      className="w-11/12 lg:w-2/3" 
                      placeholder="Enter your 10-digit national ID" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSubmitted(false);
                      }} 
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
  );
};

export default ID_Documents;
