import { useFormStore } from '@/app/store';
import { spouseInfoFormSchema } from '@/app/UI_Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { z } from 'zod';

type FormValues = z.infer<typeof spouseInfoFormSchema>;

interface SpouseInfoProps {
  goToNextForm: () => void;
}

const SpouseInfo = ({ goToNextForm }: SpouseInfoProps) => {
  const spouseInfoForm = useFormStore((state) => state.formData.spouseInfo) || {};
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [status,setStatus] = useState(spouseInfoForm.maritalStatus);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(spouseInfoFormSchema),
    defaultValues: {
      maritalStatus: spouseInfoForm.maritalStatus,
      spouseName: spouseInfoForm.spouseName,
      spouseProfession: spouseInfoForm.spouseProfession,
      spouseNationality: spouseInfoForm.spouseNationality
    },
    mode: "onChange",
  });
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const defaultValues = {
      maritalStatus: spouseInfoForm.maritalStatus,
      spouseName: spouseInfoForm.spouseName,
      spouseProfession: spouseInfoForm.spouseProfession,
      spouseNationality: spouseInfoForm.spouseNationality
    };

    const currentValues = form.getValues();

    const isDifferent = Object.keys(defaultValues).some(
      key => defaultValues[key as keyof typeof defaultValues] !== currentValues[key as keyof typeof defaultValues]
    );

    if (isDifferent) {
      form.reset(defaultValues);
    }
  }, [hydrated]);

  function onSubmit(values: FormValues) {
    console.log('🚀 ~ values before cleanup:', values);

    if (values.maritalStatus === "Single") {
      // Reset spouse-related fields when marital status is Single
      values.spouseName = "";
      values.spouseProfession = "";
      values.spouseNationality = "";
    }

    updateFormData('spouseInfo', values);
    goToNextForm();
  }


  if (!hydrated) {
    return <p>Loading...</p>;
  }
  return (
    <Card>
      <CardHeader className='mb-4'>
        <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Spouse Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Select Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] border-input">
                        <SelectValue placeholder="Select Marital Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widower">Widower</SelectItem>
                      <SelectItem value="Widow">Widow</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />

            {(form.watch("maritalStatus") !== "Single" && form.watch("maritalStatus") !== "") && <><FormField
              control={form.control}
              name="spouseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Spouse's name (as per NID/BRC)</FormLabel>
                  <FormControl>
                    <Input
                      
                      placeholder="Enter Spouse's Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSubmitted(false);
                      }}
                      className="w-full md:w-2/3"
                    // maxLength={10}
                    />
                  </FormControl>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spouseProfession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Select Profession</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] border-input">
                        <SelectValue placeholder="Select Profession" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="spouseNationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Select Nationality</FormLabel>
                  <Select  onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px] border-input">
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground">
                      <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSubmitted && <FormMessage className="text-destructive" />}
                </FormItem>
              )}
            /></>}

            <div className="pt-4">
              <Button type="submit"
                onClick={() => setIsSubmitted(true)}
                className="w-full md:w-auto">
                Save and Continue
              </Button>
            </div>
          </form>

        </Form>
      </CardContent>
    </Card>
  )
}

export default SpouseInfo
