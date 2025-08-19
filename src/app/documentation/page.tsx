"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { BookOpen, FileText, Code, Settings, ChevronRight } from "lucide-react";

// Define allowed keys
type DocKey = "introduction" | "installation" | "usage" | "api";

// Define structure of each doc
interface Doc {
  title: string;
  file: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const docsList: Record<DocKey, Doc> = {
  introduction: {
    title: "Introduction",
    file: "/docs/introduction.md",
    icon: BookOpen,
    description: "Getting started with the documentation",
  },
  installation: {
    title: "Installation",
    file: "/docs/installation.md",
    icon: Settings,
    description: "Setup and installation guide",
  },
  usage: {
    title: "Usage",
    file: "/docs/usage.md",
    icon: FileText,
    description: "Learn how to use the features",
  },
  api: {
    title: "API Reference",
    file: "/docs/api_reference.md",
    icon: Code,
    description: "Complete API documentation",
  },
};

export default function DocumentationPage() {
  const [active, setActive] = useState<DocKey>("introduction"); // strictly typed
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(docsList[active].file)
      .then((res) => res.text())
      .then(setContent)
      .finally(() => setIsLoading(false));
  }, [active]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-slate-800 text-lg font-semibold">
                  Documentation
                </h1>
                <p className="text-slate-500 text-sm">
                  Comprehensive guides and references
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 bg-white">
            <div className="space-y-2">
              {(Object.keys(docsList) as DocKey[]).map((key) => {
                const doc = docsList[key];
                const Icon = doc.icon;
                const isActive = active === key;

                return (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`w-full group relative flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium text-sm ${
                          isActive ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {doc.title}
                      </div>
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          isActive ? "text-white/80" : "text-slate-500"
                        }`}
                      >
                        {doc.description}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive
                          ? "text-white rotate-90"
                          : "text-slate-400 group-hover:translate-x-0.5"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-100">
            <div className="text-slate-500 text-xs text-center">
              Professional Documentation v1.0
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50">
          {/* Content Header */}
          <div className="border-b border-slate-200 bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                {(() => {
                  const Icon = docsList[active].icon;
                  return <Icon className="w-5 h-5 text-blue-600" />;
                })()}
              </div>
              <div>
                <h1 className="text-slate-900 text-2xl font-bold">
                  {docsList[active].title}
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  {docsList[active].description}
                </p>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="px-8 py-8">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <div className="p-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div
                    className="prose prose-slate max-w-none
                    prose-headings:text-slate-900
                    prose-p:text-slate-700
                    prose-p:leading-relaxed
                    prose-code:bg-slate-100
                    prose-code:text-blue-600
                    prose-code:px-2
                    prose-code:py-1
                    prose-code:rounded-md
                    prose-code:text-sm
                    prose-pre:bg-slate-900
                    prose-pre:text-slate-100
                    prose-pre:border
                    prose-pre:border-slate-700
                    prose-blockquote:border-l-blue-600
                    prose-blockquote:bg-blue-50
                    prose-blockquote:border-l-4
                    prose-a:text-blue-600
                    prose-a:no-underline
                    hover:prose-a:underline
                    prose-strong:text-slate-900
                    prose-ol:text-slate-700
                    prose-ul:text-slate-700"
                  >
                    {/* ✅ Now with GFM (tables, strikethrough, checkboxes, etc.) */}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
