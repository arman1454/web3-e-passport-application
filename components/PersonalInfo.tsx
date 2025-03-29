import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
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

// Type for form values with nullable birthDate
type FormValues = z.infer<typeof personalInfoFormSchema>;

const PersonalInfo = () => {
    const personalInfoForm = useFormStore((state) => state.formData.personalInfo) as PersonalInfo_Inf;
    const updateFormData = useFormStore((state) => state.updateFormData);
    const [IsSubmitted, setIsSubmitted] = useState<Boolean>(false);
    const [hydrated, setHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // Reference to track the previous country code for comparison
    const prevCountryCodeRef = useRef<string | null>(null);
    // Flag to track if country code was changed by user action
    const isUserChange = useRef(false);
    
    // Use the values from the store with proper typing
    const form = useForm<FormValues>({
        resolver: zodResolver(personalInfoFormSchema),
        // Cast the store values to match the form schema
        defaultValues: {
            ...personalInfoForm,
            // Ensure birthDate is properly typed for the form
            birthDate: personalInfoForm.birthDate as FormValues['birthDate']
        },
        mode: 'onChange',
    });

    // Watch the `countryCode` field
    const selectedCountryCode = form.watch('countryCode');
    
    // Effect to update the mobile number field ONLY when country code is changed by user
    useEffect(() => {
        // Skip if there's no country code selected yet
        if (!selectedCountryCode) return;
        
        // Skip if this is the initial setting (from store/hydration)
        if (prevCountryCodeRef.current === null) {
            prevCountryCodeRef.current = selectedCountryCode;
            return;
        }
        
        // Only run when the country code changes AND it's a user-initiated change
        if (selectedCountryCode !== prevCountryCodeRef.current && isUserChange.current) {
            // Extract the country code (e.g., "+880" from "BANGLADESH +880")
            const code = selectedCountryCode.split(' ').pop() || '';
            // Update the mobile number to just the country code
            form.setValue('mobileNo', code);
        }
        
        // Update the ref with the current value for next comparison
        prevCountryCodeRef.current = selectedCountryCode;
    }, [selectedCountryCode, form]);

    // ✅ Ensure Zustand has loaded before rendering form
    useEffect(() => {
        setHydrated(true);
    }, []);

    // ✅ Sync Zustand data to React Hook Form after hydration
    useEffect(() => {
        if (hydrated) {
            // Make sure to properly handle the date if it's stored as a string
            const storedDate = personalInfoForm.birthDate;
            const birthDate = storedDate ? 
                (storedDate instanceof Date ? storedDate : new Date(storedDate)) : 
                null;
            
            form.reset({
                ...personalInfoForm,
                birthDate: birthDate as FormValues['birthDate']
            });
            
            // Reset the user change flag after form rehydration
            isUserChange.current = false;
        }
    }, [hydrated, personalInfoForm, form]);

    function onSubmit(values: FormValues) {
        console.log(values);
        updateFormData('personalInfo', values);
    }

    if (!hydrated) {
        return <p>Loading...</p>; // ✅ Prevent flickering
    }

    return (
        <div className="bg-card text-card-foreground px-4 lg:w-4/5">
            <CardHeader>
                <CardTitle className='text-lg text-card-foreground'>Personal Information</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    {/* Gender Field */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Gender</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || personalInfoForm.gender}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px] border-input">
                                            <SelectValue placeholder="Select a Gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-popover text-popover-foreground">
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-destructive" />
                            </FormItem>
                        )}
                    />

                    {/* Full Name Field */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        defaultValue={personalInfoForm.fullName}
                                        className="w-11/12 lg:w-2/3"
                                        placeholder="Full Name"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setIsSubmitted(false);
                                        }}
                                    />
                                </FormControl>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* First Name Field */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-11/12 lg:w-2/3"
                                        placeholder="First Name"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setIsSubmitted(false);
                                        }}
                                    />
                                </FormControl>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* Sur Name Field */}
                    <FormField
                        control={form.control}
                        name="surName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Sur Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-11/12 lg:w-2/3"
                                        placeholder="Sur Name"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setIsSubmitted(false);
                                        }}
                                    />
                                </FormControl>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* Profession Field */}
                    <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profession</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={personalInfoForm.profession}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a Profession" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Student">Student</SelectItem>
                                        <SelectItem value="Service Holder">Service Holder</SelectItem>
                                        <SelectItem value="Business Man">Business Man</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Religion Field */}
                    <FormField
                        control={form.control}
                        name="religion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Religion</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={personalInfoForm.religion}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Your Religion" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Islam">Islam</SelectItem>
                                        <SelectItem value="Hinduism">Hinduism</SelectItem>
                                        <SelectItem value="Christian">Christian</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Country Code Field */}
                    <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country Code</FormLabel>
                                <Select 
                                    onValueChange={(value) => {
                                        // Set the flag indicating this is a user-initiated change
                                        isUserChange.current = true;
                                        field.onChange(value);
                                    }} 
                                    defaultValue={personalInfoForm.countryCode}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Your Country Code" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BANGLADESH +880">BANGLADESH +880</SelectItem>
                                        <SelectItem value="CYPRUS +357">CYPRUS +357</SelectItem>
                                        <SelectItem value="HONGKONG +852">HONGKONG +852</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mobile Number Field */}
                    <FormField
                        control={form.control}
                        name="mobileNo"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-11/12 lg:w-2/3"
                                        placeholder=""
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setIsSubmitted(false);
                                        }}
                                    />
                                </FormControl>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* Country of Birth Field */}
                    <FormField
                        control={form.control}
                        name="birthCountry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country Of Birth</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={personalInfoForm.birthCountry}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Your Country of Birth" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BANGLADESH">BANGLADESH</SelectItem>
                                        <SelectItem value="CYPRUS">CYPRUS</SelectItem>
                                        <SelectItem value="HONGKONG">HONGKONG</SelectItem>
                                    </SelectContent>
                                </Select>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    {/* District of Birth Field */}
                    <FormField
                        control={form.control}
                        name="birthDistrict"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>District Of Birth</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={personalInfoForm.birthDistrict}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Your District of Birth" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                                        <SelectItem value="Chittagong">Chittagong</SelectItem>
                                        <SelectItem value="Khula">Khula</SelectItem>
                                    </SelectContent>
                                </Select>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />
                    
                    {/* Birth Date Field */}
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel>Birth Date</FormLabel>
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
                                            }}
                                            onDayClick={() => setIsOpen(false)}
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            defaultMonth={new Date(1990, 0)} // Default month view, not selection
                                            disabled={(date) =>
                                                date > new Date() // Cannot select future dates
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                {IsSubmitted && <FormMessage />}
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="citizenType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Citizenship Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || personalInfoForm.citizenType}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px] border-input">
                                            <SelectValue placeholder="Select Citizenship Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-popover text-popover-foreground">
                                        <SelectItem value="By Birth">By Birth</SelectItem>
                                        <SelectItem value="By Descent">By Descent</SelectItem>
                                        <SelectItem value="By Registration">By Registration</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-destructive" />
                            </FormItem>
                        )}
                    />

                    <Button 
                        type="submit" 
                        onClick={() => setIsSubmitted(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Save and Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default PersonalInfo;