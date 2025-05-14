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
import { Skeleton } from './ui/skeleton';

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

  // Clear spouse fields locally when maritalStatus changes to any value
React.useEffect(() => {
  let prevStatus: string | undefined = form.getValues('maritalStatus');
  const subscription = form.watch((value, { name }) => {
    if (name === 'maritalStatus') {
      if (value.maritalStatus !== prevStatus) {
        form.setValue('spouseName', '');
        form.setValue('spouseProfession', '');
        form.setValue('spouseNationality', '');
        prevStatus = value.maritalStatus;
      }
    }
  });
  return () => subscription.unsubscribe();
}, [form]);

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

  // Select options constants
const MARITAL_STATUS_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widower", label: "Widower" },
  { value: "Widow", label: "Widow" },
];
const PROFESSION_OPTIONS = [
  { value: "Service", label: "Service" },
  { value: "Business", label: "Business" },
  { value: "Teacher", label: "Teacher" },
  { value: "Other", label: "Other" },
];
const NATIONALITY_OPTIONS = [
  { value: "Bangladeshi", label: "Bangladeshi" },
  { value: "Indian", label: "Indian" },
  { value: "American", label: "American" },
  { value: "Other", label: "Other" },
];

const renderTextField = (
  name: keyof FormValues,
  label: string,
  placeholder: string,
) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => {
      let safeValue = field.value;
      if (typeof safeValue === 'boolean' || typeof safeValue === 'undefined') {
        safeValue = '';
      }
      return (
        <FormItem className="w-full">
          <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
          <FormControl>
            <Input
              className="w-11/12 lg:w-2/3"
              placeholder={placeholder}
              {...field}
              value={safeValue}
              onChange={(e) => {
                field.onChange(e);
                setIsSubmitted(false);
              }}
            />
          </FormControl>
          {isSubmitted && <FormMessage className="text-destructive" />}
        </FormItem>
      );
    }}
  />
);

const renderSelectField = (
  name: keyof FormValues,
  label: string,
  placeholder: string,
  options: { value: string; label: string }[],
) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full md:w-2/3">
        <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger className="w-[180px] border-input">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-popover text-popover-foreground">
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isSubmitted && <FormMessage className="text-destructive" />}
      </FormItem>
    )}
  />
);

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  return (
    <Card>
      <CardHeader className='mb-4'>
        <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Spouse Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {renderSelectField("maritalStatus", "Select Marital Status", "Select Marital Status", MARITAL_STATUS_OPTIONS)}
            {(form.watch("maritalStatus") !== "Single" && form.watch("maritalStatus") !== "") && (
              <>
                {renderTextField("spouseName", "Spouse's name (as per NID/BRC)", "Enter Spouse's Name")}
                {renderSelectField("spouseProfession", "Select Profession", "Select Profession", PROFESSION_OPTIONS)}
                {renderSelectField("spouseNationality", "Select Nationality", "Select Nationality", NATIONALITY_OPTIONS)}
              </>
            )}

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
