import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
 import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
 import { z } from "zod";
 
 // Create server instance
 const server = new McpServer({
   name: "teste-cedraz",
   version: "1.0.0",
 });
 
 // Add an addition tool
 server.tool("Somar",
   { a: z.number(), b: z.number() },
   async ({ a, b }) => ({
     content: [{ type: "text", text: `The sum of ${a} and ${b} is ${a + b}` }]
   })
 );
 
 
 const transport = new StdioServerTransport();
 await server.connect(transport);