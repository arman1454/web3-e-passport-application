import { create } from 'zustand'
import { persist } from "zustand/middleware";

export const useFormStore = create(
    persist(
        (set)=>({
            formData:{
                passportType: {type:""},
                personalInfo:{gender:"",fullName:"",firstName:"",surName:""},
                address:{district:"",city:"",block:"",postOffice:"",postalCode:"",policeStation:"",
                    yes: false, no:false, country: "", district2: "", city2: "", block2: "", postOffice2: "", postalCode2: "", policeStation2: ""
},
                
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



