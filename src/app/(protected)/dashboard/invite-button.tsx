'use client'
import {Dialog,DialogContent,DialogHeader} from'@/components/ui/dialog'
import useProject from '@/hooks/use-project'
import { DialogTitle } from '@radix-ui/react-dialog'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Button as StatefulButton} from "@/components/ui/stateful-button";
import { toast } from 'sonner'

const InviteButton = () => {
    const {projectId} = useProject();
    const [open, setOpen] = React.useState(false);
    const [inviteUrl, setInviteUrl] = useState('');

    useEffect(() => {
        if (projectId) {
            setInviteUrl(`${window.location.origin}/join/${projectId}`);
        }
    }, [projectId]);

    const copyToClipboard = () => {
        if (inviteUrl) {
            navigator.clipboard.writeText(inviteUrl);
            toast.success("Copied to clipboard");
        }
    };

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
                        onClick={copyToClipboard}
                        value={inviteUrl}
                    />
                </DialogContent>
            </Dialog>
            <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200" 
                onClick={() => setOpen(true)}
            >
                Invite Members
            </Button>
        </>
    )
}

export default InviteButton;