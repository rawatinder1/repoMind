'use client'

import {Button} from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { api } from "@/trpc/react";
import React from 'react'
import useRefetch from "@/hooks/use-refetch";
import {useForm} from 'react-hook-form';
import { toast } from "sonner";
//import CreateProjectHelpModal from "./howto"
import { useTheme } from "next-themes"; 
import CreateProjectHelpModal from "./howto"
import AnimatedFlask from "./flask"
type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string,
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();
    
    // Get theme - adjust this based on your theme implementation
    const { theme } = useTheme(); // If using next-themes
    const isDark = theme === 'dark';
    
    // Alternative if you're using a different theme system:
    // const isDark = document.documentElement.classList.contains('dark');
    // Or use your theme context

    function onSubmit(data: FormInput) {
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Project created successfully!')
                refetch();
                reset()
            },
            onError: () => {
                toast.error('Failed to create project')
            }
        })
        return true;
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
                ? 'bg-zinc-900' 
                : 'bg-gray-50'
        }`}>
            <div className='relative flex items-center gap-12 h-full justify-center min-h-screen p-8'>
                {/* Help button in top-left */}
                <div className='absolute top-4 left-4 z-10'>
                    <CreateProjectHelpModal isDark={isDark} />
                </div>

                {/* SVG Image */}
                <div className='flex-shrink-0'>
                    <AnimatedFlask 
                        width={280} 
                        height={280}
                        className={`transition-opacity duration-300 ${
                            isDark ? 'opacity-80' : 'opacity-100'
                        }`}
                    />
                </div>

                {/* Form Section */}
                <div className={`max-w-md w-full p-8 rounded-3xl border-2 backdrop-blur-sm transition-all duration-300 ${
                    isDark 
                        ? 'bg-zinc-800/95 border-zinc-700/60 shadow-2xl shadow-black/50' 
                        : 'bg-white/95 border-gray-300/60 shadow-xl shadow-gray-900/15'
                }`}>
                    <div className='mb-6'>
                        <h1 className={`font-semibold text-2xl mb-2 transition-colors duration-300 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Link your GitHub Repository
                        </h1>
                        <p className={`text-sm transition-colors duration-300 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Enter the URL of your repository and link it to RepoMind
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div>
                            <Input
                                {...register('projectName', { required: true })}
                                placeholder='Project Name'
                                required
                                className={`transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-zinc-700/50 border-zinc-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            />
                        </div>

                        <div>
                            <Input
                                {...register('repoUrl', { required: true })}
                                placeholder='GitHub URL'
                                required
                                className={`transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-zinc-700/50 border-zinc-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            />
                        </div>

                        <div>
                            <Input
                                {...register('githubToken', { required: false })}
                                placeholder='GitHub Token (Optional)'
                                type="password"
                                className={`transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-zinc-700/50 border-zinc-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            />
                        </div>

                        <Button 
                            type='submit' 
                            disabled={createProject.isPending}
                            className={`w-full transition-all duration-300 ${
                                isDark
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                            } ${createProject.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {createProject.isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                                        isDark ? 'border-white' : 'border-white'
                                    }`} />
                                    Creating...
                                </div>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </form>

                    {/* Additional info */}
                    <div className={`mt-6 p-3 rounded-2xl ${
                        isDark 
                            ? 'bg-blue-500/10 border border-blue-400/20' 
                            : 'bg-blue-50 border border-blue-200'
                    }`}>
                        <p className={`text-xs ${
                            isDark ? 'text-blue-300' : 'text-blue-700'
                        }`}>
                            💡 Private repositories require a GitHub token for access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePage