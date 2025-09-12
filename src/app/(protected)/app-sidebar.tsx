'use client'

import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image'
import { usePathname } from "next/navigation"
import useProject from "../../hooks/use-project"
import { useTheme } from "next-themes"
import { Plus, Bot, LayoutDashboard, CreditCard, Sprout } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button"
const navigationItems = [
    {
        title: "Dashboard",
        url: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: "Q&A",
        url: '/QA',
        icon: Bot,
    },
    {
        title: "Essence",
        url: "/essence",
        icon: Sprout,
    },
    {
        title: "Billing",
        url: '/billing',
        icon: CreditCard,
    }
]

export default function AppSidebar() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const pathname = usePathname();
    const { projects, projectId, setProjectId } = useProject();
    const [open, setOpen] = useState(false);

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-6">
                <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                    {/* Logo */}
                    {open ? <Logo /> : <LogoIcon />}
                    
                    {/* Navigation Section */}
                    <div className="mt-6 flex flex-col gap-1">
                        <div className={cn(
                            "text-xs font-medium tracking-wide uppercase px-3 mb-3",
                            isDark ? "text-gray-500" : "text-gray-500",
                            !open && "text-center px-0"
                        )}>
                            {open ? "App" : "•"}
                        </div>
                        {navigationItems.map((item, index) => {
                            const isActive = pathname === item.url;
                            return (
                                <Link key={item.title} href={item.url}>
                                    <motion.div 
                                        className={cn(
                                            "group relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                                            isActive 
                                                ? "bg-blue-600 text-white shadow-sm" 
                                                : isDark
                                                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                            !open && "mx-1 justify-center"
                                        )}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        
                                        <motion.span 
                                            className="font-medium truncate"
                                            animate={{
                                                opacity: open ? 1 : 0,
                                                width: open ? "auto" : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            style={{ 
                                                display: open ? "block" : "none" 
                                            }}
                                        >
                                            {item.title}
                                        </motion.span>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Projects Section */}
                    <div className="mt-6 flex flex-col gap-1">
                        <div className={cn(
                            "text-xs font-medium tracking-wide uppercase px-3 mb-3",
                            isDark ? "text-gray-500" : "text-gray-500",
                            !open && "text-center px-0"
                        )}>
                            {open ? "Projects" : "P"}
                        </div>
                        
                        {/* Show project indicators when collapsed */}
                        {!open && projects && projects.length > 0 && (
                            <div className="px-1 mb-2">
                                <div className="flex flex-col gap-1 items-center">
                                    {projects.slice(0, 3).map((proj) => {
                                        const isSelected = proj.id === projectId;
                                        return (
                                            <div
                                                key={proj.id}
                                                onClick={() => setProjectId(proj.id)}
                                                className={cn(
                                                    'w-8 h-8 rounded-md border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200',
                                                    isSelected
                                                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                                        : isDark
                                                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                                )}
                                                title={proj.name}
                                            >
                                                {proj.name[0]!.toUpperCase()}
                                            </div>
                                        )
                                    })}
                                    {projects.length > 3 && (
                                        <div className={cn(
                                            'w-8 h-8 rounded-md border-2 flex items-center justify-center text-xs font-bold',
                                            isDark
                                                ? 'bg-gray-800 text-gray-400 border-gray-600'
                                                : 'bg-gray-50 text-gray-500 border-gray-300'
                                        )}>
                                            +{projects.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Full project list when expanded */}
                        {open && projects?.map((proj, index) => {
                            const isSelected = proj.id === projectId;
                            return (
                                <motion.div
                                    key={proj.name}
                                    onClick={() => setProjectId(proj.id)}
                                    className={cn(
                                        "group relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                                        isSelected 
                                            ? "bg-green-600 text-white shadow-sm" 
                                            : isDark
                                                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: (navigationItems.length + index) * 0.05 }}
                                >
                                    <div className={cn(
                                        'w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold shrink-0',
                                        isSelected
                                            ? 'bg-white/20 text-white border-white/30'
                                            : isDark
                                                ? 'bg-gray-700 text-gray-300 border-gray-600'
                                                : 'bg-gray-100 text-gray-700 border-gray-300'
                                    )}>
                                        {proj.name[0]!.toUpperCase()}
                                    </div>
                                    
                                    <span className="truncate font-medium">
                                        {proj.name}
                                    </span>
                                </motion.div>
                            )
                        })}
                        
                        {/* Create Project Button */}
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="mx-2 mt-2"
                            >
                                <Link href="/create">
                                    <Button 
                                        size='sm' 
                                        variant='outline' 
                                        className="w-full justify-start gap-2 border-dashed hover:border-solid transition-all duration-200"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create Project
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>

                
            </SidebarBody>
        </Sidebar>
    );
}

// Logo component when sidebar is open
const Logo = () => {
    return (
        <Link
            href="/dashboard"
            className="relative z-20 flex items-center space-x-3 px-3 py-2"
        >
            <div className="p-1.5 rounded-lg bg-blue-600">
                <Image src='neuron_repo_logo(1).svg' alt='logo' width={20} height={20} />
            </div>
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="font-bold text-lg text-foreground"
            >
                RepoMind
            </motion.span>
        </Link>
    );
};

// Logo icon when sidebar is collapsed
const LogoIcon = () => {
    return (
        <Link
            href="/dashboard"
            className="relative z-20 flex items-center justify-center py-2"
        >
            <div className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                <Image src='neuron_repo_logo(1).svg' alt='logo' width={20} height={20} />
            </div>
        </Link>
    );
};