import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z, ZodError } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// Create server instance
const server = new Server({
  name: "teste-cedraz",
  version: "1.0.0",
},
{
  capabilities: {
    tools: {},
  }
});

const addTool = z.object({
  number1: z.number(),
  number2: z.number(),
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "soma",
        description: "Adiciona dois números",
        inputSchema: zodToJsonSchema.default(addTool),
      }
    ]
  };
});


server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try{
    if(!request.params.arguments) throw new Error("No arguments provided");

    switch(request.params.name){
      case "soma":
        const args = addTool.parse(request.params.arguments);
        const result = args.number1 + args.number2;
        return {
          content: [{ type: "text", text: `The sum of ${args.number1} and ${args.number2} is ${result}` }]
        }
        default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  }
  catch(error){
    if(error instanceof ZodError){
      return {
        content: [{ type: "text", text: `Invalid input ${JSON.stringify(error.errors)}` }]
      }
    }
    throw error;
  }
});


async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cedraz MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
