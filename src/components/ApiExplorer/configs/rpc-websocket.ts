/**
 * Ethereum RPC WebSocket Mode Configuration
 */
import type { ApiExplorerConfig, ApiMethod } from '../index';
import { MORPH_MAINNET, MORPH_HOODI } from './networks';

// Load methods from openrpc.json
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import openrpcData from '../openrpc.json';
const data = openrpcData as any;

// Get parameter default value from examples
function getExampleValue(method: any, paramName: string, paramIndex: number): string | undefined {
  if (!method.examples || method.examples.length === 0) return undefined;
  
  const firstExample = method.examples[0];
  if (!firstExample.params || firstExample.params.length === 0) return undefined;
  
  // Match by name first, then by index
  const paramByName = firstExample.params.find((p: any) => p.name === paramName);
  const param = paramByName || firstExample.params[paramIndex];
  
  if (!param || param.value === undefined) return undefined;
  
  // Convert value to string, format JSON objects
  if (typeof param.value === 'object') {
    return JSON.stringify(param.value, null, 2);
  }
  return String(param.value);
}

// Parse OpenRPC methods
function parseOpenRpcMethods(): ApiMethod[] {
  return (data.methods as any[]).map(method => {
    const params = method.params.map((p: any, index: number) => {
      if (p.$ref) {
        const refName = p.$ref.split('/').pop();
        const resolved = data.components?.contentDescriptors?.[refName] || {};
        const paramName = resolved.name || refName;
        // Prefer value from example
        const exampleValue = getExampleValue(method, paramName, index);
        return {
          name: paramName,
          description: resolved.description || p.description,
          required: resolved.required || p.required,
          type: getSchemaType(resolved.schema || p.schema),
          defaultValue: exampleValue ?? getDefaultValue(resolved.schema || p.schema),
        };
      }
      // Prefer value from example
      const exampleValue = getExampleValue(method, p.name, index);
      return {
        name: p.name,
        description: p.description,
        required: p.required,
        type: getSchemaType(p.schema),
        defaultValue: exampleValue ?? getDefaultValue(p.schema),
      };
    });

    return {
      name: method.name,
      summary: method.summary,
      description: method.description,
      category: method.name.split('_')[0],
      params,
      result: method.result ? {
        name: method.result.name || 'result',
        description: method.result.description,
      } : undefined,
      examples: method.examples,
    };
  });
}

function getSchemaType(schema: any): string {
  if (!schema) return 'any';
  if (schema.$ref) return schema.$ref.split('/').pop() || 'any';
  return schema.type || 'any';
}

function getDefaultValue(schema: any): string {
  if (!schema) return '';
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    if (refName === 'Address') return '0x742d35Cc6634C0532925a3b844Bc9e7595f00000';
    if (refName === 'BlockNumber') return 'latest';
    if (refName === 'BlockHash' || refName === 'TransactionHash') return '0x' + '0'.repeat(64);
  }
  if (schema.type === 'boolean') return 'false';
  return '';
}

export const rpcWebsocketConfig: ApiExplorerConfig = {
  title: 'MorphNetwork JSON-RPC (WebSocket)',
  description: 'Standard Ethereum JSON-RPC API via WebSocket, supports real-time subscriptions.',
  mode: 'websocket',
  // Only show supported RPC methods by default
  showOnlySupported: true,
  networks: [
    { name: 'Morph Mainnet', httpUrl: MORPH_MAINNET.rpcUrl, wsUrl: MORPH_MAINNET.wsUrl },
    { name: 'Morph Hoodi', httpUrl: MORPH_HOODI.rpcUrl, wsUrl: MORPH_HOODI.wsUrl },
  ],
  methods: parseOpenRpcMethods(),
};
