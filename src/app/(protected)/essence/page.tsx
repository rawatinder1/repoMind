'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import useProject from '@/hooks/use-project';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { readStreamableValue } from '@ai-sdk/rsc';
import { FileText, Download, GitBranch, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes'
import { autoDoc, generateMermaidDiagram } from './actions';
import mermaid from 'mermaid';
import SequenceDiagramsPitchCard from './topCard';
import { toast } from 'sonner'; // Assuming you have sonner for toasts
import { MessageSquare } from 'lucide-react';
const PromptCard = () => {
    const { resolvedTheme } = useTheme();
    const [showHelp, setShowHelp] = React.useState(false);
    const isDark = resolvedTheme === "dark";
    const { project } = useProject();
    const [open, setOpen] = React.useState(false);
    const [prompt, setPrompt] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [answer, setAnswer] = React.useState('');
    const [mermaidCode, setMermaidCode] = React.useState('');
    const [showMermaid, setShowMermaid] = React.useState(false);
    const [error, setError] = React.useState('');
    const [hasContent, setHasContent] = React.useState(false);
    const mermaidRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        mermaid.initialize({ 
            startOnLoad: true,
            theme: isDark ? 'dark' : 'default'
        });
    }, [isDark]);

    React.useEffect(() => {
        if (mermaidCode && showMermaid && mermaidRef.current) {
            // Clear previous content
            mermaidRef.current.innerHTML = '';
            
            // Parse and clean the mermaid code
            const cleanCode = mermaidCode
                .replace(/```mermaid/g, '')
                .replace(/```/g, '')
                .trim();
            
            // Render mermaid diagram
            mermaid.render('mermaid-diagram', cleanCode)
                .then(({ svg }) => {
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                })
                .catch((error) => {
                    console.error('Mermaid rendering error:', error);
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram: ${error.message}</div>`;
                    }
                });
        }
    }, [mermaidCode, showMermaid]);

    // Track if we have any content to show
    React.useEffect(() => {
        setHasContent(!!(answer || mermaidCode || error));
    }, [answer, mermaidCode, error]);

    const downloadSVG = () => {
        if (!mermaidRef.current) return;
        
        const svgElement = mermaidRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `${project?.name || 'diagram'}-sequence-diagram.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
    };

    const copyDocumentation = async () => {
        if (!answer) return;
        
        try {
            await navigator.clipboard.writeText(answer);
            toast.success('Documentation copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy documentation');
        }
    };

    const resetState = () => {
        setAnswer('');
        setMermaidCode('');
        setError('');
        setShowMermaid(false);
        setHasContent(false);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project?.id || !prompt.trim()) return;
        
        resetState();
        setLoading(true);
        setOpen(true);
       
        try {
            const { output } = await autoDoc(project.id, prompt);

            for await (const chunk of readStreamableValue(output)) {
                if (chunk) {
                    setAnswer((ans) => ans + chunk);
                }
            }
        } catch (error) {
            console.error('Error processing prompt:', error);
            setError('Failed to generate documentation. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const generateDiagram = async () => {
        if (!project?.id) return;
        
        resetState();
        setLoading(true);
        setOpen(true);
        
        try {
            const { mermaidCode, error } = await generateMermaidDiagram(project.id, prompt || undefined);
            
            if (error) {
                setError(`Failed to generate diagram: ${error}`);
            } else if (mermaidCode) {
                setMermaidCode(mermaidCode);
                setShowMermaid(true);
            } else {
                setError('No diagram was generated. Please try again with a different prompt.');
            }
        } catch (error) {
            console.error('Error generating diagram:', error);
            setError('Failed to generate diagram. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const retryLastAction = () => {
        if (showMermaid || mermaidCode) {
            generateDiagram();
        } else {
            // Simulate form submission for documentation
            const form = document.createElement('form');
            onSubmit({ preventDefault: () => {}, target: form } as any);
        }
    };

    // Allow reopening dialog if there's content or loading
    const canOpenDialog = hasContent || loading;
    
 
        

    return (
               <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[80vw] max-h-[85vh] backdrop-blur-3xl bg-white/80 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20">
                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        {showMermaid ? 'Sequence Diagram' : 'Documentation'}
                                    </h2>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">{project?.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Copy Documentation Button */}
                                {answer && !showMermaid && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={copyDocumentation}
                                        className="flex items-center gap-2 bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/40 transition-all duration-200 rounded-xl"
                                    >
                                        <Copy className="h-4 w-4" />
                                        Copy
                                    </Button>
                                )}
                                
                                {/* Download SVG Button */}
                                {showMermaid && mermaidCode && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={downloadSVG}
                                        className="flex items-center gap-2 bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/40 transition-all duration-200 rounded-xl"
                                    >
                                        <Download className="h-4 w-4" />
                                        SVG
                                    </Button>
                                )}

                                {/* Retry Button for errors */}
                                {error && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={retryLastAction}
                                        className="flex items-center gap-2 bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/40 transition-all duration-200 rounded-xl"
                                        disabled={loading}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                        Retry
                                    </Button>
                                )}
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2 custom-scrollbar">
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-3 p-6 rounded-2xl bg-white/30 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10">
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Processing...</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Error Display */}
                        {error && (
                            <div className="p-4">
                                <div className="flex items-center gap-3 p-6 border border-red-200/50 bg-red-50/50 dark:bg-red-950/30 dark:border-red-800/50 rounded-2xl backdrop-blur-sm">
                                    <div className="p-2 rounded-xl bg-red-100/80 dark:bg-red-900/50">
                                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-red-700 dark:text-red-300">Error</h3>
                                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={retryLastAction}
                                        disabled={loading}
                                        className="border-red-200/50 hover:bg-red-100/50 dark:border-red-800/50 dark:hover:bg-red-900/30 rounded-xl backdrop-blur-sm"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {/* Mermaid Diagram */}
                        {showMermaid && mermaidCode && (
                            <div className="p-4">
                                <div 
                                    ref={mermaidRef} 
                                    className="flex justify-center items-center bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-white/10 shadow-lg"
                                />
                            </div>
                        )}
                        
                        {/* Documentation with Apple Glass Effect */}
                        {!showMermaid && answer && (
                            <div className="p-4">
                                <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
                                    {/* Glass background with subtle gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-black/50 dark:via-black/30 dark:to-black/20 backdrop-blur-2xl"></div>
                                    
                                    {/* Subtle top highlight */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent"></div>
                                    
                                    {/* Content area */}
                                    <div className="relative p-8">
                                        <div className="prose max-w-none prose-zinc dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50/50 dark:prose-code:bg-blue-900/20 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-gray-900/90 dark:prose-pre:bg-black/60 prose-pre:backdrop-blur-sm prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-xl prose-blockquote:border-l-blue-500/50 prose-blockquote:bg-blue-50/30 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:backdrop-blur-sm prose-blockquote:rounded-r-xl">
                                            <MDEditor.Markdown 
                                                source={answer}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    color: isDark ? "#e5e7eb" : "#374151",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Subtle bottom shadow */}
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/40 dark:via-gray-600/40 to-transparent"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <SequenceDiagramsPitchCard/>
            <Card className="mt-6 col-span-3 shadow-lg rounded-2xl border-none bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                            <FileText className="h-5 w-5" />
                            Prompt Card
                            
                            {/* Help Button */}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowHelp(!showHelp)}
                                className="ml-2 w-6 h-6 p-0 rounded-full bg-blue-100/50 dark:bg-blue-900/30 hover:bg-blue-200/70 dark:hover:bg-blue-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">?</span>
                            </Button>
                        </div>
                        
                        {/* Button to reopen dialog if there's content */}
                        {canOpenDialog && !open && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                {loading ? 'Processing...' : hasContent ? 'View Results' : 'View Last Results'}
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Animated Help Card */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showHelp ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
                            {/* Glass background with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/10 backdrop-blur-xl"></div>
                            
                            {/* Content */}
                            <div className="relative p-6">
                                <div className="space-y-4">
                                    {/* Usage Tips */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-600/20 backdrop-blur-sm border border-white/20">
                                            <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">💡</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                How to Use
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                Be specific about what you want documented. Mention file types, sections, 
                                                or particular features. For diagrams, describe the flow or process you want visualized.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Best Practices */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-sm border border-white/20">
                                            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">✨</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                Best Results
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                Include context like "for new developers", "technical specifications", 
                                                or "user-facing documentation" to get tailored output that matches your audience.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Example Prompts */}
                                    <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Example Prompts:</p>
                                        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
                                            <div>"Document the payment processing workflow with installation steps"</div>
                                            <div>"Create technical specs for the database schema"</div>
                                            <div>"Show user authentication flow from login to dashboard"</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <Textarea
                            placeholder="Enter your prompt here..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={loading}
                            className="min-h-[100px] resize-none"
                        />
                        
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                variant={"default"}
                                color='blue-primary-hover'
                            >
                                {loading ? "Processing..." : "AutoDoc"}
                            </Button>
                            
                            <Button
                                type="button"
                                onClick={generateDiagram}
                                disabled={loading}
                                variant="outline"
                            >
                                <GitBranch className="h-4 w-4 mr-2" />
                                Generate Diagram
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.3);
                    border-radius: 24px;
                    backdrop-filter: blur(10px);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.5);
                }
                
                /* Enhanced glassmorphism for dark mode */
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </>

    );
}

export default PromptCard;
