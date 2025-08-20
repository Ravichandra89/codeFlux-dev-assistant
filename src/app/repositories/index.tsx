"use client";

import React from "react";

type Repository = {
  error: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  url: string;
  status: string; // or $Enums.RepositoryStatus if you want exact type
};

interface RepoPageProps {
  list: Repository[];
}

export default function RepoPage({ list }: RepoPageProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {list.length === 0 ? (
        <p className="text-gray-500">No repositories found.</p>
      ) : (
        list.map((repo) => (
          <div
            key={repo.id}
            className="p-3 border rounded-lg shadow-sm flex flex-col"
          >
            <h2 className="text-lg font-semibold">{repo.name}</h2>
            <p className="text-sm text-gray-600">{repo.url}</p>
            <p className="text-xs text-gray-400">Status: {repo.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
