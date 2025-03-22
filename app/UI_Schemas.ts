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
    profession: z.string({ message: "Please Select a profession" }),
    religion: z.string({ message: "Please Select Your Religion" }),
    countryCode: z.string({ message: "Please Select Your Country Code" }),
    mobileNo: z.string().length(13, { message: "Wrong Number format" }),
    birthCountry: z.string({ message: "Please Select Your Birth Country" }), 
    birthDistrict: z.string({ message: "Please Select Your Birth District" }), 
})

export const addressFormSchema = z
    .object({
        district: z.string({ message: "Please Select a district" }),
        city: z.string().min(2, { message: "Must be at least 2 characters." }),
        block: z.string().min(2, { message: "Must be at least 2 characters." }),
        postOffice: z.string({ message: "Please Select post Office" }),
        postalCode: z.string().min(2, { message: "Must be at least 2 characters." }),
        policeStation: z.string({ message: "Please Select a Police station" }),
        yes: z.boolean().default(false),
        no: z.boolean().default(false),
        // country: z.string({ message: "Please Select Country" }).optional(),
        // district2: z.string({ message: "Please Select a district" }).optional(),
        // city2: z.string().min(2, { message: "Must be at least 2 characters." }).optional(),
        // block2: z.string().min(2, { message: "Must be at least 2 characters." }).optional(),
        // postOffice2: z.string({ message: "Please Select post Office" }).optional(),
        // postalCode2: z.string().min(2, { message: "Must be at least 2 characters." }).optional(),
        // policeStation2: z.string({ message: "Please Select a Police station" }).optional(),
        // officeType: z.enum(["Regional Passport Office (RPO)", "Bangladesh Mission"], {
        //     required_error: "You need to select a passport type.",
        // }),
    }).refine((data) => data.yes || data.no, {
        message: "Please select either Yes or No.",
        path: ["yes"],
    })
// .refine(
//     (data) => {
//         if (data.no) {
//             // If "No" is selected, present address fields must be filled
//             return (
//                 data.country &&
//                 data.district2 &&
//                 data.city2 &&
//                 data.block2 &&
//                 data.postOffice2 &&
//                 data.postalCode2 &&
//                 data.policeStation2
//             );
//         }
//         return true; // If "No" is not selected, no validation needed
//     },
//     {
//         message: "Please fill out the present address fields.",
//         path: ["district2"], // This will show the error under one of the present address fields
//     }
// );