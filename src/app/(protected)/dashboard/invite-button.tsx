'use client'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import useProject from '@/hooks/use-project'
import { DialogTitle } from '@radix-ui/react-dialog'
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { toast } from 'sonner'
import { Copy, Mail, Link2, Check, Users, Send, X } from 'lucide-react'
import { api } from "@/trpc/react"

const InviteButton = () => {
    const { projectId } = useProject()
    const [open, setOpen] = React.useState(false)
    const [inviteUrl, setInviteUrl] = useState('')
    const [email, setEmail] = useState('')
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState('link')
    const [emailSent, setEmailSent] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    const sendEmailMutation = api.project.sendEmail.useMutation({
        onSuccess: () => {
            setEmailSent(true)
            toast.success(`Invitation sent to ${email}`, {
                style: { 
                    background: '#ffffff', 
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                }
            })
            
            setTimeout(() => {
                setEmail('')
                setEmailSent(false)
            }, 3000)
        },
        onError: (error) => {
            toast.error(error.message || "Failed to send invitation")
        }
    })

    useEffect(() => {
        if (projectId) {
            setInviteUrl(`${window.location.origin}/join/${projectId}`)
        }
    }, [projectId])

    const copyToClipboard = async () => {
        if (inviteUrl) {
            await navigator.clipboard.writeText(inviteUrl)
            setCopied(true)
            toast.success("Link copied to clipboard", {
                style: { 
                    background: '#ffffff', 
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                }
            })
            
            setTimeout(() => setCopied(false), 3000)
        }
    }

    const sendEmailInvite = async () => {
        if (!email) {
            toast.error("Please enter an email address")
            return
        }
        
        if (!projectId) {
            toast.error("Project ID not found")
            return
        }
        
        sendEmailMutation.mutate({
            to: email,
            projectId: projectId,
            projectLink: inviteUrl
        })
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setTimeout(() => {
                setActiveTab('link')
                setEmail('')
                setCopied(false)
                setEmailSent(false)
            }, 200)
        }
        setOpen(newOpen)
    }

    return (
        <>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                
                @keyframes slide-in-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .apple-modal {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.05);
                }
                
                .tab-indicator {
                    background: #3b82f6;
                    box-shadow: 
                        0 2px 8px rgba(59, 130, 246, 0.25),
                        0 1px 3px rgba(59, 130, 246, 0.3);
                }
                
                .button-shine::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.6s;
                }
                
                .button-shine:hover::before {
                    left: 100%;
                }
                
                .apple-input {
                    background: #f9fafb;
                    border: 1px solid #d1d5db;
                    transition: all 0.2s ease;
                    color: #1f2937;
                }
                
                .apple-input:focus {
                    background: #ffffff;
                    border: 1px solid #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    outline: none;
                }
                
                .apple-input:hover {
                    border-color: #9ca3af;
                }
                
                .dark .apple-input {
                    background: #374151;
                    border: 1px solid #4b5563;
                    color: #f9fafb;
                }
                
                .dark .apple-input:focus {
                    background: #1f2937;
                    border: 1px solid #3b82f6;
                }
                
                .dark .apple-input:hover {
                    border-color: #6b7280;
                }
                
                .tab-container {
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                }
            `}</style>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-40" />}
                <DialogContent 
                    className="sm:max-w-lg p-0 bg-transparent border-0 shadow-none overflow-visible z-50 [&>button]:hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    
                    <div className="relative apple-modal rounded-2xl overflow-hidden">
                        <div className="relative bg-white p-8">
                            {/* Close button */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group"
                            >
                                <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                            </button>

                            <DialogHeader className="space-y-6 text-center relative">
                                {/* Clean icon */}
                                <div className="mx-auto relative">
                                    <div 
                                        className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm relative"
                                        style={{ 
                                            animation: isHovering ? 'float 2s ease-in-out infinite' : 'none',
                                            background: '#3b82f6'
                                        }}
                                    >
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                
                                <div style={{ animation: 'slide-in-up 0.6s ease-out 0.1s both' }}>
                                    <DialogTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
                                        Invite Team Members
                                    </DialogTitle>
                                    <p className="text-gray-600 mt-2">
                                        Share your project with colleagues
                                    </p>
                                </div>
                            </DialogHeader>

                            {/* Clean Tab Selector */}
                            <div className="relative tab-container rounded-xl p-1 mt-8" style={{ animation: 'slide-in-up 0.6s ease-out 0.2s both' }}>
                                <div 
                                    className={`absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] tab-indicator rounded-lg transition-all duration-300 ease-out ${
                                        activeTab === 'email' ? 'transform translate-x-full' : ''
                                    }`}
                                />
                                <div className="relative z-10 flex">
                                    <button
                                        onClick={() => setActiveTab('link')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                                            activeTab === 'link'
                                                ? 'text-white'
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        <Link2 className="w-4 h-4" />
                                        Copy Link
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('email')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                                            activeTab === 'email'
                                                ? 'text-white'
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        Send Email
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-8 space-y-6">
                                {activeTab === 'link' ? (
                                    <div className="space-y-4" style={{ animation: 'slide-in-up 0.5s ease-out' }}>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-900">
                                                Invitation Link
                                            </label>
                                            <div className="relative group text-gray-900">
                                                <Input
                                                    className="pr-12 apple-input rounded-lg h-12 text-sm font-mono"
                                                    readOnly
                                                    value={inviteUrl}
                                                />
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-all duration-200"
                                                    disabled={copied}
                                                >
                                                    {copied ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-gray-500 hover:text-blue-600 transition-colors duration-200" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <Button
                                            onClick={copyToClipboard}
                                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden button-shine"
                                            style={{
                                                backgroundColor: copied ? '#22c55e' : '#3b82f6'
                                            }}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-2">
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copy Link
                                                    </>
                                                )}
                                            </div>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4" style={{ animation: 'slide-in-up 0.5s ease-out' }}>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-900">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    placeholder="colleague@company.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="apple-input rounded-lg h-12 text-sm pr-10 text-gray-900"
                                                />
                                                {emailSent && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Button
                                            onClick={sendEmailInvite}
                                            disabled={!email || !isValidEmail(email) || emailSent || sendEmailMutation.isPending}
                                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden button-shine"
                                            style={{
                                                backgroundColor: emailSent ? '#22c55e' : '#3b82f6'
                                            }}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-2">
                                                {sendEmailMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : emailSent ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Send Invitation
                                                    </>
                                                )}
                                            </div>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Clean Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200" style={{ animation: 'slide-in-up 0.6s ease-out 0.4s both' }}>
                                <p className="text-xs text-gray-500 text-center">
                                    Team members will be able to view and collaborate on this project
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Button
                className="relative bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden button-shine"
                onClick={() => setOpen(true)}
            >
                <div className="relative z-10 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Invite Members
                </div>
            </Button>
        </>
    )
}

export default InviteButton