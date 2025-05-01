"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";

import { useFormStore } from "@/app/store";
import { deliveryAndAppointmentFormSchema } from "@/app/UI_Schemas";
import { DeliveryAndAppointment_Inf } from "@/app/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
import { format, getHours, getMinutes, setHours, setMinutes } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

// Type for form values with nullable dateTime
type FormValues = z.infer<typeof deliveryAndAppointmentFormSchema>;

// Add prop interface
interface DeliveryAndAppointmentProps {
  goToNextForm: () => void;
}

const DeliveryAndAppointment = ({ goToNextForm }: DeliveryAndAppointmentProps) => {
  const deliveryAndAppointmentForm = useFormStore((state) => state.formData.deliveryAndAppointment) as DeliveryAndAppointment_Inf;
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("09:00");
  
  // ✅ Wait for Zustand hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(deliveryAndAppointmentFormSchema),
    defaultValues: {
      deliveryType: undefined,
      dateTime: undefined
    },
    mode: "onChange",
  });

  // ✅ Sync Zustand data to React Hook Form after hydration
  useEffect(() => {
    if (hydrated) {
      // Make sure to properly handle the date
      const storedDate = deliveryAndAppointmentForm.dateTime;
      let appointmentDate = undefined;
      
      if (storedDate) {
        // Convert to Date object if it's a string
        appointmentDate = storedDate instanceof Date ? storedDate : new Date(storedDate);
        
        // Update the selected time based on the date
        const hours = appointmentDate.getHours().toString().padStart(2, '0');
        const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
      }
      
      form.reset({
        deliveryType: deliveryAndAppointmentForm.deliveryType as any,
        dateTime: appointmentDate
      });
    }
  }, [hydrated, deliveryAndAppointmentForm, form]);

  // Watch the dateTime field for external updates
  const selectedDate = form.watch("dateTime");

  // Apply time to date whenever time or date changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      
      // Only update if hours/minutes are different to avoid infinite loop
      if (getHours(selectedDate) !== hours || getMinutes(selectedDate) !== minutes) {
        form.setValue('dateTime', newDate);
      }
    }
  }, [selectedTime, form, selectedDate]);

  // Helper function to get price based on selected delivery type
  const getPrice = (deliveryType: string | undefined) => {
    if (deliveryType === "Regular Delivery") return "5750 BDT";
    if (deliveryType === "Express Delivery") return "8050 BDT";
    return "0 BDT";
  };

  // Generate office hours (9 AM to 5 PM) in 30-minute increments
  const getOfficeHours = () => {
    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minStr = min.toString().padStart(2, '0');
        timeSlots.push(`${hourStr}:${minStr}`);
      }
    }
    return timeSlots;
  };

  function onSubmit(values: FormValues) {
    console.log(values);
    setIsSubmitted(true);
    
    // Update store with both validity and price
    const price = values.deliveryType === "Regular Delivery" ? "150 BDT" : "300 BDT";
    updateFormData("deliveryAndAppointment", {
      deliveryType: values.deliveryType,
      price: price,
      dateTime: values.dateTime
    });

    // After saving data, move to the next form
    goToNextForm();
  }

  if (!hydrated) {
    return <p>Loading...</p>; // ✅ Prevents flickering
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row gap-36">
        <CardTitle className="text-foreground text-lg lg:text-xl font-bold">Delivery Options & Appointment</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 pb-4 px-4 flex flex-col items-start">
          <FormField
            control={form.control}
            name="deliveryType" 
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="text-foreground text-sm md:text-md lg:text-lg">Delivery Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Regular Delivery" />
                      </FormControl>
                      <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">Regular Delivery</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Express Delivery" />
                      </FormControl>
                      <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">Express Delivery</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="px-2 flex md:items-center md:justify-center gap-4 md:gap-24 lg:gap-60 py-4 border rounded-md bg-muted/30">
            <p className="font-medium text-sm md:text-md lg:text-lg">Delivery Fee</p>
            <p className="font-bold text-sm md:text-md lg:text-lg">
              {getPrice(form.watch("deliveryType"))}
            </p>
          </div>

          <div className="flex w-full flex-col md:flex-row gap-4 md:gap-8">
            {/* Date Selection Field - Using exact same pattern as PersonalInfo */}
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">Appointment Date</FormLabel>
                  <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
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
                          if (date) {
                            // Preserve time if there was a previously selected date
                            if (field.value) {
                              const newDate = new Date(date);
                              newDate.setHours(
                                field.value.getHours(),
                                field.value.getMinutes()
                              );
                              field.onChange(newDate);
                            } else {
                              // Set default time (9:00 AM) if no previous date
                              const newDate = new Date(date);
                              const [hours, minutes] = selectedTime.split(':').map(Number);
                              newDate.setHours(hours, minutes);
                              field.onChange(newDate);
                            }
                          }
                        }}
                        onDayClick={() => setIsDateOpen(false)}
                        fromYear={2024}
                        toYear={2025}
                        disabled={(date) => {
                          const day = date.getDay();
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
                        }}
                        defaultMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {isSubmitted && <FormMessage />}
                </FormItem>
              )}
            />

            {/* Time Selection Field */}
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-normal text-foreground text-sm md:text-md lg:text-lg">Appointment Time</FormLabel>
                  <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
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
                            format(field.value, "hh:mm a")
                          ) : (
                            <span>Select time</span>
                          )}
                          <Clock className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ScrollArea className="h-[200px] p-4">
                        <div className="grid gap-2">
                          {getOfficeHours().map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className="w-full justify-start font-normal"
                              onClick={() => {
                                setSelectedTime(time);
                                
                                // Update date with new time
                                if (field.value) {
                                  const [hours, minutes] = time.split(':').map(Number);
                                  const newDate = new Date(field.value);
                                  newDate.setHours(hours, minutes);
                                  field.onChange(newDate);
                                } else {
                                  // Create new date with today + selected time if no date selected
                                  const newDate = new Date();
                                  const [hours, minutes] = time.split(':').map(Number);
                                  newDate.setHours(hours, minutes, 0, 0);
                                  field.onChange(newDate);
                                }
                                
                                setIsTimeOpen(false);
                              }}
                            >
                              {/* Convert 24h time to 12h format for display */}
                              {format(new Date().setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])), "hh:mm a")}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  {isSubmitted && <FormMessage />}
                </FormItem>
              )}
            />
          </div>
          
          <Button
            type="submit"
            variant="default"
            className="w-full md:w-auto"
            onClick={() => setIsSubmitted(true)}
          >
            Save and Continue
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default DeliveryAndAppointment;
