import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { undefined, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
const PersonalInfo = () => {
    const [IsSubmitted, setIsSubmitted] = useState<Boolean>(false);
    const formSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters."
        }),
        gender: z.string({ message: "Please Select gender" })
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
        mode:"onSubmit"
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} 
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
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Button type="submit" onClick={()=>setIsSubmitted(true)}>Submit</Button>
                </form>
            </Form>

        </div>
    )
}

export default PersonalInfo
