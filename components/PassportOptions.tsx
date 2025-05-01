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
import { passportOptionsFormSchema } from "@/app/UI_Schemas";
import { PassportOptions_Inf } from "@/app/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Add prop interface
interface PassportOptionsProps {
  goToNextForm: () => void;
}

const PassportOptions = ({ goToNextForm }: PassportOptionsProps) => {
  const passportOptionsForm = useFormStore((state) => state.formData.passportOptions);
  const updateFormData = useFormStore((state) => state.updateFormData);

  // ✅ Wait for Zustand hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const form = useForm<z.infer<typeof passportOptionsFormSchema>>({
    resolver: zodResolver(passportOptionsFormSchema),
    defaultValues: { validity: undefined },
    mode: "onChange",
  });

  // ✅ Ensure Zustand and React Hook Form stay in sync
  useEffect(() => {
    if (hydrated && passportOptionsForm && passportOptionsForm.validity) {
      if (passportOptionsForm.validity === "5 years" || passportOptionsForm.validity === "10 years") {
        form.setValue("validity", passportOptionsForm.validity);
      }
    }
  }, [hydrated, form, passportOptionsForm]);

  function onSubmit(data: z.infer<typeof passportOptionsFormSchema>) {
    console.log(data.validity);
    // Update store with both validity and price only when form is submitted
    const price = data.validity === "5 years" ? "4028 BDT" : "8045 BDT";
    updateFormData("passportOptions", { 
      validity: data.validity,
      price: price
    });

    // After saving data, move to the next form
    goToNextForm();
  }

  // Helper function to get price based on selected validity
  const getPrice = (validity: string | undefined) => {
    if (validity === "5 years") return "4028 BDT";
    if (validity === "10 years") return "8045 BDT";
    return "0 BDT";
  };

  if (!hydrated) {
    return <p>Loading...</p>; // ✅ Prevents flickering
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row gap-36">
        <CardTitle className="text-foreground text-lg lg:text-xl font-bold">Passport Options</CardTitle>
        {/* <div className="flex flex-col gap-4">
        <Label>Passport Pages</Label>
        <Label className="text-end">48 pages</Label>
        </div> */}
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 pb-4 px-4 flex flex-col items-start">
          <FormField
            control={form.control}
            name="validity"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Validity</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      
                      <FormControl>
                        <RadioGroupItem value="5 years" />
                      </FormControl>
                      <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">5 Years Validity</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="10 years" />
                      </FormControl>
                      <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">10 Years Validity</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="px-2 flex md:items-center md:justify-center gap-4 md:gap-24 lg:gap-60 py-4 border rounded-md bg-muted/30">
            <p className="font-medium text-sm md:text-md lg:text-lg">Passport Price</p>
            <p className="font-bold text-sm md:text-md lg:text-lg">
              {getPrice(form.watch("validity"))}
            </p>
          </div>
          <Button
            type="submit"
            variant="default"
            className="w-full md:w-auto"
          >
            Save and Continue
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default PassportOptions;
