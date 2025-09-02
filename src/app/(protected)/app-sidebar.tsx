'use client'

import {
    useSidebar,
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarGroup,
    SidebarMenuItem,
    SidebarGroupContent,
    SidebarHeader,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image'
import { usePathname } from "next/navigation"
import useProject from "../../hooks/use-project"
import { useTheme } from "next-themes"
import { Plus, Bot, LayoutDashboard, Presentation, CreditCard,Sprout } from "lucide-react";
import { url } from "inspector";

const items = [
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
        title:"Essence",
        url:"/essence",
        icon: Sprout,
    },
    {
        title: "Meetings",
        url: '/meetings',
        icon: Presentation,
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
    const { open } = useSidebar();
    const { projects, project, projectId, setProjectId } = useProject();

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Image src='neuron_repo_logo(1).svg' alt='logo' width={40} height={40} />
                    {open && (
                        <h1 className="text-xl font-bold text-primary/80">
                            RepoMind
                        </h1>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link 
                                                href={item.url} 
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                                    {
                                                        // Active state
                                                        "bg-primary text-primary-foreground": isActive,
                                                        // Hover states when not active
                                                        "hover:bg-gray-100 dark:hover:bg-gray-800": !isActive && !isDark,
                                                        "hover:bg-gray-800 dark:hover:bg-gray-700": !isActive && isDark,
                                                    }
                                                )}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {projects?.map(proj => {
                            const isSelected = proj.id === projectId;
                            return (
                                <SidebarMenuItem key={proj.name}>
                                    <SidebarMenuButton asChild>
                                        <div 
                                            onClick={() => setProjectId(proj.id)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                                                {
                                                    "bg-primary/10 border border-primary/20": isSelected,
                                                    "hover:bg-muted": !isSelected
                                                }
                                            )}
                                        >
                                            <div className={cn(
                                                'rounded-sm border size-6 flex items-center justify-center text-sm font-medium transition-colors',
                                                {
                                                    'bg-primary text-primary-foreground border-primary': isSelected,
                                                    'bg-yellow-100 text-blue-400- border-blue-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800': !isSelected
                                                }
                                            )}>
                                                {proj.name[0]!.toUpperCase()}
                                            </div>
                                            <span className={cn(
                                                "truncate",
                                                {
                                                    "font-medium": isSelected
                                                }
                                            )}>
                                                {proj.name}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        
                        <div className="h-2"></div>
                        
                        {open && (
                            <SidebarMenuItem>
                                <Link href="/create">
                                    <Button 
                                        size='sm' 
                                        variant='outline' 
                                        className="w-full justify-start gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create Project
                                    </Button>
                                </Link>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}