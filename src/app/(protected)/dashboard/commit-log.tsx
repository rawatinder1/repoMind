'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, GitCommit } from 'lucide-react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { motion } from 'motion/react'

interface Commit {
    id: string;
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    summary?: string;
    createdAt: Date;
}

const CommitLog = () => {
    const { projectId, project } = useProject();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [forceRender, setForceRender] = useState(0);
    
    const { data: commits } = api.project.getCommits.useQuery({
        projectId
    }) as { data?: Commit[] };

    // Force re-render when theme changes
    useEffect(() => {
        setForceRender(prev => prev + 1);
    }, [resolvedTheme]);

    if (!commits || commits.length === 0) {
        return (
            <div className={cn(
                "flex flex-col items-center justify-center py-12 rounded-lg border-2 border-dashed",
                isDark ? "border-zinc-700 bg-zinc-800/50" : "border-gray-300 bg-gray-50"
            )}>
                <GitCommit className={cn(
                    "h-12 w-12 mb-4",
                    isDark ? "text-zinc-600" : "text-gray-400"
                )} />
                <p className={cn(
                    "text-lg font-medium",
                    isDark ? "text-zinc-300" : "text-gray-600"
                )}>
                    No commits found
                </p>
                <p className={cn(
                    "text-sm mt-1",
                    isDark ? "text-zinc-500" : "text-gray-500"
                )}>
                    Commits will appear here once your project is analyzed
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-current to-transparent opacity-20" 
                 style={{ 
                     color: isDark ? '#60a5fa' : '#3b82f6' 
                 }} 
            />
            
            <div className="antialiased pt-4 relative">
                {commits.map((commit: Commit, commitIdx: number) => (
                    <motion.div 
                        key={`${commit.id}-${forceRender}`} 
                        className="mb-8 pl-16 relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: commitIdx * 0.1 }}
                        whileHover={{
                            y: -8,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {/* Timeline Dot */}
                        <div className={cn(
                            "absolute left-6 top-6 w-3 h-3 rounded-full border-2 -translate-x-1/2 z-10",
                            isDark 
                                ? "bg-zinc-800 border-blue-400" 
                                : "bg-white border-blue-500"
                        )}
                        style={{
                            filter: isDark ? 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'none'
                        }} />

                        {/* Commit Badge */}
                        <div className={cn(
                            "inline-flex items-center gap-2 rounded-full text-xs font-medium px-3 py-1 mb-4",
                            isDark 
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                        )}>
                            <GitCommit className="h-3 w-3" />
                            Commit {commits.length - commitIdx}
                        </div>

                        {/* Author and External Link */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={commit.commitAuthorAvatar}
                                alt={`${commit.commitAuthorName} avatar`}
                                className={cn(
                                    "size-10 rounded-full shadow-sm border-2",
                                    isDark ? "border-zinc-600" : "border-white"
                                )}
                            />
                            <div className="flex-1">
                                <Link
                                    target='_blank'
                                    href={`${project?.githubUrl}`}
                                    className={cn(
                                        "inline-flex items-center gap-1 text-sm font-medium hover:underline transition-colors duration-200",
                                        isDark ? "text-zinc-100 hover:text-blue-300" : "text-zinc-900 hover:text-blue-600"
                                    )}
                                >
                                    {commit.commitAuthorName}
                                    <ExternalLink className='h-4 w-4' />
                                </Link>
                                <p className={cn(
                                    "text-xs",
                                    isDark ? "text-zinc-400" : "text-zinc-600"
                                )}>
                                    {new Date(commit.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Commit Content */}
                        <motion.div 
                            className={cn(
                                "rounded-xl p-6 border transition-all duration-300 cursor-pointer",
                                isDark 
                                    ? "bg-zinc-800/50 border-zinc-700" 
                                    : "bg-white border-gray-200"
                            )}
                            whileHover={{
                                boxShadow: isDark 
                                    ? "0 25px 50px rgba(255, 165, 0, 0.4), 0 10px 20px rgba(255, 165, 0, 0.3), 0 0 0 1px rgba(255, 165, 0, 0.2)"
                                    : "0 25px 50px rgba(255, 165, 0, 0.3), 0 10px 20px rgba(255, 165, 0, 0.25), 0 0 0 1px rgba(255, 107, 53, 0.3)",
                                borderColor: isDark ? "rgba(255, 165, 0, 0.3)" : "rgba(255, 107, 53, 0.4)",
                                backgroundColor: isDark ? "rgba(39, 39, 42, 0.8)" : "rgba(255, 255, 255, 0.95)",
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Commit Message */}
                            <h3 className={cn(
                                "font-semibold text-lg mb-3 leading-relaxed",
                                isDark ? "text-zinc-100" : "text-zinc-900"
                            )}>
                                {commit.commitMessage}
                            </h3>

                            {/* Commit Summary */}
                            {commit.summary && (
                                <div>
                                    <pre className={cn(
                                        "whitespace-pre-wrap font-sans text-sm leading-relaxed p-4 rounded-lg border",
                                        isDark 
                                            ? "bg-zinc-900/50 border-zinc-600 text-zinc-300" 
                                            : "bg-gray-50 border-gray-200 text-gray-700"
                                    )}>
                                        {commit.summary}
                                    </pre>
                                </div>
                            )}

                            {/* Commit Hash */}
                            <div className={cn(
                                "mt-4 pt-4 border-t",
                                isDark ? "border-zinc-700" : "border-gray-200"
                            )}>
                                <code className={cn(
                                    "text-xs font-mono px-2 py-1 rounded",
                                    isDark 
                                        ? "bg-zinc-700 text-zinc-300" 
                                        : "bg-gray-100 text-gray-600"
                                )}>
                                    {commit.commitHash.substring(0, 8)}
                                </code>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CommitLog;