'use client'
import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
const CommitLog = () => {
    const { projectId, project } = useProject();
    const {resolvedTheme} = useTheme();
    const isDark = resolvedTheme === "dark"? true:false;
    
    const { data: commits } = api.project.getCommits.useQuery({
        projectId
    });

    return (
                <ul className='space-y-6'>
            {commits?.map((commit: any, commitIdx: number) => {
                return (
                    <li key={commit.id} className="relative flex gap-x-4">
                        <div className={cn(
                            commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6',
                            'absolute left-0 top-0 flex w-6 justify-center'
                        )}>
                            <div className={cn(
                                'w-px translate-x-1',
                                isDark ? 'bg-gray-600' : 'bg-gray-200'
                            )}></div>
                        </div>

                        <img
                            src={commit.commitAuthorAvatar}
                            alt='commit avatar'
                            className={cn(
                                'relative mt-4 size-8 flex-none rounded-full',
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            )}
                        />

                        <div className={cn(
                            'flex-auto rounded-md p-3 ring-1 ring-inset',
                            isDark 
                                ? 'bg-gray-800 ring-gray-600' 
                                : 'bg-orange-50 ring-gray-200'
                        )}>
                            <div className='flex justify-between gap-x-4'>
                                <Link
                                    target='_blank'
                                    href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                                    className='py-0.5 text-xs leading-5'
                                >
                                    <span className={cn(
                                        'font-medium',
                                        isDark ? 'text-gray-100' : 'text-gray-900'
                                    )}>
                                        {commit.commitAuthorName}
                                    </span>
                                    {" "}
                                    <span className={cn(
                                        'inline-flex items-center',
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    )}>
                                        committed
                                        <ExternalLink className='ml-1 size-4' />
                                    </span>
                                </Link>
                            </div>
                            <div>
                                <span className={cn(
                                    'font-semibold block mt-2',
                                    isDark ? 'text-gray-100' : 'text-gray-900'
                                )}>
                                    {commit.commitMessage}
                                </span>

                                <pre className={cn(
                                    'mt-2 whitespace-pre-wrap text-sm leading-6',
                                    isDark ? 'text-gray-300' : 'text-gray-500'
                                )}>
                                    {commit.summary}
                                </pre>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default CommitLog;