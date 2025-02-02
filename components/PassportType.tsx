"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {useFormStore} from "@/app/store"


const FormSchema = z.object({
    type: z.enum(["ordinary", "official"], {
        required_error: "You need to select a passport type.",
    }),
})

const PassportType = () => {

    const {formData, updateFormData} = useFormStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data.type);
        updateFormData("passportType",{type:data.type})
    } 

  return (
    <div className='flex flex-col gap-4'>
        <h2>Passport Type</h2>
        <h1>Select the Passport Type for your applications!</h1>
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                  <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                          <FormItem className="space-y-3">
                              <FormControl>
                                  <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={formData.passportType.type}
                                      className="flex flex-col space-y-1"
                                  >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                              <RadioGroupItem value="ordinary" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                              Ordinary Passport 
                                          </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                              <RadioGroupItem value="official" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                              Official Passport
                                          </FormLabel>
                                      </FormItem>
                                  </RadioGroup>
                              </FormControl>
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

export default PassportType
