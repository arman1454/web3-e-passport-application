import { create } from 'zustand'
import { persist } from "zustand/middleware";

export const useFormStore = create(
    persist(
        (set)=>({
            formData:{
                passportType: {type:""},
                personalInfo:{gender:"",fullName:"",firstName:"",surName:""},
                address:{district:"",city:"",block:"",postOffice:"",postalCode:"",policeStation:"",same:false,country:""},
                
            },

            updateFormData:(section,newData)=> set((state)=>(
                {
                    formData: {...state.formData, [section]: {...state.formData[section],...newData}},
                }
            )),

            resetForm: () => set({
                formData: {
                    passportType: {},
                    personalInfo: {},
                    address: {},
                    
}}),
        }),
        {name:"form-storage"}
    )
)



