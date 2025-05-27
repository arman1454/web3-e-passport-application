import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFormStore } from '@/app/store';
import { personalInfoFormSchema } from '@/app/UI_Schemas';
import { PersonalInfo_Inf } from '@/app/store';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { ScrollArea } from './ui/scroll-area';
import { CardHeader, CardTitle } from './ui/card';

// Add these lines at the beginning of the component
interface PersonalInfoProps {
    goToNextForm: () => void;
}

// Memoize select options to prevent unnecessary re-renders
const GENDER_OPTIONS = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
];

const PROFESSION_OPTIONS = [
    { value: "Student", label: "Student" },
    { value: "Service Holder", label: "Service Holder" },
    { value: "Business Man", label: "Business Man" }
];

const RELIGION_OPTIONS = [
    { value: "Islam", label: "Islam" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Christian", label: "Christian" }
];

const COUNTRY_CODE_OPTIONS = [
    { value: "+880", label: "BANGLADESH +880" },
    { value: "+357", label: "CYPRUS +357" },
    { value: "+852", label: "HONGKONG +852" }
];

const COUNTRY_OPTIONS = [
    { value: "BANGLADESH", label: "BANGLADESH" },
    { value: "CYPRUS", label: "CYPRUS" },
    { value: "HONGKONG", label: "HONGKONG" }
];

const DISTRICT_OPTIONS = [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Khula", label: "Khula" }
];

const CITIZEN_TYPE_OPTIONS = [
    { value: "By Birth", label: "By Birth" },
    { value: "By Descent", label: "By Descent" },
    { value: "By Registration", label: "By Registration" }
];

// Create a type guard to check if a field is not a date field
function isStringField(name: keyof PersonalInfo_Inf): boolean {
    return name !== "birthDate";
}

// Create a type that includes only string fields from PersonalInfo_Inf
// This mapped type filters out the birthDate field which is Date | null
// The result is a union type of all the keys that have string values
type StringFieldNames = {
    [K in keyof PersonalInfo_Inf]: PersonalInfo_Inf[K] extends Date | null ? never : K
}[keyof PersonalInfo_Inf];

const PersonalInfo = ({ goToNextForm }: PersonalInfoProps) => {
    const personalInfoForm = useFormStore((state) => state.formData.personalInfo) as PersonalInfo_Inf;
    const updateFormData = useFormStore((state) => state.updateFormData);
    const [isSubmitted, setIsSubmitted] = useState<Boolean>(false);
    const [hydrated, setHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // Reference to track the previous country code for comparison
    const prevCountryCodeRef = useRef<string | null>(null);
    
    // Use the values from the store with proper typing
    const form = useForm<PersonalInfo_Inf>({
        resolver: zodResolver(personalInfoFormSchema),
        // Initialize with empty values, will be populated after hydration
        defaultValues: {
            gender: "",
            fullName: "",
            firstName: "",
            surName: "",
            profession: "",
            religion: "",
            countryCode: "",
            mobileNo: "",
            birthCountry: "",
            birthDistrict: "",
            birthDate: null,
            citizenType: ""
        },
        mode: 'onChange',
    });

    // Watch the `countryCode` field using useWatch for better performance
    const selectedCountryCode = useWatch({
        control: form.control,
        name: 'countryCode',
    });
    
    // Memoize the extracted code to avoid recalculation
    const extractedCode = useMemo(() => {
        if (!selectedCountryCode) return '';
        return selectedCountryCode.split(' ').pop() || '';
    }, [selectedCountryCode]);
    
    // Effect to update the mobile number field when country code changes
    useEffect(() => {
        // Skip if there's no country code selected yet
        if (!selectedCountryCode) return;
        
        // Skip if the previous value is the same (no change)
        if (prevCountryCodeRef.current === selectedCountryCode) return;
        
        // Only update if mobile is empty or starts with a previous code
        const currentMobile = form.getValues('mobileNo') || '';
        const previousCode = prevCountryCodeRef.current?.split(' ').pop() || '';
        
        const shouldUpdate = 
            currentMobile === '' || 
            (prevCountryCodeRef.current && 
             typeof currentMobile === 'string' &&
             currentMobile.startsWith(previousCode));
        
        if (shouldUpdate) {
            // Update the mobile number to just the country code
            form.setValue('mobileNo', extractedCode);
        }
        
        // Update the ref with the current value for next comparison
        prevCountryCodeRef.current = selectedCountryCode;
    }, [selectedCountryCode, extractedCode, form]);

    // ✅ Ensure Zustand has loaded before rendering form
    useEffect(() => {
        setHydrated(true);
    }, []);

    // ✅ Sync Zustand data to React Hook Form after hydration
    useEffect(() => {
        if (hydrated) {
            const formValues: PersonalInfo_Inf = {
                ...personalInfoForm,
                // Ensure date is properly handled
                birthDate: personalInfoForm.birthDate ? 
                    (personalInfoForm.birthDate instanceof Date ? 
                        personalInfoForm.birthDate : 
                        new Date(personalInfoForm.birthDate)
                    ) : null
            };
            
            form.reset(formValues);
        }
    }, [hydrated, personalInfoForm, form]);

    // Memoize the submit handler to prevent recreation on each render
    const onSubmit = useCallback((values: PersonalInfo_Inf) => {
        // Convert birthDate to YYYY-MM-DD string in local time (not UTC)
        let birthDateStr = null;
        if (values.birthDate instanceof Date && !isNaN(values.birthDate.getTime())) {
            // Get local date parts
            const year = values.birthDate.getFullYear();
            const month = (values.birthDate.getMonth() + 1).toString().padStart(2, '0');
            const day = values.birthDate.getDate().toString().padStart(2, '0');
            birthDateStr = `${year}-${month}-${day}`;
        } else if (typeof values.birthDate === 'string') {
            birthDateStr = values.birthDate;
        }
        const formattedValues: PersonalInfo_Inf = {
            ...values,
            birthDate: birthDateStr as any // Fix TS error: birthDate is string|null, but type expects Date|null
        };
        updateFormData('personalInfo', formattedValues);
        goToNextForm();
    }, [updateFormData, goToNextForm]);

    // Early return for loading state
    if (!hydrated) {
        return <p>Loading...</p>; // ✅ Prevent flickering
    }

    // Create a reusable form field component for text inputs to reduce redundancy
    const renderTextField = (name: keyof PersonalInfo_Inf, label: string, placeholder: string) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel className='text-foreground text-sm md:text-md lg:text-lg'>{label}</FormLabel>
                    <FormControl>
                        <Input
                            className="w-11/12 lg:w-2/3"
                            placeholder={placeholder}
                            {...field}
                            value={typeof field.value === 'string' ? field.value : ''}
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
    );

    // Create a reusable select field component
    const renderSelectField = (
        name: StringFieldNames, // Use our type that excludes date fields
        label: string, 
        placeholder: string, 
        options: Array<{value: string, label: string}>,
        defaultValue?: string
    ) => {
        return (
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-normal text-foreground text-sm md:text-md lg:text-lg'>{label}</FormLabel>
                        <Select 
                            onValueChange={field.onChange} 
                            value={field.value || defaultValue || ''}
                        >
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    return (
        <div className="bg-card text-card-foreground px-4 lg:w-4/5 shadow-small rounded-large">
            <CardHeader>
                <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Personal Information</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    {/* Gender Field */}
                    {renderSelectField(
                        "gender", 
                        "Gender", 
                        "Select a Gender", 
                        GENDER_OPTIONS, 
                        personalInfoForm.gender
                    )}

                    {/* Text fields */}
                    {renderTextField("fullName", "Full Name", "Full Name")}
                    {renderTextField("firstName", "First Name", "First Name")}
                    {renderTextField("surName", "Sur Name", "Sur Name")}

                    {/* Profession Field */}
                    {renderSelectField(
                        "profession", 
                        "Profession", 
                        "Select a Profession", 
                        PROFESSION_OPTIONS, 
                        personalInfoForm.profession
                    )}

                    {/* Religion Field */}
                    {renderSelectField(
                        "religion", 
                        "Religion", 
                        "Select Your Religion", 
                        RELIGION_OPTIONS, 
                        personalInfoForm.religion
                    )}

                    {/* Country Code Field */}
                    {renderSelectField(
                        "countryCode", 
                        "Country Code", 
                        "Select Your Country Code", 
                        COUNTRY_CODE_OPTIONS, 
                        personalInfoForm.countryCode
                    )}

                    {/* Mobile Number Field */}
                    {renderTextField("mobileNo", "Mobile Number", "")}

                    {/* Country of Birth Field */}
                    {renderSelectField(
                        "birthCountry", 
                        "Country Of Birth", 
                        "Select Your Country of Birth", 
                        COUNTRY_OPTIONS, 
                        personalInfoForm.birthCountry
                    )}

                    {/* District of Birth Field */}
                    {renderSelectField(
                        "birthDistrict", 
                        "District Of Birth", 
                        "Select Your District of Birth", 
                        DISTRICT_OPTIONS, 
                        personalInfoForm.birthDistrict
                    )}
                    
                    {/* Birth Date Field */}
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className='font-normal text-foreground text-sm md:text-md lg:text-lg'>Birth Date</FormLabel>
                                <Popover open={isOpen} onOpenChange={setIsOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={field.value || undefined}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                setIsOpen(false); // Close popover on selection
                                            }}
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            defaultMonth={new Date(1990, 0)} // Default month view, not selection
                                            disabled={(date) =>
                                                date > new Date() // Cannot select future dates
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                {isSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />
                    
                    {/* Citizenship Type Field */}
                    {renderSelectField(
                        "citizenType", 
                        "Citizenship Type", 
                        "Select Citizenship Type", 
                        CITIZEN_TYPE_OPTIONS, 
                        personalInfoForm.citizenType
                    )}

                    <Button 
                        type="submit" 
                        onClick={() => setIsSubmitted(true)}
                        className="w-full md:w-auto"
                    >
                        Save and Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default PersonalInfo;