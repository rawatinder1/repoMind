'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import useProject from '@/hooks/use-project';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { askQuestion } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';
import { X } from 'lucide-react';
import { Image } from 'lucide-react';
import {useTheme} from 'next-themes'
import CodeReferences from './code-references'
import { api } from "@/trpc/react";
import { Save } from 'lucide-react';

import { toast } from 'sonner';
// Sleek animated logo component
const AnimatedNeuronLogo = ({ size = 40 }: { size?: number }) => {
    return (
        <div 
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Outer rotating ring */}
            <div 
                className="absolute border-2 border-blue-500/30 rounded-full animate-spin"
                style={{ 
                    width: size, 
                    height: size,
                    animationDuration: '3s'
                }}
            />
            
            {/* Middle pulsing ring */}
            <div 
                className="absolute border-2 border-purple-500/40 rounded-full animate-pulse"
                style={{ 
                    width: size * 0.75, 
                    height: size * 0.75 
                }}
            />
            
            {/* Inner core with gradient */}
            <div 
                className="absolute bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse"
                style={{ 
                    width: size * 0.5, 
                    height: size * 0.5,
                    animationDuration: '2s'
                }}
            />
            
            {/* Orbiting particles */}
            <div 
                className="absolute"
                style={{ width: size, height: size }}
            >
                <div 
                    className="absolute w-1 h-1 bg-blue-400 rounded-full animate-spin"
                    style={{
                        top: '10%',
                        left: '50%',
                        transformOrigin: `0 ${size * 0.4}px`,
                        animationDuration: '2s'
                    }}
                />
                <div 
                    className="absolute w-1 h-1 bg-purple-400 rounded-full animate-spin"
                    style={{
                        top: '50%',
                        right: '10%',
                        transformOrigin: `${-size * 0.4}px 0`,
                        animationDuration: '1.5s',
                        animationDirection: 'reverse'
                    }}
                />
                <div 
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-spin"
                    style={{
                        bottom: '10%',
                        left: '30%',
                        transformOrigin: `${size * 0.2}px ${-size * 0.3}px`,
                        animationDuration: '2.5s'
                    }}
                />
            </div>
        </div>
    );
};

const AskQuestionCard = () => {
    const {resolvedTheme} = useTheme();
    const isDark = resolvedTheme === "dark"? true:false;
    const saveAnswer = api.project.saveAnswer.useMutation();
    const { project } = useProject();
    const [open, setOpen] = React.useState(false);
    const [question, setQuestion] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [fileReferences, setFileReferences] = React.useState<{
        fileName: string;
        sourceCode: string;
        summary: string;
    }[]>([]);
    const [answer, setAnswer] = React.useState('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFileReferences([]);
        e.preventDefault();
        if (!project?.id) return;
        
        setLoading(true);
       
        try {
            const { output, fileReferences: refs } = await askQuestion(project.id, question);
            setOpen(true);
            setFileReferences(refs);

            for await (const chunk of readStreamableValue(output)) {
                if (chunk) {
                    setAnswer((ans) => ans + chunk);
                }
            }
        } catch (error) {
            console.error('Error asking question:', error);
            setAnswer('Sorry, there was an error processing your question.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={`sm:max-w-[80vw] max-h-[85vh] ${
                    isDark 
                        ? "bg-zinc-900 border border-zinc-800" 
                        : "bg-red-50 border-green-200"
                } backdrop-blur-xl`}>
                    <DialogHeader className={`${
                        isDark 
                            ? "border-b border-zinc-800" 
                            : "border-b border-zinc-200"
                    } pb-4`}>
                        <DialogTitle className={`flex items-center justify-between ${
                            isDark ? "text-white" : "text-zinc-900"
                        }`}>
                            <div className="flex items-center gap-3">
                                <AnimatedNeuronLogo size={40} />
                                <div>
                                    <h2 className="text-lg font-semibold">AI Assistant Response</h2>
                                    <p className={`text-sm font-normal ${
                                        isDark ? "text-zinc-400" : "text-zinc-500"
                                    }`}>{project?.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    disabled={saveAnswer.isPending || loading}
                                    onClick={() => {
                                        if (!project) return

                                        saveAnswer.mutate(
                                        {
                                            projectId: project.id,
                                            question,
                                            answer,
                                            fileReferences: fileReferences ?? null,
                                        },
                                        {
                                            onSuccess: () => toast.success("Answer saved successfully"),
                                            onError: () => toast.error("Failed to save the answer"),
                                        }
                                        )
                                    }}
                                    className={`${
                                        isDark 
                                            ? "border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white" 
                                            : "border-zinc-300 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                                    } transition-all duration-200`}
                                    >
                                    <Save className="h-4 w-4" /> {/* small save icon */}
                                    </Button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className={`overflow-y-auto max-h-[calc(85vh-120px)] ${
                        isDark 
                            ? "scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600" 
                            : "scrollbar-thin scrollbar-track-zinc-200 scrollbar-thumb-zinc-400"
                    }`}>
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-3">
                                    <AnimatedNeuronLogo size={24} />
                                    <span className={`${
                                        isDark ? "text-zinc-300" : "text-zinc-600"
                                    }`}>Processing your question...</span>
                                </div>
                            </div>
                        )}
                        
                        {answer && (
                            <div className={`prose max-w-none p-4 ${
                                isDark 
                                    ? "prose-invert prose-zinc" 
                                    : "prose-zinc"
                            }`}>
                                <MDEditor.Markdown 
                                    source={answer} 
                                    className={`bg-transparent ${
                                        isDark ? "text-zinc-200" : "text-zinc-800"
                                    }`}
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        color: isDark ? '#e4e4e7' : '#27272a'
                                    }}
                                />
                            </div>
                        )}
                        <div className="h-4"></div>
                        <CodeReferences fileReferences={fileReferences} />
                        
                    </div>
                    
                    <div className={`${
                        isDark 
                            ? "border-t border-zinc-800" 
                            : "border-t border-zinc-200"
                    } pt-4`}>
                       
                    </div>
                </DialogContent>
            </Dialog>
            
           <Card
  className={`relative col-span-3 transition-colors duration-300 ${
    !isDark 
        ? "bg-zinc-900 text-zinc-100 border-zinc-800" 
        : "bg-zinc-800 text-zinc-900 border-zinc-800"
  } rounded-2xl shadow-2xl border backdrop-blur-xl`}
>
  <CardHeader>
    <CardTitle
      className={`flex items-center gap-3 font-semibold text-lg ${
        !isDark ? "text-zinc-100" : "text-white"
      }`}
    >
      <AnimatedNeuronLogo size={32} />
      Ask a Question
    </CardTitle>
  </CardHeader>
  <CardContent>
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Textarea
        placeholder="Which file should I edit to change the home page?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
        className={`min-h-[100px] resize-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 ${
          !isDark
            ? "bg-zinc-800 text-zinc-100 placeholder-zinc-400 border border-zinc-700 focus:ring-zinc-500 focus:border-zinc-500"
            : "bg-zinc-50 text-zinc-900 placeholder-zinc-500 border border-zinc-300 focus:ring-zinc-400 focus:border-zinc-400"
        }`}
      />
      <div className="h-4"></div>
      <Button
        type="submit"
        disabled={loading || !question.trim()}
        className={`rounded-xl py-2 px-4 font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
          isDark
            ? "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500 border border-zinc-300"
            : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500"
        }`}
      >
        {loading && <AnimatedNeuronLogo size={16} />}
        {loading ? "Processing..." : "Ask anything about the code base!"}
      </Button>
    </form>
  </CardContent>
</Card>

        </>
    );
}

export default AskQuestionCard;