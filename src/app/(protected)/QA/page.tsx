'use client'

import React from 'react'
import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import { MessageSquare, Calendar, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import AskQuestionCard from '../dashboard/ask-question-card';
import CodeReferences from '../dashboard/code-references';

const QAPage = () => {
  const { projectId } = useProject();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: questions, refetch } = api.project.getQuestions.useQuery({ projectId });
  const deleteQuestion = api.project.deleteQuestion.useMutation();

  const handleDelete = (questionId: string) => {
    deleteQuestion.mutate(
      { questionId },
      {
        onSuccess: () => {
          toast.success("Question deleted successfully");
          refetch();
        },
        onError: () => toast.error("Failed to delete question"),
      }
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <AskQuestionCard />
      
      <div className="space-y-4">
        <h1
          className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? "text-zinc-100" : "text-zinc-900"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          Saved Questions
        </h1>

        <div className="flex flex-col gap-4">
          {!questions || questions.length === 0 ? (
            <Card
        className={`${
            isDark
            ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-md"
            : "bg-white text-zinc-900 border border-zinc-200 shadow-sm"
        } rounded-2xl hover:shadow-lg transition-all duration-200`}
        >

              <CardContent className="pt-6 pb-6 text-center">
                <MessageSquare
                  className={`h-12 w-12 mx-auto mb-4 ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                />
                <p className={`${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                  No saved questions yet. Ask your first question above!
                </p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question) => (
              <Card
                key={question.id}
                className={`${
                  isDark
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-800"
                    : "bg-red-50 text-zinc-900 border border-zinc-200"
                } rounded-2xl shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle
                        className={`text-base font-medium mb-2 ${
                          isDark ? "text-zinc-100" : "text-zinc-900"
                        }`}
                      >
                        {question.question}
                      </CardTitle>
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isDark ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        <Calendar className="h-4 w-4" />
                        {formatDate(question.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`${
                              isDark
                                ? "border-blue-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-600"
                            } rounded-lg transition-all duration-200`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className={`sm:max-w-[80vw] max-h-[85vh] rounded-xl ${
                            isDark
                              ? "bg-zinc-900 border border-zinc-800"
                              : "bg-white border border-zinc-200"
                          }`}
                        >
                          <DialogHeader
                            className={`${
                              isDark
                                ? "border-b border-zinc-800"
                                : "border-b border-zinc-200"
                            } pb-4`}
                          >
                            <DialogTitle
                              className={`${
                                isDark ? "text-white" : "text-zinc-900"
                              }`}
                            >
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                  Question & Answer
                                </h3>
                                <p
                                  className={`text-sm font-normal ${
                                    isDark ? "text-zinc-400" : "text-zinc-500"
                                  }`}
                                >
                                  {question.question}
                                </p>
                              </div>
                            </DialogTitle>
                          </DialogHeader>

                          <div
                            className={`overflow-y-auto max-h-[calc(85vh-120px)] p-4 ${
                              isDark
                                ? "scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700"
                                : "scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300"
                            }`}
                          >
                            {question.answer && (
                              <div
                                className={`prose max-w-none ${
                                  isDark
                                    ? "prose-invert prose-zinc"
                                    : "prose-zinc"
                                }`}
                              >
                                <MDEditor.Markdown
                                  source={question.answer}
                                  className="bg-transparent"
                                  style={{
                                    backgroundColor: "transparent",
                                    color: isDark ? "#e4e4e7" : "#27272a",
                                  }}
                                />
                              </div>
                            )}
                            <div className="h-4" />
                            {question.fileReference && (
                              <CodeReferences
                                fileReferences={question.fileReference}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(question.id)}
                        disabled={deleteQuestion.isPending}
                        className={`${
                          isDark
                            ? "border-red-400 bg-red-900/20 hover:bg-red-900/30 text-red-300"
                            : "border-red-300 bg-red-50 hover:bg-red-100 text-red-600"
                        } rounded-lg transition-all duration-200`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {question.answer && (
                  <CardContent className="pt-0">
                    <div
                      className={`p-4 rounded-xl ${
                        isDark
                          ? "bg-zinc-800 border border-blue-700"
                          : "bg-zinc-50 border border-blue-700"
                      }`}
                    >
                      <p
                        className={`text-sm line-clamp-3 ${
                          isDark ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {question.answer.substring(0, 200)}...
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default QAPage
