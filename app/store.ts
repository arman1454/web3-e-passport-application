import { create } from 'zustand'
import { persist } from "zustand/middleware";

export interface PassportType_Inf {
    type: "ordinary" | "official" | ""; // ✅ Only allows the correct values
}

export interface PersonalInfo_Inf {
    gender: string;
    fullName: string;
    firstName: string;
    surName: string;
    profession: string
    religion: string
    countryCode: string
    mobileNo: string
    birthCountry: string
    birthDistrict: string
    birthDate: Date | null
    citizenType: string
}

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

export interface ID_Documents{
    prevPassport:string;
    otherPassport:boolean|null;
    nid:string;
}

export interface ParentalInfo_Inf{
    fInfoStatus:boolean;
    fatherName:string;
    fatherProfession:string;
    fatherNationality:string;
    fatherNid:string;
    mInfoStatus:boolean;
    motherName:string;
    motherProfession:string;
    motherNationality:string;
    motherNid:string;
    lgiStatus:boolean;
    legalGname:string;
    legalGprofession:string;
    legalGnationality:string;
    mhaon:string;
}

export interface SpouseInfo_Inf{
    maritalStatus: string;
    spouseName: string;
    spouseProfession:string;
    spouseNationality:string;
}

export interface EmergencyContact_Inf{
    contactRelationShip:string;
    name:string;
    country:string;
    district:string;
    city:string;
    block:string;
    postOffice:string;
    postalCode:string;
    policeStation:string;
    email:string;
    countryCode:string;
    mobileNo:string;
}

export interface PassportOptions_Inf {
    validity: string;
    price:string; 
}

export interface DeliveryAndAppointment_Inf {
    deliveryType: string;
    price: string;
    dateTime: Date | null;
}

// New interface to track form status
export interface FormStatus {
    "Passport Type": boolean;
    "Personal Information": boolean;
    "Address": boolean;
    "ID Documents": boolean;
    "Spouse Information": boolean;
    "Parental Information": boolean;
    "Emergency Contact": boolean;
    "Passport Options": boolean;
    "Delivery Options and Appointment": boolean;
    "Overview": boolean;
}

interface FormState {
    formData: {
        passportType: PassportType_Inf;
        personalInfo: PersonalInfo_Inf;
        address: Address_Inf;
        idDocuments:ID_Documents;
        parentalInfo:ParentalInfo_Inf;
        spouseInfo:SpouseInfo_Inf;
        emergencyContact: EmergencyContact_Inf;
        passportOptions:PassportOptions_Inf;
        deliveryAndAppointment: DeliveryAndAppointment_Inf;
    };
    formStatus: FormStatus;
    currentFormIndex: number; // Add this to track the current form index
    updateFormData: <K extends keyof FormState["formData"]>(
        section: K,
        newData: Partial<FormState["formData"][K]>
    ) => void;
    updateFormStatus: (formName: keyof FormStatus, isEnabled: boolean) => void;
    resetForm: () => void;
    setCurrentFormIndex: (index: number) => void; // Add setter for the index
}

export const useFormStore = create<FormState>()(
    persist(
        (set)=>({
            formData:{
                passportType: { type: "" as "ordinary" | "official" | "" },
                personalInfo:{gender:"",fullName:"",firstName:"",surName:"",profession:"",religion:"",countryCode:"",mobileNo:"",birthCountry:"",birthDistrict:"", birthDate: null,citizenType:""},
                address:{district:"",city:"",block:"",postOffice:"",postalCode:"",policeStation:"",
                    yes: false, no: false, country: "", district2: "", city2: "", block2: "", postOffice2: "", postalCode2: "", policeStation2: "", officeType:"Regional Passport Office (RPO)"
                },
                idDocuments:{prevPassport:"",otherPassport:null,nid:""},
                parentalInfo: {
                    fInfoStatus: false,
                    fatherName: "",
                    fatherProfession: "",
                    fatherNationality: "",
                    fatherNid: "",
                    mInfoStatus: false,
                    motherName: "",
                    motherProfession: "",
                    motherNationality: "",
                    motherNid: "",
                    lgiStatus: true,
                    legalGname: "",
                    legalGprofession: "",
                    legalGnationality: "",
                    mhaon: ""},
                spouseInfo:{
                    maritalStatus: "",
                    spouseName: "",
                    spouseProfession: "",
                    spouseNationality: ""
                },
                emergencyContact:{
                    contactRelationShip: "",
                    name: "",
                    country: "",
                    district: "",
                    city: "",
                    block: "",
                    postOffice: "",
                    postalCode: "",
                    policeStation: "",
                    email: "",
                    countryCode: "",
                    mobileNo: "",
                },
                passportOptions:{
                   validity:"",
                   price:"" 
                },
                deliveryAndAppointment:{
                    deliveryType:"",
                    price:"",
                    dateTime: null
                }    
            },
            formStatus: {
                "Passport Type": true, // First form is always enabled
                "Personal Information": false,
                "Address": false,
                "ID Documents": false,
                "Spouse Information": false,
                "Parental Information": false,
                "Emergency Contact": false,
                "Passport Options": false,
                "Delivery Options and Appointment": false,
                "Overview": false,
            },
            currentFormIndex: 0, // Default to first form
            updateFormData:(section,newData)=> set((state)=>(
                {
                    formData: {...state.formData, [section]: {...state.formData[section],...newData}},
                }
            )),
            updateFormStatus: (formName, isEnabled) => set((state) => ({
                formStatus: { ...state.formStatus, [formName]: isEnabled }
            })),
            resetForm: () => set({
                formData: {
                    passportType: { type: "" },
                    personalInfo: { gender: "", fullName: "", firstName: "", surName: "", profession:"", religion:"", countryCode:"",mobileNo:"",birthCountry:"",birthDistrict:"", birthDate: null, citizenType:""},
                    address: {
                        district: "", city: "", block: "", postOffice: "", postalCode: "",
                        policeStation: "", yes: false, no: false, country: "",
                        district2: "", city2: "", block2: "", postOffice2: "", postalCode2: "", policeStation2: "", officeType:"Regional Passport Office (RPO)"
                    },
                    idDocuments: { prevPassport: "", otherPassport: null, nid: "" },
                    parentalInfo: {
                        fInfoStatus: false,
                        fatherName: "",
                        fatherProfession: "",
                        fatherNationality: "",
                        fatherNid: "",
                        mInfoStatus: false,
                        motherName: "",
                        motherProfession: "",
                        motherNationality: "",
                        motherNid: "",
                        lgiStatus: true,
                        legalGname: "",
                        legalGprofession: "",
                        legalGnationality: "",
                        mhaon: ""
                    },
                    spouseInfo: {
                        maritalStatus: "",
                        spouseName: "",
                        spouseProfession: "",
                        spouseNationality: ""
                    },
                    emergencyContact: {
                        contactRelationShip: "",
                        name: "",
                        country: "",
                        district: "",
                        city: "",
                        block: "",
                        postOffice: "",
                        postalCode: "",
                        policeStation: "",
                        email: "",
                        countryCode: "",
                        mobileNo: "",
                    },
                    passportOptions: {
                        validity: "",
                        price:""
                    },
                    deliveryAndAppointment: {
                        deliveryType: "",
                        price: "",
                        dateTime: null
                    }    
                },
                formStatus: {
                    "Passport Type": true,
                    "Personal Information": false,
                    "Address": false,
                    "ID Documents": false,
                    "Spouse Information": false,
                    "Parental Information": false,
                    "Emergency Contact": false,
                    "Passport Options": false,
                    "Delivery Options and Appointment": false,
                    "Overview": false,
                }
            }),
            setCurrentFormIndex: (index) =>
                set(() => ({
                    currentFormIndex: index,
                })),
        }),
        {name:"form-storage"}
    )
)



