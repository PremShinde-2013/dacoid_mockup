"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, Moon, Sun } from 'lucide-react';

import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNav = [
    {
        title: "Calendar",
        href: "/",
    },

    {
        title: "Events",
        href: "/events",
    },

];
export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const { setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 px-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">

                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">Dacoid</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {mainNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-8 w-h-8" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="pr-0">
                        <MobileLink href="/" className="flex items-center" onOpenChange={setIsOpen}>
                            <span className="font-bold">shadcn/ui</span>
                        </MobileLink>
                        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                            <div className="flex flex-col space-y-3">
                                {mainNav.map(
                                    (item) =>
                                        item.href && (
                                            <MobileLink key={item.href} href={item.href} onOpenChange={setIsOpen}>
                                                {item.title}
                                            </MobileLink>
                                        )
                                )}
                            </div>
                            <Separator className="my-4" />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search functionality here if needed */}
                    </div>
                    <nav className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    );
}

interface MobileLinkProps extends React.PropsWithChildren {
    href: string;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
    const pathname = usePathname();
    return (
        <Link
            href={href}
            onClick={() => {
                onOpenChange?.(false);
            }}
            className={cn(
                "text-foreground/70 transition-colors hover:text-foreground",
                pathname === href && "text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Link>
    );
}

