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


export const parentalInfoFormSchema = z
    .object({
        // Father Info
        fInfoStatus: z.boolean().default(false),
        fatherName: z.string().optional(),
        fatherProfession: z.string().optional(),
        fatherNationality: z.string().optional(),
        fatherNid: z.string().optional(),

        // Mother Info
        mInfoStatus: z.boolean().default(false),
        motherName: z.string().optional(),
        motherProfession: z.string().optional(),
        motherNationality: z.string().optional(),
        motherNid: z.string().optional(),

        // Legal Guardian Info
        lgiStatus: z.boolean().default(false),
        legalGname: z.string().optional(),
        legalGprofession: z.string().optional(),
        legalGnationality: z.string().optional(),
        mhaon: z.string().optional(),
            
    })
    .superRefine((data, ctx) => {
        // FATHER VALIDATION
        if (!data.fInfoStatus) {
            if (!data.fatherName || data.fatherName.length < 2) {
                ctx.addIssue({
                    path: ["fatherName"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 2,
                    type: "string",
                    inclusive: true,
                    message: "Father's name must be at least 2 characters.",
                });
            }

            if (!data.fatherProfession || data.fatherProfession.length < 1) {
                ctx.addIssue({
                    path: ["fatherProfession"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Please select a profession.",
                });
            }

            if (!data.fatherNationality || data.fatherNationality.length < 1) {
                ctx.addIssue({
                    path: ["fatherNationality"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Please select a nationality.",
                });
            }

            if (!data.fatherNid || !/^\d{10}$/.test(data.fatherNid)) {
                ctx.addIssue({
                    path: ["fatherNid"],
                    code: z.ZodIssueCode.custom,
                    message: "National ID must be exactly 10 digits and contain only numbers.",
                });
            }
        }

        // MOTHER VALIDATION
        if (!data.mInfoStatus) {
            if (!data.motherName || data.motherName.length < 2) {
                ctx.addIssue({
                    path: ["motherName"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 2,
                    type: "string",
                    inclusive: true,
                    message: "Mother's name must be at least 2 characters.",
                });
            }

            if (!data.motherProfession || data.motherProfession.length < 1) {
                ctx.addIssue({
                    path: ["motherProfession"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Please select a profession.",
                });
            }

            if (!data.motherNationality || data.motherNationality.length < 1) {
                ctx.addIssue({
                    path: ["motherNationality"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Please select a nationality.",
                });
            }

            if (!data.motherNid || !/^\d{10}$/.test(data.motherNid)) {
                ctx.addIssue({
                    path: ["motherNid"],
                    code: z.ZodIssueCode.custom,
                    message: "National ID must be exactly 10 digits and contain only numbers.",
                });
            }
        }

        // LEGAL GUARDIAN VALIDATION
        if (!data.lgiStatus) {
            if (!data.legalGname || data.legalGname.length < 2) {
                ctx.addIssue({
                    path: ["legalGname"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 2,
                    type: "string",
                    inclusive: true,
                    message: "Legal guardian's name must be at least 2 characters.",
                });
            }

            if (!data.legalGprofession || data.legalGprofession.length < 1) {
                ctx.addIssue({
                    path: ["legalGprofession"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Please select a profession.",
                });
            }

            if (!data.legalGnationality || data.legalGnationality.length < 1) {
                ctx.addIssue({
                    path: ["legalGnationality"],
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Please select a nationality.",
                });
            }
            if (!data.mhaon || !/^\d{10}$/.test(data.mhaon)) {
                ctx.addIssue({
                    path: ["mhaon"],
                    code: z.ZodIssueCode.custom,
                    message: "National ID must be exactly 10 digits and contain only numbers.",
                });
            }
        }
    });

   
export const spouseInfoFormSchema = z.object({
    maritalStatus: z.string({message:"Please Select Marital Status"}),
    spouseName: z.string().optional(),
    spouseProfession: z.string().optional(),
    spouseNationality: z.string().optional(),
    
}).superRefine((data, ctx) => {
    if (data.maritalStatus != "Single") {
        if (!data.spouseName || data.spouseName.length < 2) {
            ctx.addIssue({
                path: ["spouseName"],
                code: z.ZodIssueCode.too_small,
                minimum: 2,
                type: "string",
                inclusive: true,
                message: "Name must be at least 2 characters.",
            });
        }

        if (!data.spouseProfession || data.spouseProfession.length < 1) {
            ctx.addIssue({
                path: ["spouseProfession"],
                code: z.ZodIssueCode.too_small,
                minimum: 1,
                type: "string",
                inclusive: true,
                message: "Please select a profession.",
            });
        }

        if (!data.spouseNationality || data.spouseNationality.length < 1) {
            ctx.addIssue({
                path: ["spouseNationality"],
                code: z.ZodIssueCode.too_small,
                minimum: 1,
                type: "string",
                inclusive: true,
                message: "Please select a nationality.",
            });
        }
    }
})

export const emergencyContactFormSchema = z.object({
    contactRelationShip: z.string({ message: "Please select one" }),
    name: z.string().min(2, { message: "Must be at least 2 characters." }),
    country: z.string({ message: "Please select one" }),
    district: z.string({ message: "Please select one" }),
    city: z.string({ message: "Please select one" }),
    block: z.string().min(2,{ message: "Please select one" }),
    postOffice: z.string({ message: "Please select one" }),
    postalCode: z.string().min(2, { message: "Please select one" }),
    policeStation: z.string({ message: "Please select one" }),
    email: z.string().min(2, { message: "Please select one" }),
    countryCode: z.string({ message: "Please select one" }),
    mobileNo: z.string().min(2, { message: "Please select one" }),
})


export const passportOptionsFormSchema = z.object({
    validity: z.enum(["5 years", "10 years"], {
        required_error: "You need to select one.",
    }),
})
export const deliveryAndAppointmentFormSchema = z.object({
    deliveryType: z.enum(["Regular Delivery", "Express Delivery"], {
        required_error: "You need to select one.",
    }),
    dateTime: z.date({
        required_error: "Date & time is required!.",
    }),
})