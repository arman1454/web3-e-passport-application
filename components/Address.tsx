import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm, useWatch } from "react-hook-form"
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
import { Skeleton } from './ui/skeleton'

// Type for form values with proper typing for officeType
type FormValues = Omit<z.infer<typeof addressFormSchema>, 'officeType'> & {
    officeType: "Regional Passport Office (RPO)" | "Bangladesh Mission";
};

// Add these lines at the top of the component definition
interface AddressProps {
    goToNextForm: () => void;
}

const DISTRICT_OPTIONS = [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Khulna", label: "Khulna" },
    { value: "Chittagong", label: "Chittagong" },
]

const POST_OFFICE_OPTIONS = [
    { value: "Office1", label: "Office 1" },
    { value: "Office2", label: "Office 2" },
    { value: "Office3", label: "Office 3" },
]

const POLICE_STATION_OPTIONS = [
    { value: "Station1", label: "Station 1" },
    { value: "Station2", label: "Station 2" },
    { value: "Station3", label: "Station 3" },
]
const COUNTRY_OPTIONS = [
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "India", label: "India" },
    { value: "Pakistan", label: "Pakistan" },
]

const Address = ({ goToNextForm }: AddressProps) => {
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
    const showPresentAddress = useWatch({
        control: form.control,
        name: 'no',
    });

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

    const onSubmit = useCallback(async (values: FormValues) => {
        try {
            if (values.yes) {
                const formattedValues = {
                    ...values,
                    country: "Bangladesh",
                    district2: values.district,
                    city2: values.city,
                    block2: values.block,
                    postOffice2: values.postOffice,
                    postalCode2: values.postalCode,
                    policeStation2: values.policeStation,
                };
                updateFormData('address', formattedValues);
            } else {
                updateFormData('address', values);
            }
            goToNextForm();
        } catch (error) {
            console.error("Form submission failed:", error);
            // Optionally, show an error message to the user
        }
    }, [updateFormData, goToNextForm]);


    

    const renderTextField = (name: keyof FormValues, label: string, placeholder: string) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel> {/* Updated to match the original className */}
                    <FormControl>
                        <Input
                            className="w-1/2 text-sm md:text-md lg:text-lg" // Added missing Tailwind classes
                            placeholder={placeholder}
                            {...field}
                            value={typeof field.value === 'string' ? field.value : ''}
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
    );

    const renderSelectField = (name: keyof FormValues, label: string, options: Array<{ value: string; label: string }>) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={typeof field.value === 'string' ? field.value : undefined}
                    >
                        <FormControl>
                            <SelectTrigger className="w-[180px] border-input">
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover text-popover-foreground">
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
            )}
        />
    );


    // Reusable function to handle checkbox toggling
    const handleCheckboxToggle = useCallback((field: any, currentValue: boolean, otherFieldName: keyof FormValues) => {
        if (!currentValue) {
            form.setValue(field.name, true);
            form.setValue(otherFieldName, false);
        }
    }, [form]);

    if (!hydrated) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
        );
    }

    const renderPresentAddressFields = () => (
        <>
            {renderSelectField("country", "Select Country", COUNTRY_OPTIONS)}
            {renderSelectField("district2", "Select District", DISTRICT_OPTIONS)}
            {renderTextField("city2", "City/Village/House", "Enter city/village/house")}
            {renderTextField("block2", "Road/Block/Sector", "Enter road/block/sector")}
            {renderSelectField("postOffice2", "Select Post Office", POST_OFFICE_OPTIONS)}
            {renderTextField("postalCode2", "Postal Code", "Enter postal code")}
            {renderSelectField("policeStation2", "Select Police Station", POLICE_STATION_OPTIONS)}
        </>
    );

    return (
        <div className='px-4 bg-card text-card-foreground flex flex-col gap-4 lg:w-4/5 shadow-small rounded-large'>
            <CardHeader className='pb-2'>
                <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Address</CardTitle>
            </CardHeader>
            <CardDescription className="text-center lg:text-start text-muted-foreground text-sm md:text-md lg:text-lg">Permanent Address</CardDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* District Field */}
                    {renderSelectField("district", "Select District", DISTRICT_OPTIONS)}

                    {/* City Field */}
                    {renderTextField("city", "City/Village/House", "Enter city/village/house")}

                    {/* Block Field */}
                    {renderTextField("block", "Road/Block/Sector", "Enter road/block/sector")}

                    {/* Post Office Field */}
                    {renderSelectField("postOffice", "Select Post Office", POST_OFFICE_OPTIONS)}

                    {/* Postal Code Field */}
                    {renderTextField("postalCode", "Postal Code", "Enter postal code")}

                    {/* Police Station Field */}
                    {renderSelectField("policeStation", "Select Police Station", POLICE_STATION_OPTIONS)}

                    <CardDescription className="text-center lg:text-start text-muted-foreground text-sm md:text-md lg:text-lg">Present Address</CardDescription>
                    <CardDescription className="text-muted-foreground">
                        Note: Present address is subjected to RPO/BM. The RPO will reject your application 
                        if it does not belong to their jurisdiction. Your payment for the passport may be 
                        void and is not reimbursed if the information is incorrect!
                    </CardDescription>
                    
                    <div className="space-y-1 leading-none">
                        <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">
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
                                        <FormLabel className="text-sm text-foreground">Yes</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={() => handleCheckboxToggle(field, field.value, "no")}
                                                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-destructive text-sm" />
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
                                        <FormLabel className="text-sm text-foreground">No</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={() => handleCheckboxToggle(field, field.value, "yes")}
                                                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-destructive text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Conditional Present Address Fields - Only show if "No" is checked */}
                    {showPresentAddress && renderPresentAddressFields()}

                    <CardDescription className="text-muted-foreground">Available Regional Passport Office and Bangladesh Mission</CardDescription>
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
                                            <FormLabel className="font-normal text-foreground">
                                                Regional Passport Office (RPO)
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Bangladesh Mission" disabled/>
                                            </FormControl>
                                            <FormLabel className="font-normal text-foreground">
                                                Bangladesh Mission
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                {isSubmitted && <FormMessage className="text-destructive" />}
                            </FormItem>
                        )}
                    />

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

export default Address;
