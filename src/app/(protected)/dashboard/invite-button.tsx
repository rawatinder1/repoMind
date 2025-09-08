'use client'
import {Dialog,DialogContent,DialogHeader} from'@/components/ui/dialog'
import useProject from '@/hooks/use-project'
import { DialogTitle } from '@radix-ui/react-dialog'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
const InviteButton=()=>{
    const {projectId}=useProject();
    const [open , setOpen]=React.useState(false)
    return (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Team Members</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-gray-500'>Ask them to copy and paste this link</p>
                <Input 
                   className='mt-4'
                   readOnly
                   onClick={()=>{
                       navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`);
                       toast.success("copied to clipboard")
                       
                   }}
                   value={`${window.location.origin}/join/${projectId}`}
                />

            </DialogContent>
          </Dialog>
          <Button className="bg-blue-500 text-white" size='sm' onClick={()=>setOpen(true)}>Invite Members</Button>

        </>
    )
}
export default InviteButton;