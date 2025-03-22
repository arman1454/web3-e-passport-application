import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFormStore } from "@/app/store"
import { personalInfoFormSchema } from '@/app/UI_Schemas';
import { PersonalInfo_Inf } from '@/app/store';
const PersonalInfo = () => {
    const personalInfoForm= useFormStore((state)=>state.formData.personalInfo) as PersonalInfo_Inf
    const updateFormData = useFormStore((state) => state.updateFormData);
    const [IsSubmitted, setIsSubmitted] = useState<Boolean>(false);
 
    const form = useForm<z.infer<typeof personalInfoFormSchema>>({
        resolver: zodResolver(personalInfoFormSchema),
        defaultValues: {
            fullName: personalInfoForm.fullName,
            firstName:personalInfoForm.firstName,
            surName: personalInfoForm.surName,
            mobileNo:personalInfoForm.mobileNo
        },
        mode:"onSubmit"
    })
    function onSubmit(values: z.infer<typeof personalInfoFormSchema>) {
        console.log(values)
        updateFormData("personalInfo", { gender: values.gender,fullName:values.fullName,firstName:values.firstName,surName:values.surName,profession:values.profession,religion:values.religion,countryCode:values.countryCode,mobileNo:values.mobileNo,birthCountry:values.birthCountry,birthDistrict:values.birthDistrict })
    }
    return (
        <div className='bg-card px-4 lg:w-4/5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={personalInfoForm.gender}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a Gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormMessage />



                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input defaultValue={personalInfoForm.fullName} className='w-11/12 lg:w-2/3' placeholder="Full Name" {...field} 
                                    onChange={(e)=>{
                                        field.onChange(e);
                                        setIsSubmitted(false);
                                    }}
                                    />
                                </FormControl>
                                {IsSubmitted && (<FormMessage/>)}


                                
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input className='w-11/12 lg:w-2/3' placeholder="First Name" {...field} 
                                    onChange={(e)=>{
                                        field.onChange(e);
                                        setIsSubmitted(false);
                                    }}
                                    />
                                </FormControl>
                                {IsSubmitted && (<FormMessage/>)}


                                
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="surName"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Sur Name</FormLabel>
                                <FormControl>
                                    <Input className='w-11/12 lg:w-2/3' placeholder="Sur Name" {...field} 
                                    onChange={(e)=>{
                                        field.onChange(e);
                                        setIsSubmitted(false);
                                    }}
                                    />
                                </FormControl>
                                {IsSubmitted && (<FormMessage/>)}


                                
                            </FormItem>
                        )}
                    />

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
                    <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country Code</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={personalInfoForm.countryCode}>
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

                    <FormField
                        control={form.control}
                        name="mobileNo"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input className='w-11/12 lg:w-2/3' placeholder="" {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setIsSubmitted(false);
                                        }}
                                    />
                                </FormControl>
                                {IsSubmitted && (<FormMessage />)}



                            </FormItem>
                        )}
                    />

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

                                <FormMessage />



                            </FormItem>
                        )}
                    />
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

                                <FormMessage />



                            </FormItem>
                        )}
                    />

                    
                    
                    <Button type="submit" onClick={()=>setIsSubmitted(true)}>Save and Continue</Button>
                </form>
            </Form>

        </div>
    )
}

export default PersonalInfo
