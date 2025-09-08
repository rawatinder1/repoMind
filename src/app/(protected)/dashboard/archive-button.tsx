'use client'

import { api } from '@/trpc/react';
import useProject from '@/hooks/use-project';
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();

  const handleArchive = () => {
    const confirmAction = window.confirm("Are you sure you want to archive this project?");
    if (confirmAction) {
      archiveProject.mutate(
        { projectId },
        {
          onSuccess: () => {
            toast.success("Project archived!");
            refetch();
          },
          onError: () => {
            toast.error("Failed to archive project");
          },
        }
      );
    }
  };

  return (
    <Button disabled={archiveProject.isPending}
    onClick={handleArchive}
    size='sm'
    variant='destructive'
    >Archive</Button>
    
  );
};

export default ArchiveButton;