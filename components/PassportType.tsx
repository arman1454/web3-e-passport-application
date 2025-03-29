"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";

import { useFormStore } from "@/app/store";
import { passportTypeFormSchema } from "@/app/UI_Schemas";
import { PassportType_Inf } from "@/app/store";

const PassportType = () => {
    const passportTypeForm = useFormStore((state) => state.formData.passportType) as PassportType_Inf;
    const updateFormData = useFormStore((state) => state.updateFormData);

    // ✅ Wait for Zustand hydration
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    const form = useForm<z.infer<typeof passportTypeFormSchema>>({
        resolver: zodResolver(passportTypeFormSchema),
        defaultValues: { type: passportTypeForm.type || undefined }, // ✅ Fix type mismatch
        mode: "onChange",
    });

    // ✅ Ensure Zustand and React Hook Form stay in sync
    useEffect(() => {
        form.reset({ type: passportTypeForm.type || undefined }); // ✅ Fix type mismatch
    }, [passportTypeForm, form]);

    function onSubmit(data: z.infer<typeof passportTypeFormSchema>) {
        console.log(data.type);
        updateFormData("passportType", { type: data.type });
    }

    if (!hydrated) {
        return <p>Loading...</p>; // ✅ Prevents flickering
    }

    return (
        <div className="flex flex-col gap-4 bg-card text-card-foreground rounded-lg lg:w-3/4 w-full">
            <div className="flex flex-col items-center lg:items-start gap-4 mt-4 mx-4">
                <Label className="text-foreground">Passport Type</Label>
                <Label className="text-center lg:text-start text-muted-foreground">Select the Passport Type for your applications!</Label>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mb-4 mx-4 flex flex-col lg:items-start items-center">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-4"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem 
                                                    value="ordinary" 
                                                    className="border-input text-primary"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal text-foreground">Ordinary Passport</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem 
                                                    value="official" 
                                                    className="border-input text-primary"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal text-foreground">Official Passport</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage className="text-destructive" />
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Save and Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default PassportType;
