import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFormStore } from "@/app/store"
import { Checkbox } from "@/components/ui/checkbox"
import { addressFormSchema } from '@/app/UI_Schemas'
import { Address_Inf } from '@/app/store'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

// Type for form values with proper typing for officeType
type FormValues = Omit<z.infer<typeof addressFormSchema>, 'officeType'> & {
    officeType: "Regional Passport Office (RPO)" | "Bangladesh Mission";
};

const Address = () => {
    const addressForm = useFormStore((state) => state.formData.address) as Address_Inf;
    const updateFormData = useFormStore((state) => state.updateFormData);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    
    // Use the values from the store with proper typing
    const form = useForm<FormValues>({
        resolver: zodResolver(addressFormSchema) as any,
        defaultValues: {
            ...addressForm,
            officeType: addressForm.officeType as "Regional Passport Office (RPO)" | "Bangladesh Mission"
        },
        mode: "onChange"
    });

    // Watch values for the radio buttons to control conditional rendering
    const showPresentAddress = form.watch("no");

    // ✅ Ensure Zustand has loaded before rendering form
    useEffect(() => {
        setHydrated(true);
    }, []);

    // ✅ Sync Zustand data to React Hook Form after hydration
    useEffect(() => {
        if (hydrated) {
            form.reset({
                ...addressForm,
                officeType: addressForm.officeType as "Regional Passport Office (RPO)" | "Bangladesh Mission"
            });
        }
    }, [hydrated, addressForm, form]);

    function onSubmit(values: FormValues) {
        let updatedValues = { ...values };
        console.log(values);
        
        // If "Yes" is selected, copy permanent address values to present address
        if (values.yes) {
            updatedValues = {
                ...values,
                country: "Bangladesh", // Default to Bangladesh
                district2: values.district,
                city2: values.city,
                block2: values.block,
                postOffice2: values.postOffice,
                postalCode2: values.postalCode,
                policeStation2: values.policeStation
            };
        }
        
        updateFormData("address", updatedValues);
    }

    if (!hydrated) {
        return <p>Loading...</p>; // ✅ Prevent flickering
    }

    return (
        <div className='px-4 bg-card flex flex-col gap-4 lg:w-4/5'>
            <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Address</CardTitle>
            </CardHeader>
            <CardDescription>Permanent Address</CardDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* District Field */}
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select District</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.district}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a district"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                                        <SelectItem value="Khulna">Khulna</SelectItem>
                                        <SelectItem value="Chittagong">Chittagong</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* City Field */}
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City/Village/House</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='w-1/2'
                                        placeholder="Enter city/village/house" 
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
                            <FormItem>
                                <FormLabel>Road/Block/Sector</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='w-1/2'
                                        placeholder="Enter road/block/sector" 
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
                                <FormLabel>Select Post Office</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.postOffice}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a post office"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Office1">Office 1</SelectItem>
                                        <SelectItem value="Office2">Office 2</SelectItem>
                                        <SelectItem value="Office3">Office 3</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* Postal Code Field */}
                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='w-1/2'
                                        placeholder="Enter postal code" 
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
                                <FormLabel>Select Police Station</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.policeStation}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a police station"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Station1">Station 1</SelectItem>
                                        <SelectItem value="Station2">Station 2</SelectItem>
                                        <SelectItem value="Station3">Station 3</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    <CardDescription>Present Address</CardDescription>
                    <CardDescription>
                        Note: Present address is subjected to RPO/BM. The RPO will reject your application 
                        if it does not belong to their jurisdiction. Your payment for the passport may be 
                        void and is not reimbursed if the information is incorrect!
                    </CardDescription>
                    
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            Present address is the same as permanent?
                        </FormLabel>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                        {/* Yes Checkbox */}
                        <FormField
                            control={form.control}
                            name="yes"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <div className="flex items-center space-x-2">
                                        <FormLabel className="text-sm">Yes</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        form.setValue("yes", true);
                                                        form.setValue("no", false);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* No Checkbox */}
                        <FormField
                            control={form.control}
                            name="no"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <div className="flex items-center space-x-2">
                                        <FormLabel className="text-sm">No</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        form.setValue("no", true);
                                                        form.setValue("yes", false);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Conditional Present Address Fields - Only show if "No" is checked */}
                    {showPresentAddress && (
                        <>
                            {/* Country Field */}
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Country</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a country"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                                <SelectItem value="India">India</SelectItem>
                                                <SelectItem value="Pakistan">Pakistan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isSubmitted && <FormMessage />}
                                    </FormItem>
                                )}
                            />

                            {/* District2 Field */}
                            <FormField
                                control={form.control}
                                name="district2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select District</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a district"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                                <SelectItem value="Khulna">Khulna</SelectItem>
                                                <SelectItem value="Chittagong">Chittagong</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isSubmitted && <FormMessage />}
                                    </FormItem>
                                )}
                            />

                            {/* City2 Field */}
                            <FormField
                                control={form.control}
                                name="city2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City/Village/House</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='w-1/2'
                                                placeholder="Enter city/village/house" 
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

                            {/* Block2 Field */}
                            <FormField
                                control={form.control}
                                name="block2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Road/Block/Sector</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='w-1/2'
                                                placeholder="Enter road/block/sector" 
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

                            {/* Post Office2 Field */}
                            <FormField
                                control={form.control}
                                name="postOffice2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Post Office</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a post office"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Office1">Office 1</SelectItem>
                                                <SelectItem value="Office2">Office 2</SelectItem>
                                                <SelectItem value="Office3">Office 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isSubmitted && <FormMessage />}
                                    </FormItem>
                                )}
                            />

                            {/* Postal Code2 Field */}
                            <FormField
                                control={form.control}
                                name="postalCode2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='w-1/2'
                                                placeholder="Enter postal code" 
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

                            {/* Police Station2 Field */}
                            <FormField
                                control={form.control}
                                name="policeStation2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Police Station</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a police station"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Station1">Station 1</SelectItem>
                                                <SelectItem value="Station2">Station 2</SelectItem>
                                                <SelectItem value="Station3">Station 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isSubmitted && <FormMessage />}
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <CardDescription>Available Regional Passport Office and Bangladesh Mission</CardDescription>
                    <FormField
                        control={form.control}
                        name="officeType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Regional Passport Office (RPO)" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Regional Passport Office (RPO)
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Bangladesh Mission" disabled/>
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Bangladesh Mission
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                {isSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    <Button type="submit" onClick={() => setIsSubmitted(true)}>
                        Save and Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Address;
