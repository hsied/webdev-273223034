import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import readline from 'node:readline';

const here = dirname(fileURLToPath(import.meta.url));
const lectures = JSON.parse(readFileSync(join(here, 'lectures.json'), 'utf8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendJson(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }

  const { id, method, params } = msg;

  if (method === 'initialize') {
    sendJson({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2025-11-25',
        serverInfo: { name: 'club-events-mcp', version: '1.0.0' },
        capabilities: { tools: {} }
      }
    });
    return;
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    sendJson({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'find_lecture',
            description: 'Search and return the title and topics of a specific course lecture by its number from 1 to 10.',
            inputSchema: {
              type: 'object',
              properties: {
                number: { type: 'number', description: 'Lecture number between 1 and 10' }
              },
              required: ['number']
            }
          },
          {
            name: 'upcoming_events',
            description: 'List all upcoming university club events with remaining seat counts, dates, locations, and category tags.',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      }
    });
    return;
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName === 'find_lecture') {
      const lectureNum = Number(args.number);
      const found = lectures.find((l) => l.number === lectureNum);

      if (!found) {
        sendJson({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `Lecture number ${lectureNum} does not exist. Choose between 1 and 10.` }],
            isError: true
          }
        });
      } else {
        sendJson({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(found) }]
          }
        });
      }
      return;
    }

    if (toolName === 'upcoming_events') {
      sendJson({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify([{ id: '1', title: 'Python Coding Workshop', capacity: 30, registered: 12 }]) }]
        }
      });
      return;
    }

    sendJson({
      jsonrpc: '2.0',
      id,
      error: { code: -32602, message: `Unknown tool: ${toolName}` }
    });
    return;
  }

  if (id !== undefined) {
    sendJson({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` }
    });
  }
});