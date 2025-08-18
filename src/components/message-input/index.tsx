import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Send, Trash2 } from "lucide-react";

interface Repository {
  id: string;
  name: string;
}

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  hasMessages: boolean;
  onClear?: () => void;
  repositories: Repository[];
  selectedRepoId: string | null;
  onSelectedRepoIdChange?: (repoId: string) => void;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  hasMessages,
  onClear,
  repositories,
  selectedRepoId,
  onSelectedRepoIdChange,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const examples = [
    "What's the tech stack?",
    "How to set up the project?",
    "How to deploy the project?",
  ];

  return (
    <div
      className={`${
        hasMessages
          ? "fixed bottom-0 left-0 right-0 z-50 p-4"
          : "w-full max-w-4xl mx-auto"
      }`}
    >
      {hasMessages && (
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
      )}

      <div className={`relative ${hasMessages ? "max-w-4xl mx-auto" : ""}`}>
        {/* Repository selector */}
        {!hasMessages && (
          <div className="mb-4">
            <Select
              value={selectedRepoId || ""}
              onValueChange={(nextRepo) => {
                if (nextRepo) {
                  onSelectedRepoIdChange?.(nextRepo);
                  onClear?.();
                }
              }}
            >
              <SelectTrigger className="w-full max-w-xs bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg">
                <SelectValue placeholder="Select repository" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-md">
                <SelectGroup>
                  <SelectLabel className="text-gray-500">
                    Available repositories
                  </SelectLabel>
                  {repositories.map((repo) => (
                    <SelectItem
                      key={repo.id}
                      value={repo.id}
                      className="hover:bg-blue-50 hover:text-blue-700"
                    >
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Example prompts */}
        {!hasMessages && examples.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  className="p-4 text-left border border-gray-200 rounded-xl hover:bg-blue-50 transition-colors duration-200 bg-gray-50"
                  onClick={() =>
                    handleInputChange({
                      target: { value: example },
                    } as React.ChangeEvent<HTMLTextAreaElement>)
                  }
                >
                  <div className="text-sm text-gray-800">{example}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <Textarea
              placeholder="Message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 resize-none border-0 bg-transparent p-4 pr-12 min-h-[52px] max-h-[200px] focus:outline-none placeholder:text-gray-400 text-gray-800"
              rows={1}
            />

            {/* Send button */}
            <div className="absolute right-2 bottom-2">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="h-8 w-8 p-0 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Clear button */}
          {hasMessages && onClear && (
            <div className="flex justify-center mt-2">
              <Button
                type="button"
                onClick={onClear}
                variant="ghost"
                size="sm"
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-800"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear conversation
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
