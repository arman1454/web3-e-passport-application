"use client";

import Address from "@/components/Address";
import ID_Documents from "@/components/ID_Documents";
import PassportType from "@/components/PassportType";
import PersonalInfo from "@/components/PersonalInfo";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
import { Label } from "@/components/ui/label";
import { CustomConnectButton } from "@/components/ui/CustomConnectButton";
import { ArrowRight, ArrowUpRight, ChevronLeft, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFormStore, FormStatus } from "@/app/store";
import EmergencyContact from "./EmergencyContact";
import PassportOptions from "./PassportOptions";
import DeliveryAndAppointment from "./DeliveryAndAppointment";
import SpouseInfo from "./SpouseInfo";
import ParentalInfo from "./ParentalInfo";
import Overview from "./Overview";

// Define the form item structure
const formNames = [
    "Passport Type",
    "Personal Information",
    "Address",
    "ID Documents",
    "Parental Information",
    "Spouse Information",
    "Emergency Contact",
    "Passport Options",
    "Delivery Options and Appointment",
    "Overview"
];

export default function PassportApplicationForm() {
    // Get formStatus from the store
    const formStatus = useFormStore((state) => state.formStatus);
    const updateFormStatus = useFormStore((state) => state.updateFormStatus);

    // Get and set the current form index from the store
    const storedIndex = useFormStore((state) => state.currentFormIndex);
    const setStoredIndex = useFormStore((state) => state.setCurrentFormIndex);

    // Create derived items array from formStatus
    const items = formNames.map(name => ({
        name,
        status: formStatus[name as keyof FormStatus]
    }));

    const lastTrueIndex = (() => {
        for (let i = 0; i < items.length; i++) {
            if (!items[i].status) return i - 1;
        }
        return items.length - 1;
    })();

    // Using the store's currentFormIndex instead of local state
    const [active, setActive] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Modified goToNextForm function with direct navigation approach
    const goToNextFormAndNavigate = (currentIndex: number) => {
        console.log(`Processing navigation from form ${currentIndex}`);

        // Make sure we don't go out of bounds
        if (currentIndex + 1 < formNames.length && lastTrueIndex == currentIndex) {
            const nextFormName = formNames[currentIndex + 1] as keyof FormStatus;

            // Update the store
            updateFormStatus(nextFormName, true);

            console.log(`Enabled form: ${nextFormName}, now navigating...`);

            // Force update before navigation
            // This bypasses the need to wait for React to re-render with updated formStatus
            setTimeout(() => {
                // Update the index in the store instead of local state
                setStoredIndex(currentIndex + 1);
            }, 100);
        } else {
            setTimeout(() => {
                // Update the index in the store instead of local state
                setStoredIndex(lastTrueIndex);
            }, 100);
        }
    };

    useEffect(() => {
        if (formNames[storedIndex]) {
            setActive(formNames[storedIndex]);
        }
    }, [storedIndex]);


    useEffect(() => {

        setActive(formNames[lastTrueIndex]);

    }, [lastTrueIndex]);

    // Remove debug logs in production
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            return;
        }
        console.log("Form status updated:", formStatus);
    }, [formStatus]);

    // Handle sidebar click with validation and update the stored index
    const handleSidebarClick = (key: number) => {
        // Check if the tab is enabled before navigating
        setStoredIndex(key);
        // setActive is handled by the useEffect
    };

    return (
        <>
            <div className="flex flex-col items-center gap-4 text-center pb-8 pt-6 lg:p-10">
                <div className="pt-4 flex lg:hidden">
                    <Badge variant="outline" className="bg-background text-foreground">
                        "✨Creating your own Token"
                        <ArrowRight className="ml-2 size-4" />
                    </Badge>
                    <CustomConnectButton />
                </div>
                <div className="pt-8 lg:pt-0 w-11/12 sm:w-full">
                    <Label className="lg:text-lg text-foreground font-sans">Please fill in all required information step by step in each section.</Label>
                </div>

            </div>
            <div className="flex flex-col lg:flex-row items-start lg:justify-center gap-10">
                {/* Mobile Icon to Open Drawer */}
                <div className="pl-12">
                    <Button
                        className="border border-primary bg-card text-card-foreground lg:hidden px-3 py-2 rounded-full flex items-center justify-center gap-1"
                        variant="outline"
                        onClick={onOpen}
                        aria-label="Open navigation menu"
                    >
                        <ChevronLeft className="text-foreground" />
                        <span>Sections</span>
                    </Button>
                </div>

                {/* Drawer for Mobile Navigation */}
                <Drawer isOpen={isOpen} placement="left" size="xs" backdrop="blur" onOpenChange={onOpenChange}>
                    <DrawerContent className="bg-card text-card-foreground absolute top-1/3 transform -translate-y-1/4 h-auto max-h-[64vh] rounded-lg">
                        {() => (
                            <>
                                <DrawerBody className="space-y-2">
                                    <Card className="bg-card border-border shadow-none">
                                        {items.map((item, key) => (
                                            <CardBody key={key}>
                                                <Button
                                                    onClick={() => handleSidebarClick(key)}
                                                    disabled={!item.status}
                                                    variant={active === item.name ? "default" : "ghost"}
                                                >
                                                    {item.name}
                                                </Button>
                                            </CardBody>
                                        ))}
                                    </Card>
                                </DrawerBody>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>

                {/* Sidebar for Larger Screens */}
                <Card className="hidden lg:block bg-card text-card-foreground border-border top-2">
                    {items.map((item, key) => (
                        <CardBody key={key}>
                            <Button
                                onClick={() => handleSidebarClick(key)}
                                disabled={!item.status}
                                variant={
                                    active === item.name ? "default" : "ghost"}
                            >
                                {item.name}
                            </Button>
                        </CardBody>
                    ))}
                </Card>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 px-12 lg:px-4 overflow-hidden lg:py-2">
                    {active === "Passport Type" ?
                        <PassportType
                            goToNextForm={() => {
                                goToNextFormAndNavigate(storedIndex);
                            }}
                        /> :
                        active === "Personal Information" ?
                            <PersonalInfo
                                goToNextForm={() => {
                                    goToNextFormAndNavigate(storedIndex);
                                }}
                            /> :
                        active === "Address" ?
                            <Address
                                goToNextForm={() => {
                                    goToNextFormAndNavigate(storedIndex);
                                }}
                            /> :
                        active === "ID Documents" ?
                            <ID_Documents
                                goToNextForm={() => {
                                    console.log(`Enabling next form after index ${storedIndex}`);
                                    goToNextFormAndNavigate(storedIndex);
                                }}
                            /> :
                                    active === "Passport Type" ?
                                        <PassportType
                                            goToNextForm={() => {
                                                goToNextFormAndNavigate(storedIndex);
                                            }}
                                        />:
                                        active === "Spouse Information" ?
                                            <SpouseInfo
                                                goToNextForm={() => {
                                                    console.log(`Enabling next form after index ${storedIndex}`);
                                                    goToNextFormAndNavigate(storedIndex);
                                                }}
                                            /> :
                        active === "Parental Information" ?
                            <ParentalInfo
                                goToNextForm={() => {
                                    console.log(`Enabling next form after index ${storedIndex}`);
                                    goToNextFormAndNavigate(storedIndex);
                                }}
                            /> :
                        active === "Emergency Contact" ?
                            <EmergencyContact
                                goToNextForm={() => {
                                    console.log(`Enabling next form after index ${storedIndex}`);
                                    goToNextFormAndNavigate(storedIndex);
                                }}
                            /> :
                        active === "Passport Options" ?
                            <PassportOptions
                                goToNextForm={() => {
                                    console.log(`Enabling next form after index ${storedIndex}`);
                                    goToNextFormAndNavigate(storedIndex);
                                }}
                            /> :
                        active === "Delivery Options and Appointment" ?    
                            <DeliveryAndAppointment goToNextForm={() => {
                                console.log(`Enabling next form after index ${storedIndex}`);
                                goToNextFormAndNavigate(storedIndex);
                            }} />:
                        <Overview/>    

                    }
                </div>
            </div>
        </>
    );
} 