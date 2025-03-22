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

export default function Home() {
    const [active, setActive] = useState("Personal Information");
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
            <div className="flex flex-col lg:flex-row items-start lg:justify-center gap-10 pt-36">
                {/* Mobile Button to Open Drawer */}
                <div className="pl-12">
                    <Button className="lg:hidden" onClick={onOpen}>Open Menu</Button>
                </div>

                {/* Drawer for Mobile Navigation */}
                <Drawer isOpen={isOpen} placement="left" size="xs" backdrop="blur" onOpenChange={onOpenChange}>
                    <DrawerContent className="bg-card absolute top-1/3 transform -translate-y-1/4 h-auto max-h-[64vh] rounded-lg">
                        {() => (
                            <>
                                <DrawerBody className="space-y-2">
                                    <Card className="bg-card shadow-none">
                                        {items.map((item, key) => (
                                            <CardBody key={key}>
                                                <Button
                                                    onClick={() => setActive(item.name)}
                                                    disabled={!item.status}
                                                    variant="secondary"
                                                    className={`text-md w-full text-left ${active === item.name ? "bg-primary text-white" : "bg-transparent text-muted-foreground"}`}
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
                <Card className="hidden lg:block bg-card">
                    {items.map((item, key) => (
                        <CardBody key={key}>
                            <Button
                                onClick={() => setActive(item.name)}
                                disabled={!item.status}
                                variant="secondary"
                                className={`w-full text-left ${active === item.name ? "bg-primary text-white" : "bg-transparent text-muted-foreground"}`}
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
