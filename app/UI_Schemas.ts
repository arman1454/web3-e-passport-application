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
    mobileNo: z.string()
        .min(10, { message: "Mobile number must be at least 10 characters" })
        .max(15, { message: "Mobile number cannot exceed 15 characters" })
        .regex(/^\+\d+$/, { message: "Mobile number must start with '+' followed by digits" }),
    birthCountry: z.string({ message: "Please Select Your Birth Country" }), 
    birthDistrict: z.string({ message: "Please Select Your Birth District" }),
    birthDate: z.preprocess(
        // This preprocessor ensures date objects remain valid when coming from storage
        (val) => {
            // If it's already a Date object
            if (val instanceof Date) return val; 
            // If it's a string that looks like a date (from JSON parsing)
            if (typeof val === 'string') return new Date(val);
            // Otherwise, return as is (null, undefined)
            return val;
        },
        z.date({ 
            required_error: "Please select a birth date",
            invalid_type_error: "That's not a valid date!" 
        }).nullable().refine(value => value !== null, {
            message: "Please select your birth date"
        })
    ),
    citizenType: z.string({ message: "Please Select Your Citizenship Type" })
})

export const addressFormSchema = z
    .object({
        district: z.string({ message: "Please select a district" }),
        city: z.string().min(2, { message: "Must be at least 2 characters." }),
        block: z.string().min(2, { message: "Must be at least 2 characters." }),
        postOffice: z.string({ message: "Please select a post office" }),
        postalCode: z.string().min(2, { message: "Must be at least 2 characters." }),
        policeStation: z.string({ message: "Please select a police station" }),
        yes: z.boolean().default(false),
        no: z.boolean().default(false),
        country: z.string().optional(),
        district2: z.string().optional(),
        city2: z.string().optional(),
        block2: z.string().optional(),
        postOffice2: z.string().optional(),
        postalCode2: z.string().optional(),
        policeStation2: z.string().optional(),
        officeType: z.enum(["Regional Passport Office (RPO)", "Bangladesh Mission"], {
            required_error: "You need to select an office type.",
        }),
    })
    // Ensure either Yes or No is selected
    .refine((data) => data.yes || data.no, {
        message: "Please select either Yes or No.",
        path: ["yes"],
    })
    // Conditional validation for present address fields
    .superRefine((data, ctx) => {
        // If "No" is selected, validate present address fields
        if (data.no) {
            if (!data.country) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please select a country",
                    path: ["country"],
                });
            }
            if (!data.district2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please select a district",
                    path: ["district2"],
                });
            }
            if (!data.city2 || data.city2.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "City must be at least 2 characters",
                    path: ["city2"],
                });
            }
            if (!data.block2 || data.block2.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Block must be at least 2 characters",
                    path: ["block2"],
                });
            }
            if (!data.postOffice2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please select a post office",
                    path: ["postOffice2"],
                });
            }
            if (!data.postalCode2 || data.postalCode2.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Postal code must be at least 2 characters",
                    path: ["postalCode2"],
                });
            }
            if (!data.policeStation2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please select a police station",
                    path: ["policeStation2"],
                });
            }
        }
    });


export const idDocsFormSchema = z.object({
    prevPassport: z.enum(["MRP", "ePP", "nothing"], {
        required_error: "You need to select a passport type.",
    }),
    otherPassport: z.enum(["no", "yes"], {
        required_error: "You need to select if you have another passport.",
    }),
    nid: z.string()
        .length(10, { message: "National ID must be exactly 10 characters" })
        .regex(/^\d{10}$/, { message: "National ID must contain only numbers" })
})


export const parentalInfoFormSchema = z.object({
    fInfoStatus: z.boolean().default(false),
    fatherName: z.string().min(2, {
        message: "Father's name must be at least 2 characters.",
    }),
    fatherProfession: z.string().min(1, {
        message: "Please select a profession.",
    }),
    fatherNationality: z.string().min(1, {
        message: "Please select a nationality.",
    }),
    fatherNid: z.string()
        .length(10, { message: "National ID must be exactly 10 characters." })
        .regex(/^\d{10}$/, { message: "National ID must contain only numbers." }),
    mInfoStatus: z.boolean().default(false),
    motherName: z.string().min(2, {
        message: "Mother's name must be at least 2 characters.",
    }),
    motherProfession: z.string().min(1, {
        message: "Please select a profession.",
    }),
    motherNationality: z.string().min(1, {
        message: "Please select a nationality.",
    }),
    motherNid: z.string()
        .length(10, { message: "National ID must be exactly 10 characters." })
        .regex(/^\d{10}$/, { message: "National ID must contain only numbers." }),
    lgiStatus: z.boolean().default(false),
    legalGname: z.string().min(2, {
        message: "Legal guardian's name must be at least 2 characters.",
    }),
    legalGprofession: z.string().min(1, {
        message: "Please select a profession.",
    }),
    legalGnationality: z.string().min(1, {
        message: "Please select a nationality.",
    }),

    mhaon: z.string()
        .length(10, { message: "Must be exactly 10 digits." })
        .regex(/^\d{10}$/, { message: "Must contain only numbers." }),
    
    

})