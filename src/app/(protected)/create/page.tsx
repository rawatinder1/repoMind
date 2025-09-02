'use client'
import {Button} from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { api } from "@/trpc/react";
import React from 'react'
import useRefetch from "@/hooks/use-refetch";
import {useForm} from 'react-hook-form';
import { toast } from "sonner";

type FormInput ={
    repoUrl: string,
    projectName : string,
    githubToken?:string,
}

const CreatePage=()=>{
    const {register,handleSubmit,reset} = useForm<FormInput>();
    const createProject=api.project.createProject.useMutation();
    const refetch=useRefetch()
    function onSubmit(data:FormInput){
       // window.alert(JSON.stringify(data,null,2));
        createProject.mutate({
             githubUrl:data.repoUrl,
             name:data.projectName,
             githubToken:data.githubToken
        },{
            onSuccess:()=>{
                toast.success('Project created successfully!')
                refetch();
                reset()
            },
            onError:()=>{
                toast.error('Failed to create project')
            }
        })
       

        return true;
    }
    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='liquid-svgrepo-com.svg' className='h-70 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-2x1'>
                        Link your GitHub Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your repository and link it to Neuron Repo
                    </p>
                </div>
                <div className="h-4"></div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register('projectName' , {required:true})}
                            placeholder='Project Name'
                            required
                        />
                        <div className="h-2"></div>
                        <Input
                            {...register('repoUrl' , {required:true})}
                            placeholder='Github URL'
                            required
                        />
                        <div className="h-2"></div>

                        <Input
                            {...register('githubToken' , {required:false})}
                            placeholder='Github Token (Optional)'
                            
                        />

                        <div className="h-2"></div>
                        <Button type='submit' disabled ={createProject.isPending} >
                            Create Project
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}
export default CreatePage