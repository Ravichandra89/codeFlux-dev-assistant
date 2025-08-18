import {
    GithubRepoLoader
} from "@langchain/community/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {  GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma, RepositoryStatus, PrismaClient, Document } from "@prisma/client";
import { Document as LangchainDocument } from "langchain/document";
import prisma from '@/lib/prisma';

/**
 * List of paths to ignore when loading documents from GitHub repositories.
 */
const IGNORED_PATHS = [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.github/**",
    "**/.git/**",
    "**/.vscode/**",
    "**/.idea/**",
    "**/.gitignore",
    "**/.npmignore",
    "**/.eslintrc.js",
    "**/tsconfig.json",
    "**/package.json",
    "**/package-lock.json",
    "**/yarn.lock",
    "**/pnpm-lock.yaml"
];

/**
 * Indexer class responsible for loading, processing, and storing documents from a GitHub repository.
 */
export class Indexer {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient = prisma) {
        this.db = db;
    }

    public async run(repoId: string, branch: string = "main") {
        console.log(`[${new Date().toISOString()}] Starting indexing for repository ID: ${repoId}`);

        try {
            const repository = await this.getRepository(repoId);
            const docs = await this.loadDocuments(repository.url, branch);
            const chunks = await this.splitDocuments(docs);

            await this.storeChunks(chunks, repository.id, repository.url);

            console.log(`[${new Date().toISOString()}] Indexing completed successfully for repository ID: ${repoId}`);
        } catch (error) {
            await this.db.repository.update({
                where: { id: repoId },
                data: {
                    error: (error as Error).message,
                    status: RepositoryStatus.ERROR
                }
            });
            console.error(`[${new Date().toISOString()}] Error during indexing for repository ID ${repoId}:`, error);
        }
    }

    private async getRepository(repoId: string) {
        const repository = await this.db.repository.findUnique({
            where: { id: repoId }
        });

        if (!repository) {
            throw new Error(`Repository with ID ${repoId} not found`);
        }

        return repository;
    }

    private async getGithubAccessToken(): Promise<string> {
        const settings = await this.db.storeSettings.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!settings?.githubAccessToken) {
            throw new Error("GitHub access token is required");
        }

        return settings.githubAccessToken;
    }

    private async getGoogleApiKey(): Promise<string> {
        const settings = await this.db.storeSettings.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!settings?.openAiKey) { // You can rename the field in DB if you want
            throw new Error("Google API key is required");
        }

        return settings.openAiKey;
    }

    private async loadDocuments(repoUrl: string, branch: string = "main"): Promise<LangchainDocument[]> {
        const accessToken = await this.getGithubAccessToken();

        const loader = new GithubRepoLoader(repoUrl, {
            branch,
            recursive: true,
            accessToken,
            unknown: "warn",
            maxConcurrency: 5,
            ignorePaths: IGNORED_PATHS
        });

        const docs: LangchainDocument[] = [];
        for await (const doc of loader.loadAsStream()) {
            docs.push(doc);
        }

        console.log(`[${new Date().toISOString()}] Loaded ${docs.length} documents from ${repoUrl}`);
        return docs;
    }

    private async splitDocuments(docs: LangchainDocument[]): Promise<LangchainDocument[]> {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 200
        });

        const chunks = await splitter.splitDocuments(docs);
        console.log(`[${new Date().toISOString()}] Split into ${chunks.length} chunks`);
        return chunks;
    }

    private async storeChunks(chunks: LangchainDocument[], namespaceId: string, repoUrl: string) {
        console.log(`[${new Date().toISOString()}] Storing ${chunks.length} chunks into the vector store`);

        const apiKey = await this.getGoogleApiKey();

        // Use Google Gemini embeddings
        const embeddings = new GoogleGenerativeAIEmbeddings({
            model: "embedding-001",
            apiKey
        });

        const vectorStore = PrismaVectorStore.withModel<Document>(this.db).create(
            embeddings,
            {
                prisma: Prisma,
                tableName: "Document",
                vectorColumnName: "vector",
                columns: {
                    id: PrismaVectorStore.IdColumn,
                    content: PrismaVectorStore.ContentColumn
                }
            }
        );

        try {
            // Delete existing documents with the same namespaceId
            await this.db.document.deleteMany({
                where: { namespaceId }
            });
            console.log(`[${new Date().toISOString()}] Deleted existing documents in namespace: ${namespaceId}`);

            // Create new document records with the correct namespaceId
            const createPromises = chunks.map(chunk =>
                this.db.document.create({
                    data: {
                        content: sanitizeString(chunk.pageContent),
                        namespaceId
                    }
                })
            );

            const createdDocs = await this.db.$transaction(createPromises);
            console.log(`[${new Date().toISOString()}] Created ${createdDocs.length} document records`);

            // Add the created documents to the vector store
            await vectorStore.addModels(createdDocs);
            console.log(`[${new Date().toISOString()}] Added models to the vector store`);

            // Update repository status
            await this.db.repository.update({
                where: { url: repoUrl },
                data: { status: RepositoryStatus.IMPORTED, error: null }
            });
            console.log(`[${new Date().toISOString()}] Updated repository status to IMPORTED for URL: ${repoUrl}`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error storing chunks for namespace ${namespaceId}:`, error);

            // Update repository status to NOT_STARTED
            await this.db.repository.update({
                where: { url: repoUrl },
                data: { status: RepositoryStatus.NOT_STARTED }
            });
            console.log(`[${new Date().toISOString()}] Updated repository status to NOT_STARTED for URL: ${repoUrl}`);

            throw error;
        }
    }
}

function sanitizeString(input: string): string {
    return input.replace(/\0/g, ''); // Removes all null bytes
}
