import { useFormStore } from '@/app/store';
import { parentalInfoFormSchema } from '@/app/UI_Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { z } from 'zod';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';

// Select options constants
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

type FormValues = z.infer<typeof parentalInfoFormSchema>;

interface ParentalInfoProps {
    goToNextForm: () => void;
}

const ParentalInfo = ({ goToNextForm }: ParentalInfoProps) => {
  const parentalInfoForm = useFormStore((state) => state.formData.parentalInfo) || {};
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const hasResetForm = useRef(false);
  

  const form = useForm<FormValues>({
    resolver: zodResolver(parentalInfoFormSchema),
    defaultValues: {
      fInfoStatus:parentalInfoForm.fInfoStatus,
      fatherName: parentalInfoForm.fatherName,
      fatherProfession: parentalInfoForm.fatherProfession,
      fatherNationality:parentalInfoForm.fatherNationality,
      fatherNid:parentalInfoForm.fatherNid,
      mInfoStatus: parentalInfoForm.mInfoStatus,
      motherName: parentalInfoForm.motherName,
      motherProfession: parentalInfoForm.motherProfession,
      motherNationality:parentalInfoForm.motherNationality,
      motherNid:parentalInfoForm.motherNid,
      lgiStatus:parentalInfoForm.lgiStatus,
      legalGname: parentalInfoForm.legalGname,
      legalGprofession: parentalInfoForm.legalGprofession,
      legalGnationality: parentalInfoForm.legalGnationality,
      mhaon: parentalInfoForm.mhaon,
    },
    mode: "onChange",
  });

  const fUnknown = useWatch({ control: form.control, name: "fInfoStatus" });
  const mUnknown = useWatch({ control: form.control, name: "mInfoStatus" });
  const lUnknown = useWatch({ control: form.control, name: "lgiStatus" });


  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !hasResetForm.current) {
      form.reset({
        fInfoStatus: parentalInfoForm.fInfoStatus,
        fatherName: parentalInfoForm.fatherName,
        fatherProfession: parentalInfoForm.fatherProfession,
        fatherNationality: parentalInfoForm.fatherNationality,
        fatherNid: parentalInfoForm.fatherNid,
        mInfoStatus: parentalInfoForm.mInfoStatus,
        motherName: parentalInfoForm.motherName,
        motherProfession: parentalInfoForm.motherProfession,
        motherNationality: parentalInfoForm.motherNationality,
        motherNid: parentalInfoForm.motherNid,
        lgiStatus: parentalInfoForm.lgiStatus,
        legalGname: parentalInfoForm.legalGname,
        legalGprofession: parentalInfoForm.legalGprofession,
        legalGnationality: parentalInfoForm.legalGnationality,
        mhaon: parentalInfoForm.mhaon,
      });
      hasResetForm.current = true; // Mark as reset
    }
  }, [hydrated, parentalInfoForm, form]);
  
  const onSubmit = useCallback((values: FormValues) => {
    console.log('🚀 ~ values:', values);
    updateFormData('parentalInfo', values);
    goToNextForm();
  }, [updateFormData, goToNextForm]);

  const renderTextField = (name: keyof FormValues, label: string, placeholder: string, className?: string, disabled?: boolean) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Ensure value is always string | number | readonly string[] | undefined
        let safeValue = field.value;
        if (typeof safeValue === 'boolean' || typeof safeValue === 'undefined') {
          safeValue = '';
        }
        return (
          <FormItem className={className || "w-full"}>
            <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                className={className || "w-1/2"}
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
    disabled?: boolean
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">{label}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            value={typeof field.value === "string" ? field.value : undefined}
          >
            <FormControl>
              <SelectTrigger className="w-[180px] border-input">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-popover text-popover-foreground">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isSubmitted && <FormMessage className="text-destructive" />}
        </FormItem>
      )}
    />
  );

  // Checkbox group helper
  const CheckboxGroup = ({
    name,
    label,
    unknownLabel,
    onCheckedChange,
    checked
  }: {
    name: keyof FormValues;
    label: string;
    unknownLabel: string;
    onCheckedChange: (isChecked: boolean) => void;
    checked: boolean;
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-12 space-y-0 rounded-md border-none p-4 shadow">
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
          </div>
          <div className="flex gap-4">
            <FormControl>
              <Checkbox
                checked={typeof field.value === 'boolean' ? field.value : false}
                onCheckedChange={(e) => {
                  const isChecked = e === true;
                  field.onChange(isChecked);
                  onCheckedChange(isChecked);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{unknownLabel}</FormLabel>
            </div>
          </div>
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
      <CardHeader className='pb-2'>
        <CardTitle className='text-foreground text-lg lg:text-xl font-bold'>Parental Information</CardTitle>
      </CardHeader>
      <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Father */}
            <CheckboxGroup
              name="fInfoStatus"
              label="Father Information"
              unknownLabel="Unknown"
              checked={fUnknown}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  form.setValue("fatherName", "");
                  form.setValue("fatherProfession", "");
                  form.setValue("fatherNationality", "");
                  form.setValue("fatherNid", "");
                }
              }}
            />
            {renderTextField("fatherName", "Father Name", "Enter Father Name", "w-1/2", fUnknown)}
            {renderSelectField("fatherProfession", "Father Profession", "Select Profession", PROFESSION_OPTIONS, fUnknown)}
            {renderSelectField("fatherNationality", "Father Nationality", "Select Nationality", NATIONALITY_OPTIONS, fUnknown)}
            {renderTextField("fatherNid", "National ID No. (optional)", "Enter your 10-digit national ID", "w-full md:w-2/3", fUnknown)}
          
          {/* mother */}

            {/* Mother */}
            <CheckboxGroup
              name="mInfoStatus"
              label="Mother Information"
              unknownLabel="Unknown"
              checked={mUnknown}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  form.setValue("motherName", "");
                  form.setValue("motherProfession", "");
                  form.setValue("motherNationality", "");
                  form.setValue("motherNid", "");
                }
              }}
            />    

          {renderTextField("motherName", "Mother Name", "Enter Mother Name", "w-1/2", mUnknown)}
          {renderSelectField("motherProfession", "Mother Profession", "Select Profession", PROFESSION_OPTIONS, mUnknown)}
          {renderSelectField("motherNationality", "Mother Nationality", "Select Nationality", NATIONALITY_OPTIONS, mUnknown)}
          {renderTextField("motherNid", "National ID No. (optional)", "Enter your 10-digit national ID", "w-full md:w-2/3", mUnknown)}

            {/* Legal Guardian */}
            <CheckboxGroup
              name="lgiStatus"
              label="Legal Guardian Information"
              unknownLabel="Not Applicable"
              checked={lUnknown}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  form.setValue("legalGname", "");
                  form.setValue("legalGprofession", "");
                  form.setValue("legalGnationality", "");
                  form.setValue("mhaon", "");
                }
              }}
            />

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mb-6">
              <Label className="text-yellow-800 dark:text-yellow-200 font-medium">
                Note: Only applicable if you have a Legal Guardian Certificate from Ministry of Home Affairs as per Government Rule.
              </Label>
            </div>

            {/* legal */}

            {renderTextField("legalGname", "Legal Guardian's name (as per NID/BRC)", "Legal Guardian Name", "w-11/12 lg:w-2/3", lUnknown)}
            {renderSelectField("legalGprofession", "Select Profession", "Select Profession", PROFESSION_OPTIONS, lUnknown)}
            {renderSelectField("legalGnationality", "Select Nationality", "Select Nationality", NATIONALITY_OPTIONS, lUnknown)}
            {renderTextField("mhaon", "Ministry of Home Affairs Order Number", "", "w-full md:w-2/3", lUnknown)}
 
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

export default ParentalInfo
