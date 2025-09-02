'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import useProject from '@/hooks/use-project';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { readStreamableValue } from '@ai-sdk/rsc';
import { FileText, Download, GitBranch } from 'lucide-react';
import { useTheme } from 'next-themes'
import { autoDoc, generateMermaidDiagram } from './actions';
import mermaid from 'mermaid';

const PromptCard = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const { project } = useProject();
    const [open, setOpen] = React.useState(false);
    const [prompt, setPrompt] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [answer, setAnswer] = React.useState('');
    const [mermaidCode, setMermaidCode] = React.useState('');
    const [showMermaid, setShowMermaid] = React.useState(false);
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

    const downloadMermaidCode = () => {
        if (!mermaidCode) return;
        
        const cleanCode = mermaidCode
            .replace(/```mermaid/g, '')
            .replace(/```/g, '')
            .trim();
            
        const codeBlob = new Blob([cleanCode], { type: 'text/plain' });
        const codeUrl = URL.createObjectURL(codeBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = codeUrl;
        downloadLink.download = `${project?.name || 'diagram'}-mermaid-code.txt`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(codeUrl);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project?.id || !prompt.trim()) return;
        
        setAnswer('');
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
            setAnswer('Sorry, there was an error processing your prompt.');
        } finally {
            setLoading(false);
        }
    }

    const generateDiagram = async () => {
        if (!project?.id) return;
        
        setLoading(true);
        setShowMermaid(false);
        setMermaidCode('');
        setAnswer('');
        setOpen(true);
        
        try {
            const { mermaidCode, error } = await generateMermaidDiagram(project.id, prompt || undefined);
            
            if (error) {
                setAnswer(`Error: ${error}`);
            } else if (mermaidCode) {
                setMermaidCode(mermaidCode);
                setShowMermaid(true);
                setAnswer(''); // Clear any previous text answer
            }
        } catch (error) {
            console.error('Error generating diagram:', error);
            setAnswer('Sorry, there was an error generating the diagram.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[80vw] max-h-[85vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="h-6 w-6" />
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {showMermaid ? 'Sequence Diagram' : 'Documentation'}
                                    </h2>
                                    <p className="text-sm font-normal text-muted-foreground">{project?.name}</p>
                                </div>
                            </div>
                            
                            {showMermaid && mermaidCode && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={downloadSVG}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        SVG
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={downloadMermaidCode}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Code
                                    </Button>
                                </div>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-muted border-t-foreground rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            </div>
                        )}
                        
                        {showMermaid && mermaidCode && (
                            <div className="p-4">
                                <div 
                                    ref={mermaidRef} 
                                    className="flex justify-center items-center bg-white dark:bg-zinc-900 rounded-lg p-4 border"
                                />
                            </div>
                        )}
                        
                        {!showMermaid && answer && (
                            <div className="prose max-w-none p-4">
                                <MDEditor.Markdown 
                                    source={answer} 
                                    className="bg-transparent"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        Prompt Card
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                                className="flex-1"
                            >
                                {loading ? "Processing..." : "Submit Prompt"}
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
        </>
    );
}

export default PromptCard;