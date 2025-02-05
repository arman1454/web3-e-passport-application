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
            surName: personalInfoForm.surName
        },
        mode:"onSubmit"
    })
    function onSubmit(values: z.infer<typeof personalInfoFormSchema>) {
        console.log(values)
        updateFormData("personalInfo", { gender: values.gender,fullName:values.fullName,firstName:values.firstName,surName:values.surName })
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input defaultValue={personalInfoForm.fullName} className='w-1/2' placeholder="Full Name" {...field} 
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
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input className='w-1/2' placeholder="First Name" {...field} 
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
                            <FormItem>
                                <FormLabel>Sur Name</FormLabel>
                                <FormControl>
                                    <Input className='w-1/2' placeholder="Sur Name" {...field} 
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
                    
                    <Button type="submit" onClick={()=>setIsSubmitted(true)}>Save and Continue</Button>
                </form>
            </Form>

        </div>
    )
}

export default PersonalInfo
