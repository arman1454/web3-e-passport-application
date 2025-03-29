"use client";

import Address from "@/components/Address";
import ID_Documents from "@/components/ID_Documents";
import PassportType from "@/components/PassportType";
import PersonalInfo from "@/components/PersonalInfo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

export default function Home() {
    const [active, setActive] = useState("Address");
    const items = [
        { name: "Passport Type", status: true },
        { name: "Personal Information", status: true },
        { name: "Address", status: true },
        { name: "ID Documents", status: false },
        { name: "Parental Information", status: false },
        { name: "Spouse Information", status: false },
        { name: "Emergency Contact", status: false },
        { name: "Passport Options", status: false },
        { name: "Delivery Options and Appointment", status: false },
    ];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="flex flex-col items-center gap-4 text-center pb-10 pt-6 lg:p-12">
                <div className="flex lg:hidden">
                    <Badge variant="outline" className="bg-background text-foreground">
                        "✨Creating your own Token"
                        <ArrowRight className="ml-2 size-4" />
                    </Badge>
                <CustomConnectButton />
                </div>
                <Label className="lg:text-lg text-foreground">Please fill in all required information step by step in each section.</Label>
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
                        <ChevronLeft className="text-foreground"/>
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
                                                    onClick={() => setActive(item.name)}
                                                    disabled={!item.status}
                                                    variant="secondary"
                                                    className={`text-md w-full text-left ${
                                                        active === item.name 
                                                            ? "bg-primary text-primary-foreground" 
                                                            : "bg-transparent text-muted-foreground"
                                                    }`}
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
                <Card className="hidden lg:block bg-card text-card-foreground border-border">
                    {items.map((item, key) => (
                        <CardBody key={key}>
                            <Button
                                onClick={() => setActive(item.name)}
                                disabled={!item.status}
                                variant="secondary"
                                className={`w-full text-left ${
                                    active === item.name 
                                    ? "bg-primary text-primary-foreground hover:bg-primary" 
                                    : "bg-transparent text-foreground hover:text-accent-foreground"
                                }`}
                            >
                                {item.name}
                            </Button>
                        </CardBody>
                    ))}
                </Card>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 px-12 lg:px-4 overflow-hidden">
                    {active === "Passport Type" ? <PassportType /> :
                        active === "Personal Information" ? <PersonalInfo /> :
                            active === "Address" ? <Address /> :
                                <ID_Documents />}
                </div>
            </div>
        </>
    );
}
