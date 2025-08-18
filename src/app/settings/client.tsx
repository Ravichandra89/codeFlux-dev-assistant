"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EyeIcon, EyeOffIcon, KeyIcon, Github } from "lucide-react";

interface ConfigurationFormProps {
  googleGeminiKey?: string;
  githubAccessToken?: string;
}

export function ConfigurationForm(props: ConfigurationFormProps) {
  const [googleGeminiKey, setGoogleGeminiKey] = useState<string>(
    props.googleGeminiKey ?? ""
  );
  const [githubAccessToken, setGithubAccessToken] = useState<string>(
    props.githubAccessToken ?? ""
  );
  const [showGeminiKey, setShowGeminiKey] = useState<boolean>(false);
  const [showGithubKey, setShowGithubKey] = useState<boolean>(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleGeminiKey, githubAccessToken }),
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
        {/* Google Gemini API */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <KeyIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <Label
                htmlFor="gemini-key"
                className="text-lg font-semibold text-gray-800"
              >
                Google Gemini API Key
              </Label>
              <p className="text-sm text-gray-500">
                Required for AI-powered features
              </p>
            </div>
          </div>
          <div className="relative group">
            <Input
              id="gemini-key"
              type={showGeminiKey ? "text" : "password"}
              placeholder="Enter your Google Gemini API key"
              value={googleGeminiKey}
              onChange={(e) => setGoogleGeminiKey(e.target.value)}
              className="pr-12 h-12 bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300"
              required
              minLength={32}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowGeminiKey(!showGeminiKey)}
            >
              {showGeminiKey ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              Your API key is stored securely and used for indexing and AI
              requests.
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Get your API key from </span>
              <a
                href="https://developers.google.com/vertex-ai/docs/generative-ai/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 hover:no-underline transition-all"
              >
                Google Gemini API
              </a>
            </p>
          </div>
        </div>

        {/* GitHub API */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Github className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <Label
                htmlFor="github-key"
                className="text-lg font-semibold text-gray-800"
              >
                GitHub Access Token
              </Label>
              <p className="text-sm text-gray-500">
                Required for repository access
              </p>
            </div>
          </div>
          <div className="relative group">
            <Input
              id="github-key"
              type={showGithubKey ? "text" : "password"}
              placeholder="Enter your GitHub Access Token"
              value={githubAccessToken}
              onChange={(e) => setGithubAccessToken(e.target.value)}
              className="pr-12 h-12 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
              required
              minLength={40}
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
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              Your token is stored securely and used for cloning repositories.
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Create a token at </span>
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2 hover:no-underline transition-all"
              >
                GitHub Settings
              </a>
            </p>
          </div>
        </div>

        {/* Buttons */}
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
