"use client"
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@heroui/react";
import { FC } from 'react'
import { CustomConnectButton } from "./ui/CustomConnectButton";
import { Toggle } from "./Toggle";
// import { LuMenu } from 'next/link';
// import NetworkSwitcher from './NetworkSwitcher';


export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};


const Navigation: FC = (props) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        {
            name: "Passort Status",
            link: "#status"
        },
        {
            name: "Rewards",
            link: "#rewards"
        },
        
    ]

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-card">
            <NavbarContent className="flex gap-12">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <AcmeLogo />
                    <p className="font-bold text-muted-foreground">e-passport</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {menuItems.map((list, index) => (
                    <NavbarItem key={index} >
                        <Link color="foreground" href={list.link}>
                            {list.name}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            href={item.link}
                            size="lg"
                        >
                            {item.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
            <div className="hidden lg:flex">
            <CustomConnectButton/>
            </div>
            <NavbarContent as="div" justify="end" className="gap-6">
                <Toggle/>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name="Jason Hughes"
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">zoey@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="profile">Profile</DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    )

}

export default Navigation

