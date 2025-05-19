"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Progress } from "@heroui/react";
import { Spinner } from "@heroui/react";

export default function DialogDemo() {
    const [isOpen,setIsOpen] = useState(false)
    const [t1,setT1] = useState(false);
    const [t2,setT2] = useState(false);
    const task2 = ()=>{
        setTimeout(()=>{
            setT2(true)
        },3000)
        
    }

    const task1 = ()=>{

        setTimeout(()=>{
            console.log("ending");
            setT1(true)
            task2()
            
        }, 3000)
        
    }
    return (
        <div>
            
        <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                        {!t1 && <Spinner classNames={{ label: "text-foreground mt-4" }} label="wave" variant="wave" />}
                        {t1 && !t2 && <Progress isIndeterminate aria-label="Loading..." className="max-w-md" size="sm" /> }
                        {t1 && t2 && <p>NFT Minted</p> }
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        </div>
    )
}
