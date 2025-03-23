import { create } from 'zustand'
import { persist } from "zustand/middleware";

export interface Address_Inf{
    district: string;
    city: string;
    block: string;
    postOffice: string;
    postalCode: string;
    policeStation: string;
    yes: boolean;
    no: boolean;
    country: string;
    district2: string;
    city2: string;
    block2: string;
    postOffice2: string;
    postalCode2: string;
    policeStation2: string;
    officeType:string
}

export interface PersonalInfo_Inf {
    gender: string;
    fullName: string;
    firstName: string;
    surName: string;
    profession:string
    religion:string
    countryCode:string
    mobileNo:string
    birthCountry:string
    birthDistrict:string
}

export interface PassportType_Inf {
    type: "ordinary" | "official" | ""; // ✅ Only allows the correct values
}


interface FormState {
    formData: {
        passportType: PassportType_Inf;
        personalInfo: PersonalInfo_Inf;
        address: Address_Inf;
    };
    updateFormData: <K extends keyof FormState["formData"]>(
        section: K,
        newData: Partial<FormState["formData"][K]>
    ) => void;
    resetForm: () => void;
}

export const useFormStore = create<FormState>()(
    persist(
        (set)=>({
            formData:{
                passportType: { type: "" as "ordinary" | "official" | "" },
                personalInfo:{gender:"",fullName:"",firstName:"",surName:"",profession:"",religion:"",countryCode:"",mobileNo:"",birthCountry:"",birthDistrict:""},
                address:{district:"",city:"",block:"",postOffice:"",postalCode:"",policeStation:"",
                    yes: false, no: false, country: "", district2: "", city2: "", block2: "", postOffice2: "", postalCode2: "", policeStation2: "", officeType:"Regional Passport Office (RPO)"
},
                
            },

            updateFormData:(section,newData)=> set((state)=>(
                {
                    formData: {...state.formData, [section]: {...state.formData[section],...newData}},
                }
            )),

            resetForm: () => set({
                formData: {
                    passportType: { type: "" },
                    personalInfo: { gender: "", fullName: "", firstName: "", surName: "", profession:"", religion:"", countryCode:"",mobileNo:"",birthCountry:"",birthDistrict:""},
                    address: {
                        district: "", city: "", block: "", postOffice: "", postalCode: "",
                        policeStation: "", yes: false, no: false, country: "",
                        district2: "", city2: "", block2: "", postOffice2: "", postalCode2: "", policeStation2: "", officeType:"Regional Passport Office (RPO)"
                    },
                    
}}),
        }),
        {name:"form-storage"}
    )
)



