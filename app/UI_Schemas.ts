import { z } from "zod";


export const passportTypeFormSchema = z.object({
    type: z.enum(["ordinary", "official"], {
        required_error: "You need to select a passport type.",
    }),
})

export const personalInfoFormSchema = z.object({
        gender: z.string({ message: "Please Select gender" }),
        fullName: z.string().min(2, {
            message: "Must be at least 2 characters."
        }),
        firstName: z.string().min(2, {
            message: "Must be at least 2 characters."
        }),
        surName: z.string().min(2, {
            message: "Must be at least 2 characters."
        }),
    })

export  const addressFormSchema = z.object({
        district: z.string({ message: "Please Select a district" }),
        city: z.string().min(2, {
            message: "Must be at least 2 characters."
        }),
        block: z.string().min(2, {
            message: "Must be at least 2 characters."
        }),
        postOffice: z.string({ message: "Please Select post Office" }),
        postalCode: z.string().min(2, {
            message: "Must be at least 2 characters."
        }),
        policeStation: z.string({ message: "Please Select a Police station" }),
        yes: z.boolean().default(false).optional(),
        no: z.boolean().default(false).optional(),
        country: z.string({ message: "Please Select Country" }),
    })