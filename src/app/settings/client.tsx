"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EyeIcon, EyeOffIcon, KeyIcon } from "lucide-react";

interface ConfigurationFormProps {
  openAiKey?: string;
  githubAccessToken?: string;
}

export function ConfigurationForm({
  openAiKey,
  githubAccessToken,
}: ConfigurationFormProps) {
  const [openAiKeyValue, setOpenAiKeyValue] = useState<string>(openAiKey ?? "");
  const [githubToken, setGithubToken] = useState<string>(
    githubAccessToken ?? ""
  );
  const [showOpenAiKey, setShowOpenAiKey] = useState<boolean>(false);
  const [showGithubKey, setShowGithubKey] = useState<boolean>(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        openAiKey: openAiKeyValue,
        githubAccessToken: githubToken,
      }),
    });

    if (!response.ok) {
      toast({ title: "Error", description: "Failed to save API keys." });
      return;
    }

    toast({
      title: "Success",
      description: "API keys saved successfully.",
      variant: "default",
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full mb-4 shadow-md">
          <KeyIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          API Configuration
        </h2>
        <p className="text-gray-500">
          Configure your API keys to get started with codeFlux
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* OpenAI API Key */}
        <div className="space-y-4">
          <Label
            htmlFor="openai-key"
            className="text-lg font-semibold text-gray-800"
          >
            OpenAI API Key
          </Label>
          <Input
            id="openai-key"
            type={showOpenAiKey ? "text" : "password"}
            placeholder="Enter your OpenAI API key"
            value={openAiKeyValue}
            onChange={(e) => setOpenAiKeyValue(e.target.value)}
            className="pr-12 h-12 bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            onClick={() => setShowOpenAiKey(!showOpenAiKey)}
          >
            {showOpenAiKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* GitHub API */}
        <div className="space-y-4">
          <Label
            htmlFor="github-key"
            className="text-lg font-semibold text-gray-800"
          >
            GitHub Access Token
          </Label>
          <Input
            id="github-key"
            type={showGithubKey ? "text" : "password"}
            placeholder="Enter your GitHub Access Token"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            className="pr-12 h-12 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            onClick={() => setShowGithubKey(!showGithubKey)}
          >
            {showGithubKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-purple-500 hover:to-indigo-500 shadow-md transition-all duration-300 font-semibold"
          >
            Save Configuration
          </Button>
          <Link href="/repositories">
            <Button
              type="button"
              className="w-full h-12 bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-600 hover:text-white shadow transition-all duration-300 font-semibold"
            >
              Continue to Repositories
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
