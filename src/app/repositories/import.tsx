'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface ImportProps {
  onImport: ({
    url,
    branch
  }: {
    url: string;
    branch: string;
  }) => void
}

export function Import({ onImport }: ImportProps) {
  const [repoUrl, setRepoUrl] = React.useState<string>('');
  const [branch, setBranch] = React.useState<string>('main');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast()

  const handleImport = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      })
      return
    }

    if (isLoading) return;

    try {
      setIsLoading(true)

      onImport({
        url: repoUrl,
        branch,
      });

      setRepoUrl('')

      toast({
        title: "Success",
        description: "Repository import started. It may take a few minutes.",
      });
    } catch (e) {
      const error = e as { message: string; status?: number };

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Import GitHub Repository
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
        <Input
          type="text"
          disabled={isLoading}
          placeholder="GitHub repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1 h-12 bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-100 rounded-md transition-all duration-300"
        />
        <Input
          type="text"
          disabled={isLoading}
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-28 h-12 bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-100 rounded-md transition-all duration-300"
        />
        <Button
          disabled={isLoading}
          onClick={handleImport}
          className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 rounded-md flex-shrink-0"
        >
          {isLoading ? 'Importing...' : 'Import'}
        </Button>
      </div>
      <p className="mt-3 text-sm text-gray-500 text-center">
        Enter the GitHub repository URL and branch to start importing.
      </p>
    </div>
  );
}
