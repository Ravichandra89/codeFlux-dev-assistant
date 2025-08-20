"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

type Repository = {
  id: string;
  name: string;
  url: string;
  status: string;
  error?: string | null;
};

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");

  // Fetch repositories
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch("/api/repositories");
        const data = await res.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Failed to fetch repositories", err);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Handle Import Repo
  const handleImport = async () => {
    if (!repoUrl.trim()) return;
    try {
      const res = await fetch("/api/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl, branch }),
      });
      if (res.ok) {
        setRepoUrl("");
        const updated = await res.json();
        setRepositories((prev) => [...prev, updated.repository]);
      }
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  // Handle Delete Repo
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/repositories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRepositories((prev) => prev.filter((repo) => repo.id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Import Section */}
      <div className="border p-4 rounded-lg shadow-sm bg-white space-y-3">
        <h2 className="text-lg font-semibold">Import Repository</h2>
        <Input
          placeholder="Enter GitHub repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Input
          placeholder="Branch (default: main)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
        <Button onClick={handleImport} disabled={!repoUrl.trim()}>
          Import
        </Button>
      </div>

      {/* Repositories List */}
      <div className="space-y-4">
        {repositories.length === 0 ? (
          <p>No repositories imported yet.</p>
        ) : (
          repositories.map((repo) => (
            <div
              key={repo.id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white"
            >
              <div>
                <h3 className="font-semibold">{repo.name}</h3>
                <a
                  href={repo.url}
                  className="text-sm text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.url}
                </a>
                <p className="text-sm">Branch: main</p>
                <p
                  className={`text-sm ${
                    repo.status === "READY"
                      ? "text-green-600"
                      : repo.status === "ERROR"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {repo.status}
                </p>
                {repo.error && (
                  <p className="text-sm text-red-500">Error: {repo.error}</p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(repo.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
