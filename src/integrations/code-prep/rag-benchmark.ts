import "dotenv/config"
import { EmbeddingConfiguration } from "../../shared/embeddings"
import { VectorizeCodeAgent } from "./VectorizeCodeAgent"
import { ICodeIndexProgress } from "./type"
import { HaiBuildDefaults } from "../../shared/haiDefaults"
import { FindFilesToEditAgent } from "./FindFilesToEditAgent"
import path from "node:path"
import { readFileSync } from "node:fs"

const models = [
	{
		enabled: false,
		config: {
			provider: "bedrock",
			modelId: "amazon.titan-embed-text-v1",
			awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
			awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
			awsRegion: process.env.AWS_REGION,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			provider: "bedrock",
			modelId: "amazon.titan-embed-text-v2:0",
			awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
			awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
			awsRegion: process.env.AWS_REGION,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			modelId: "text-embedding-3-small",
			openAiModelId: "text-embedding-3-small",
			provider: "openai",
			openAiBaseUrl: process.env.AZURE_OPENAI_API_ENDPOINT,
			openAiApiKey: process.env.AZURE_OPENAI_API_KEY,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			provider: "openai",
			modelId: "text-embedding-3-large",
			openAiModelId: "text-embedding-3-large",
			openAiBaseUrl: process.env.AZURE_OPENAI_API_ENDPOINT,
			openAiApiKey: process.env.AZURE_OPENAI_API_KEY,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: true,
		config: {
			provider: "ollama",
			modelId: "nomic-embed-text",
			ollamaModelId: "nomic-embed-text",
			ollamaBaseUrl: process.env.OLLAMA_HOST,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			modelId: "mxbai-embed-large",
			ollamaModelId: "mxbai-embed-large",
			provider: "ollama",
			ollamaBaseUrl: process.env.OLLAMA_HOST,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			modelId: "snowflake-arctic-embed",
			ollamaModelId: "snowflake-arctic-embed",
			provider: "ollama",
			ollamaBaseUrl: process.env.OLLAMA_HOST,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			modelId: "bge-m3",
			ollamaModelId: "bge-m3",
			provider: "ollama",
			ollamaBaseUrl: process.env.OLLAMA_HOST,
		} as EmbeddingConfiguration,
		stats: {},
	},
	{
		enabled: false,
		config: {
			modelId: "bge-large",
			ollamaModelId: "bge-large",
			provider: "ollama",
			ollamaBaseUrl: process.env.OLLAMA_HOST,
		} as EmbeddingConfiguration,
		stats: {},
	},
]

const codePath = "/Volumes/Vault/Git/github.com/cline-based-code-generator"

async function prepareCode() {
	for (const model of models) {
		if (!model.enabled) {
			console.log(`Skipping model ${model.config.modelId}`)
			continue
		}
		const start = Date.now()
		const vectorizeCodeAgent = new VectorizeCodeAgent(
			codePath,
			model.config,
			{
				useContext: true,
				useIndex: true,
				appContext: "this is an vscode extension",
				excludeFolders: ".faiss-context*",
				useSyncWithApi: false,
			},
			HaiBuildDefaults.defaultContextDirectory,
			`.faiss-context-${model.config.modelId}`,
		)
		vectorizeCodeAgent.on("progress", async (progress: ICodeIndexProgress) => {
			console.log(progress)
		})
		const result = await vectorizeCodeAgent.start()
		const end = Date.now()
		console.log(`Model ${model.config.modelId} took ${end - start}ms`)
		model.stats = {
			time: end - start,
			tokens: vectorizeCodeAgent.totalTokenConsumed,
		}
	}

	console.log(JSON.stringify(models, null, 2))
}

const tasks = [
	{
		task: "implement a test case to validate extension is activated",
		requiredFiles: ["src/test/suite/extension.test.ts", "src/extension.ts"],
		files: [] as string[],
		stats: {},
	},
	{
		task: "create a new tool to execute shell commands",
		requiredFiles: ["src/integrations/terminal/TerminalProcess.ts", "src/core/prompts/system.ts", "src/core/Cline.ts"],
		files: [],
		stats: {},
	},
	{
		task: "add a security scanner for detecting sensitive files",
		requiredFiles: ["src/integrations/security/code-scan.ts", "src/core/prompts/system.ts", "src/core/Cline.ts"],
		files: [],
		stats: {},
	},
	{
		task: "implement a file system watcher for .gitignore changes",
		requiredFiles: ["src/integrations/workspace/HaiFileSystemWatcher.ts", "src/core/Cline.ts", "src/extension.ts"],
		files: [],
		stats: {},
	},
	{
		task: "implement MCP server connection handling",
		requiredFiles: ["src/services/mcp/McpHub.ts", "src/core/Cline.ts"],
		files: [],
		stats: {},
	},
	{
		task: "add a sliding window mechanism for message history",
		requiredFiles: ["src/core/sliding-window/index.ts"],
		files: [],
		stats: {},
	},
	{
		task: "create a code vectorization progress tracker",
		requiredFiles: ["src/integrations/code-prep/VectorizeCodeAgent.ts"],
		files: [],
		stats: {},
	},
	{
		task: "add command palette integration for quick actions",
		requiredFiles: ["src/extension.ts"],
		files: [],
		stats: {},
	},
	{
		task: "implement VS Code terminal integration with shell detection",
		requiredFiles: ["src/integrations/terminal/TerminalProcess.ts", "src/services/mcp/McpHub.ts", "src/core/Cline.ts"],
		files: [],
		stats: {},
	},
	{
		task: "add workspace file system watcher for live updates",
		requiredFiles: ["src/integrations/workspace/HaiFileSystemWatcher.ts"],
		files: [],
		stats: {},
	},
	{
		task: "create VS Code status bar item for MCP connection status",
		requiredFiles: ["src/services/mcp/McpHub.ts", "src/extension.ts", "src/core/Cline.ts"],
		files: [],
		stats: {},
	},
]

async function benchmark() {
	const result: any = []
	for (const model of models) {
		for (const task of tasks) {
			const start = Date.now()
			const findFilesAgent = new FindFilesToEditAgent(
				codePath,
				{
					apiProvider: "bedrock",
					apiModelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
					awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
					awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
					awsRegion: process.env.AWS_REGION,
				},
				model.config,
				{
					useContext: true,
					useIndex: true,
					appContext: "this is an vscode extension",
					excludeFolders: ".faiss-context*",
					useSyncWithApi: false,
				},
				task.task,
				".hai",
				`.faiss-context-${model.config.modelId}`,
			)
			const relevantFiles = await findFilesAgent.start()
			const end = Date.now()
			const requiredFilenames = task.requiredFiles.map((file) => path.basename(file))
			const actualFilenames = relevantFiles.map((file) => path.basename(file))
			const matches = requiredFilenames.filter((required) => actualFilenames.includes(required))
			const score = {
				matches: matches.length,
				total: task.requiredFiles.length,
				percentage: (matches.length / task.requiredFiles.length) * 100,
				matchedFiles: matches,
			}
			console.log(`Model ${model.config.modelId} took ${end - start}ms`)
			task.files = relevantFiles
			task.stats = {
				time: end - start,
				score: score,
			}
		}
		result.push({
			model: model.config.modelId,
			tasks: JSON.parse(JSON.stringify(tasks)),
		})
	}
	console.log(JSON.stringify(result, null, 2))
}

async function rankModels() {
	const data = JSON.parse(
		readFileSync("/Volumes/Vault/Git/github.com/cline-based-code-generator/embedding-result.json", "utf8"),
	)
	const modelStats = {}

	//@ts-ignore
	data.forEach((modelData) => {
		const model = modelData.model
		const tasks = modelData.tasks

		//@ts-ignore
		const stats = tasks.reduce(
			(acc, task) => {
				acc.totalPercentage += task.stats.score.percentage
				acc.totalTime += task.stats.time
				acc.taskCount++
				return acc
			},
			{
				totalPercentage: 0,
				totalTime: 0,
				taskCount: 0,
			},
		)

		//@ts-ignore
		modelStats[model] = {
			avgPercentage: stats.totalPercentage / stats.taskCount,
			avgTime: stats.totalTime / stats.taskCount,
			model: model,
		}
	})

	const ranked = Object.values(modelStats).sort((a, b) => {
		// @ts-ignore
		if (b.avgPercentage === a.avgPercentage) {
			// @ts-ignore
			return a.avgTime - b.avgTime
		}
		// @ts-ignore
		return b.avgPercentage - a.avgPercentage
	})

	console.log("Model Rankings:\n")
	ranked.forEach((stats, index) => {
		// @ts-ignore
		console.log(`${index + 1}. ${stats.model}`)
		// @ts-ignore
		console.log(`   Avg Success Rate: ${stats.avgPercentage.toFixed(2)}%`)
		// @ts-ignore
		console.log(`   Avg Time: ${stats.avgTime.toFixed(0)}ms\n`)
	})
}

;(async () => {
	// await prepareCode()
	// await benchmark()
	rankModels()
})()
