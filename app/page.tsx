"use client";

import Address from "@/components/Address";
import ID_Documents from "@/components/ID_Documents";
import PassportType from "@/components/PassportType";
import PersonalInfo from "@/components/PersonalInfo";
import { Button } from "@/components/ui/button";

import { useState } from "react";


export default function Home() {
    const [active,setActive] = useState("");
    const items = [{name:"Passport Type",status:true},{name:"Personal Information",status:true},
        {name:"Address",status:false},
        {name:"ID Documents",status:false}]

    return(
        <>
        <div className="flex items-start justify-center gap-10 pt-36">
          <div className="flex flex-col items-center justify-between h-80">
                {
                    items.map((item, key) => (
                        <Button onClick={() => setActive(item.name)} disabled={!item.status}>
                            {item.name}
                        </Button>
                    ))
                }
          </div>        
                <div className="w-[600px] border p-4 overflow-hidden">
                    {active === "Passport Type" ? <PassportType /> :
                        active === "Personal Information" ? <PersonalInfo /> :
                            active === "Address" ? <Address /> :
                                <ID_Documents />}
                </div>

        </div>

        </>
            
        
        

        
    )
}
