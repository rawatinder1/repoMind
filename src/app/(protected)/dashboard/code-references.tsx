'use client'

import React from 'react';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, FileText, Code2, Copy, Check } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileReference {
    fileName: string;
    sourceCode: string;
    summary: string;
}

interface CodeReferencesProps {
    fileReferences: FileReference[];
}

const CodeReferences: React.FC<CodeReferencesProps> = ({ fileReferences }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    
    const [openFiles, setOpenFiles] = React.useState<Set<string>>(new Set());
    const [copiedFiles, setCopiedFiles] = React.useState<Set<string>>(new Set());

    const toggleFile = (fileName: string) => {
        const newOpenFiles = new Set(openFiles);
        if (newOpenFiles.has(fileName)) {
            newOpenFiles.delete(fileName);
        } else {
            newOpenFiles.add(fileName);
        }
        setOpenFiles(newOpenFiles);
    };

    const handleCopyCode = async (fileName: string, code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedFiles(prev => new Set([...prev, fileName]));
            setTimeout(() => {
                setCopiedFiles(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(fileName);
                    return newSet;
                });
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const getFileExtension = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        return ext || 'file';
    };

    const getLanguageFromExtension = (fileName: string) => {
        const ext = getFileExtension(fileName);
        const languageMap: { [key: string]: string } = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'css': 'css',
            'html': 'html',
            'json': 'json',
            'xml': 'xml',
            'md': 'markdown',
            'sql': 'sql',
            'sh': 'bash',
            'yml': 'yaml',
            'yaml': 'yaml',
            'v':'verilog',
            'sv':'systemverilog',
            'go':'go',
            'rb':'ruby',
            'php':'php',
            'rs':'rust',
            'swift':'swift',
            'kt':'kotlin',
            'dart':'dart',
            'scala':'scala',
            'hs':'haskell',
            'lua':'lua',
            'r':'r',
            'pl':'perl',
            'groovy':'groovy',
            'makefile':'makefile',
            'dockerfile':'dockerfile',
            'ini':'ini',
            'bat':'batch',
            // Add more mappings as needed  
        };
        return languageMap[ext] || 'text';
    };

    if (!fileReferences.length) {
        return null;
    }

    return (
        <div className="space-y-4">
            {fileReferences.map((fileRef, index) => {
                const isOpen = openFiles.has(fileRef.fileName);
                const language = getLanguageFromExtension(fileRef.fileName);
                
                return (
                    <Card 
                        key={index} 
                        className={`transition-all duration-200 ${
                            isDark 
                                ? "bg-gray-800 border-gray-600 hover:border-gray-500" 
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`w-full p-4 justify-start hover:bg-transparent ${
                                        isDark ? "text-white" : "text-gray-900"
                                    }`}
                                    onClick={() => toggleFile(fileRef.fileName)}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {isOpen ? (
                                            <ChevronDown className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-blue-500" />
                                        )}
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">
                                                    {fileRef.fileName}
                                                </span>
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`text-xs ${
                                                        isDark 
                                                            ? "bg-gray-700 text-gray-300" 
                                                            : "bg-gray-200 text-gray-600"
                                                    }`}
                                                >
                                                    {language}
                                                </Badge>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </Button>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="px-4 pb-4">
                                <div className={`rounded-lg overflow-hidden border ${
                                    isDark ? "border-gray-600" : "border-gray-200"
                                }`}>
                                    {/* Code header */}
                                    <div className={`flex items-center gap-2 px-3 py-2 border-b text-sm font-medium ${
                                        isDark 
                                            ? "bg-gray-700 border-gray-600 text-gray-300" 
                                            : "bg-gray-100 border-gray-200 text-gray-700"
                                    }`}>
                                        <Code2 className="w-4 h-4" />
                                        Source Code
                                    </div>
                                    
                                    {/* Code content */}
                                    <div className={`relative group ${
                                        isDark ? "bg-gray-900" : "bg-white"
                                    }`}>
                                        <SyntaxHighlighter
                                            language={language}
                                            style={isDark ? oneDark : oneLight}
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: 0,
                                                background: 'transparent',
                                                fontSize: '14px',
                                                lineHeight: '1.5'
                                            }}
                                            showLineNumbers={true}
                                            wrapLines={true}
                                            wrapLongLines={true}
                                        >
                                            {fileRef.sourceCode}
                                        </SyntaxHighlighter>
                                        
                                        {/* Copy button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                                                isDark 
                                                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800" 
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                            onClick={() => handleCopyCode(fileRef.fileName, fileRef.sourceCode)}
                                        >
                                            {copiedFiles.has(fileRef.fileName) ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-1" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                );
            })}
        </div>
    );
};

export default CodeReferences;