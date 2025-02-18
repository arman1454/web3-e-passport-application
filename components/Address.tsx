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
import { shallow } from "zustand/shallow";
import { addressFormSchema } from '@/app/UI_Schemas'
import { Address_Inf } from '@/app/store'
const Address = () => {
    const addressForm = useFormStore((state) => state.formData.address) as Address_Inf
    const updateFormData = useFormStore((state) => state.updateFormData);
    const [IsSubmitted, setIsSubmitted] = useState<Boolean>(false);
    const form = useForm<z.infer<typeof addressFormSchema>>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            city: addressForm.city,
            block: addressForm.block,
            postalCode: addressForm.postalCode,
            yes:addressForm.yes,
            no:addressForm.no,
        },
        mode: "onSubmit"
    })
    function onSubmit(values: z.infer<typeof addressFormSchema>) {
        console.log(values)
        updateFormData("address", { district: values.district, city: values.city, block: values.block, postOffice: values.postOffice, postalCode: values.postalCode, policeStation: values.policeStation, yes:values.yes,no:values.no })
    }
    return (
        <div className='flex flex-col gap-4'>
            <CardHeader>
                <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardDescription>Permanent Address</CardDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select District</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.district}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Male">Dhaka</SelectItem>
                                        <SelectItem value="Female">Khulna</SelectItem>
                                        <SelectItem value="Other">Chittagong</SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormMessage />



                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City/Village/House</FormLabel>
                                <FormControl>
                                    <Input defaultValue={addressForm.city} className='w-1/2' {...field}
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
                        name="block"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Road/Block/Sector(optional)</FormLabel>
                                <FormControl>
                                    <Input defaultValue={addressForm.block} className='w-1/2' {...field}
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
                        name="postOffice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Post Office</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.postOffice}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Male">Office 1</SelectItem>
                                        <SelectItem value="Female">Office 2</SelectItem>
                                        <SelectItem value="Other">Office 3</SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormMessage />



                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal code</FormLabel>
                                <FormControl>
                                    <Input defaultValue={addressForm.postalCode} className='w-1/2' {...field}
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
                        name="policeStation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Police Station</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.policeStation}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Male">Station 1</SelectItem>
                                        <SelectItem value="Female">Station 2</SelectItem>
                                        <SelectItem value="Other">Station 3</SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormMessage />



                            </FormItem>
                        )}
                    />

                    <CardDescription>Present Address</CardDescription>
                    <CardDescription>Note: Present address is subjected to RPO/BM. The RPO will reject your application if it does not belong to their jurisdiction. Your payment for the passport may be void and is not reimbursed if the information is incorrect!</CardDescription>


                    <FormField
                        control={form.control}
                        name="yes"
                        render={({ field}) => (
                            <FormItem className="flex flex-col items-start space-y-4 rounded-md border p-4 shadow">
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Present address is the same as permanent?
                                    </FormLabel>
                                </div>
                                <div className='flex space-x-10'>
                                
                                    <FormLabel>
                                        Yes
                                    </FormLabel>
                                <FormControl>
                                    <Checkbox
                                            checked={form.watch("yes")}
                                        onCheckedChange={(checked)=>{
                                            field.onChange(checked);
                                            form.setValue("no",!checked);
                                        }}
                                    />
                                    
                                </FormControl>         
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="no"
                        render={({field}) => (
                            <FormItem className="flex flex-col items-start space-y-4 rounded-md border p-4 shadow">
                                <div className='flex space-x-10'>
                                
                                    <FormLabel>
                                        No
                                    </FormLabel>
                                <FormControl>
                                    <Checkbox
                                            checked={form.watch("no")}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                form.setValue("yes", !checked);
                                            }}
                                    />
                                    
                                </FormControl>         
                                </div>
                            </FormItem>
                        )}
                    />

                    
                        

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={addressForm.country}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                        <SelectItem value="India">India</SelectItem>
                                        <SelectItem value="Pakistan">Pakistan</SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormMessage />



                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default Address
