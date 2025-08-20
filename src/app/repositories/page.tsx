import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { RepoPage } from "./index";

export const dynamic = "force-dynamic";

export default async function ReposPage() {
  const settings = await prisma.storeSettings.findFirst();

  if (!settings?.openAiKey || !settings?.githubAccessToken) {
    redirect("/settings");
  }

  const list = await prisma.repository.findMany();

  return (
    <div className="w-full flex justify-center">
      <div className="flex justify-stretch max-w-3xl w-full">
        <RepoPage list={list || []} />
      </div>
    </div>
  );
}
