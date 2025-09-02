import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from '@clerk/nextjs'
import AppSidebar from "./app-sidebar";
import { ThemeProvider } from "../_components/theme-provider";
import { ThemeToggle } from "../_components/theme-toggle";
type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
    return (
        <ThemeProvider>
                    <SidebarProvider>
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <AppSidebar />
                
                {/* Main content area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className='flex items-center justify-between border-sidebar-border bg-sidebar border shadow rounded-md p-4 m-2'>
                        <div className="flex items-center gap-2">
                            {/* <SearchBar/> */}
                            <div><ThemeToggle/></div>
                        </div>
                        <UserButton />
                    </div>
                    
                    {/* Content */}
                    <div className='flex-1 border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-auto mx-2 mb-2 p-4'>
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
        </ThemeProvider>

    )
}

export default SidebarLayout;