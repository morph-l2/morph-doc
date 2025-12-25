import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import styles from './styles.module.css';

// Import support status data
import supportedData from './supported.json';

// ============================================================================
// Support Status Handling
// ============================================================================

// Network identifier type
type NetworkKey = 'mainnet' | 'hoodi' | 'qanet';

// Build method support status map
const methodSupportMap = new Map<string, Record<NetworkKey, boolean>>();
(supportedData as any).methods?.forEach((m: any) => {
  methodSupportMap.set(m.method, {
    mainnet: m.support?.mainnet?.supported ?? false,
    hoodi: m.support?.hoodi?.supported ?? false,
    qanet: m.support?.qanet?.supported ?? false,
  });
});

// Check if method is supported on specified network
function isMethodSupported(methodName: string, network: NetworkKey): boolean {
  const support = methodSupportMap.get(methodName);
  return support ? support[network] : false;
}

// Get network key from network name
function getNetworkKey(networkName: string): NetworkKey {
  const name = networkName.toLowerCase();
  if (name.includes('hoodi')) return 'hoodi';
  if (name.includes('qanet') || name.includes('qa')) return 'qanet';
  return 'mainnet';
}

// ============================================================================
// Type Definitions
// ============================================================================

export type ConnectionMode = 'http' | 'websocket' | 'phoenix';

export interface ApiMethod {
  name: string;
  title?: string;
  icon?: string;
  summary?: string;
  description?: string;
  category?: string;
  params: Array<{
    name: string;
    description?: string;
    required?: boolean;
    type?: string;
    schema?: any;
    defaultValue?: string;
  }>;
  result?: {
    name: string;
    description?: string;
    schema?: any;
  };
  examples?: Array<{
    name: string;
    params: Array<{ name: string; value: any }>;
    result: { name: string; value: any };
  }>;
  // Phoenix Channel specific
  channel?: string;
  event?: string;
  payload?: Record<string, string>;
}

export interface NetworkOption {
  name: string;
  httpUrl?: string;
  wsUrl?: string;
}

export interface ApiExplorerConfig {
  title: string;
  description?: string;
  mode: ConnectionMode;
  networks: NetworkOption[];
  methods: ApiMethod[];
  // Only show supported methods by default
  showOnlySupported?: boolean;
  // Whether to check method availability (default true)
  checkAvailability?: boolean;
  // Code example templates
  codeExamples?: {
    curl?: (method: ApiMethod, url: string, params: any[]) => string;
    morphSdk?: (method: ApiMethod, url: string, params: any[]) => string;
    ethers?: (method: ApiMethod, httpUrl: string, wsUrl: string, params: any[]) => string;
    native?: (method: ApiMethod, url: string, params: any[]) => string;
  };
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'subscribed' | 'error';

// ============================================================================
// WebSocket Connection Classes
// ============================================================================

// Standard Ethereum JSON-RPC WebSocket
class EthRpcConnection {
  private ws: WebSocket | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: (v: any) => void; reject: (e: any) => void }>();
  private subscriptionCallbacks = new Map<string, (data: any) => void>();
  private onStatusChange: (status: ConnectionStatus, error?: string) => void;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentSubscriptionId: string | null = null;

  constructor(onStatusChange: (status: ConnectionStatus, error?: string) => void) {
    this.onStatusChange = onStatusChange;
  }

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onStatusChange('connecting');
      
      this.connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState === WebSocket.CONNECTING) {
          this.ws.close();
          this.onStatusChange('error', 'Connection timeout (10s)');
          reject(new Error('Connection timeout'));
        }
      }, 10000);

      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
        this.onStatusChange('connected');
        resolve();
      };
      
      this.ws.onclose = () => {
        if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
        this.pendingRequests.forEach(({ reject }) => reject(new Error('Connection closed')));
        this.pendingRequests.clear();
        this.subscriptionCallbacks.clear();
        this.currentSubscriptionId = null;
        this.onStatusChange('disconnected');
      };
      
      this.ws.onerror = () => {
        if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
        this.onStatusChange('error', 'Unable to connect to WebSocket server');
        reject(new Error('Connection failed'));
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle subscription push messages
          if (data.method === 'eth_subscription' && data.params?.subscription) {
            const callback = this.subscriptionCallbacks.get(data.params.subscription);
            if (callback) {
              callback(data.params.result);
            }
            return;
          }
          
          // Handle request responses
          if (data.id !== undefined && this.pendingRequests.has(data.id)) {
            const { resolve, reject } = this.pendingRequests.get(data.id)!;
            this.pendingRequests.delete(data.id);
            data.error ? reject(data.error) : resolve(data.result);
          }
        } catch (e) {
          console.error('Message parsing failed:', e);
        }
      };
    });
  }

  request(method: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }
      
      const id = ++this.requestId;
      this.pendingRequests.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }));
      
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout (30s)'));
        }
      }, 30000);
    });
  }

  // Subscribe to newHeads (new blocks)
  async subscribeNewHeads(callback: (blockHeader: any) => void): Promise<string> {
    const subscriptionId = await this.request('eth_subscribe', ['newHeads']);
    this.subscriptionCallbacks.set(subscriptionId, callback);
    this.currentSubscriptionId = subscriptionId;
    this.onStatusChange('subscribed');
    return subscriptionId;
  }

  // Unsubscribe
  async unsubscribe(subscriptionId?: string): Promise<boolean> {
    const id = subscriptionId || this.currentSubscriptionId;
    if (!id) return false;
    
    try {
      const result = await this.request('eth_unsubscribe', [id]);
      this.subscriptionCallbacks.delete(id);
      if (id === this.currentSubscriptionId) {
        this.currentSubscriptionId = null;
      }
      this.onStatusChange('connected');
      return result;
    } catch {
      return false;
    }
  }

  // Check if there is an active subscription
  hasActiveSubscription(): boolean {
    return this.currentSubscriptionId !== null;
  }

  disconnect(): void {
    if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
    this.pendingRequests.forEach(({ reject }) => reject(new Error('Disconnected')));
    this.pendingRequests.clear();
    this.subscriptionCallbacks.clear();
    this.currentSubscriptionId = null;
    this.ws?.close();
    this.ws = null;
    this.onStatusChange('disconnected');
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Phoenix Channel WebSocket (Explorer)
class PhoenixConnection {
  private ws: WebSocket | null = null;
  private ref = 0;
  private channelRef: string | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private onMessage: (data: any) => void;
  private onStatusChange: (status: ConnectionStatus, error?: string) => void;

  constructor(
    onMessage: (data: any) => void,
    onStatusChange: (status: ConnectionStatus, error?: string) => void
  ) {
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
  }

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onStatusChange('connecting');
      
      const wsUrl = url.includes('?') ? `${url}&vsn=2.0.0` : `${url}?vsn=2.0.0`;
      
      const timeout = setTimeout(() => {
        if (this.ws?.readyState === WebSocket.CONNECTING) {
          this.ws.close();
          this.onStatusChange('error', 'Connection timeout (10s)');
          reject(new Error('Connection timeout'));
        }
      }, 10000);

      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.onStatusChange('connected');
        this.startHeartbeat();
        resolve();
      };
      
      this.ws.onclose = () => {
        clearTimeout(timeout);
        this.stopHeartbeat();
        this.onStatusChange('disconnected');
      };
      
      this.ws.onerror = () => {
        clearTimeout(timeout);
        this.onStatusChange('error', 'Unable to connect to WebSocket server');
        reject(new Error('Connection failed'));
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data) && data.length >= 5) {
            const [, , topic, msgEvent, payload] = data;
            
            if (msgEvent === 'phx_reply') {
              if (payload?.status === 'ok' && topic !== 'phoenix') {
                this.onStatusChange('subscribed');
              } else if (payload?.status === 'error') {
                this.onStatusChange('error', `Channel join failed`);
              }
              return;
            }
            
            if (topic === 'phoenix') return;
            
            this.onMessage({ topic, event: msgEvent, payload, timestamp: new Date().toISOString() });
          }
        } catch (e) {
          console.error('Message parsing failed:', e);
        }
      };
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send('phoenix', 'heartbeat', {});
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private send(topic: string, event: string, payload: any, joinRef?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ref++;
    this.ws.send(JSON.stringify([joinRef || null, String(this.ref), topic, event, payload]));
  }

  joinChannel(channel: string): void {
    this.ref++;
    this.channelRef = String(this.ref);
    this.ws?.send(JSON.stringify([this.channelRef, this.channelRef, channel, 'phx_join', {}]));
  }

  leaveChannel(channel: string): void {
    if (this.channelRef) {
      this.send(channel, 'phx_leave', {}, this.channelRef);
      this.channelRef = null;
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.ws?.close();
    this.ws = null;
    this.onStatusChange('disconnected');
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// HTTP RPC Client
async function httpRequest(url: string, method: string, params: any[]): Promise<any> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.result;
}

// ============================================================================
// Subcomponents
// ============================================================================

// Method Menu
function MethodMenu({
  methods,
  selectedMethod,
  onSelect,
  searchTerm,
  onSearchChange,
  currentNetwork,
  filter,
  onFilterChange,
  showFilters = true,
  checkAvailability = true,
}: {
  methods: ApiMethod[];
  selectedMethod: ApiMethod | null;
  onSelect: (method: ApiMethod) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentNetwork: NetworkKey;
  filter: 'all' | 'supported' | 'unsupported';
  onFilterChange: (filter: 'all' | 'supported' | 'unsupported') => void;
  showFilters?: boolean;
  checkAvailability?: boolean;
}) {
  // Calculate number of supported methods
  const supportedCount = useMemo(() => {
    return methods.filter(m => isMethodSupported(m.name, currentNetwork)).length;
  }, [methods, currentNetwork]);

  // Group by category and filter
  const filteredGroups = useMemo((): Record<string, ApiMethod[]> => {
    const groups: Record<string, ApiMethod[]> = {};
    methods.forEach(method => {
      // Search filter
      const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.title?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return;
      
      // Support status filter (only when checkAvailability is true)
      if (checkAvailability) {
        const methodSupported = isMethodSupported(method.name, currentNetwork);
        const matchesFilter = filter === 'all' 
          || (filter === 'supported' && methodSupported)
          || (filter === 'unsupported' && !methodSupported);
        if (!matchesFilter) return;
      }

      const category = method.category || method.name.split('_')[0] || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(method);
    });
    return groups;
  }, [methods, searchTerm, filter, currentNetwork, checkAvailability]);

  const totalFiltered = Object.values(filteredGroups).reduce((sum: number, arr: ApiMethod[]) => sum + arr.length, 0);

  return (
    <div className={styles.menu}>
      <div className={styles.menuSearch}>
        <input
          type="text"
          placeholder="Search methods..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Filter buttons - only shown when showFilters is true */}
      {showFilters && (
        <div className={styles.menuFilters}>
          <button
            className={`${styles.menuFilterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All ({methods.length})
          </button>
          <button
            className={`${styles.menuFilterBtn} ${filter === 'supported' ? styles.active : ''}`}
            onClick={() => onFilterChange('supported')}
          >
            ✓ ({supportedCount})
          </button>
          <button
            className={`${styles.menuFilterBtn} ${filter === 'unsupported' ? styles.active : ''}`}
            onClick={() => onFilterChange('unsupported')}
          >
            ✗ ({methods.length - supportedCount})
          </button>
        </div>
      )}

      {/* Stats - only shown when showFilters is true */}
      {showFilters && (
        <div className={styles.menuStats}>
          <span>{totalFiltered} / {methods.length} methods</span>
        </div>
      )}

      <div className={styles.menuList}>
        {Object.entries(filteredGroups).map(([category, catMethods]: [string, ApiMethod[]]) => (
          <div key={category} className={styles.methodGroup}>
            <div className={styles.groupTitle}>{category}</div>
            {catMethods.map((m: ApiMethod) => {
              const methodSupported = checkAvailability ? isMethodSupported(m.name, currentNetwork) : true;
              return (
                <button
                  key={m.name}
                  className={`${styles.menuItem} ${selectedMethod?.name === m.name ? styles.selected : ''} ${checkAvailability ? (methodSupported ? styles.supported : styles.unsupported) : ''}`}
                  onClick={() => onSelect(m)}
                >
                  {m.icon && <span className={styles.menuItemIcon}>{m.icon}</span>}
                  <span className={styles.menuItemName}>{m.title || m.name}</span>
                  {checkAvailability && (
                    <span className={methodSupported ? styles.menuItemSupported : styles.menuItemUnsupported}>
                      {methodSupported ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
        {totalFiltered === 0 && (
          <div className={styles.menuEmpty}>No matching methods found</div>
        )}
      </div>
    </div>
  );
}

// Playground Component
function MethodPlayground({
  method,
  config,
  network,
  onNetworkChange,
  currentNetwork,
  checkAvailability = true,
}: {
  method: ApiMethod;
  config: ApiExplorerConfig;
  network: NetworkOption;
  onNetworkChange: (network: NetworkOption) => void;
  currentNetwork: NetworkKey;
  checkAvailability?: boolean;
}) {
  // Whether current method is supported on current network (only when checkAvailability is true)
  const isSupported = checkAvailability ? isMethodSupported(method.name, currentNetwork) : true;
  const [activeTab, setActiveTab] = useState<string>('viem');
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [isPolling, setIsPolling] = useState(false);

  const connectionRef = useRef<EthRpcConnection | PhoenixConnection | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stop subscription/polling
  const stopPolling = useCallback(async () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    // Cancel WebSocket subscription
    if (connectionRef.current && connectionRef.current instanceof EthRpcConnection) {
      if ((connectionRef.current as EthRpcConnection).hasActiveSubscription()) {
        await (connectionRef.current as EthRpcConnection).unsubscribe();
      }
    }
    setIsPolling(false);
  }, []);

  // Reset parameters
  useEffect(() => {
    const initial: Record<string, string> = {};
    method.params.forEach(param => {
      initial[param.name] = param.defaultValue || '';
    });
    setParamValues(initial);
    setResponse(null);
    setMessages([]);
    setErrorMessage('');
    stopPolling();
  }, [method.name, stopPolling]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      if (connectionRef.current) {
        connectionRef.current.disconnect();
      }
    };
  }, []);

  const getUrl = () => {
    if (config.mode === 'http') return network.httpUrl || '';
    return network.wsUrl || '';
  };

  // Connect
  const handleConnect = useCallback(async (): Promise<boolean> => {
    setErrorMessage('');
    
    if (connectionRef.current?.isConnected()) return true;
    
    if (connectionRef.current) {
      connectionRef.current.disconnect();
      connectionRef.current = null;
    }

    const url = getUrl();
    if (!url) {
      setErrorMessage('Connection URL not configured');
      return false;
    }

    try {
      if (config.mode === 'phoenix') {
        const conn = new PhoenixConnection(
          (data) => setMessages(prev => [...prev.slice(-19), data]),
          (status, error) => {
            setConnectionStatus(status);
            if (error) setErrorMessage(error);
          }
        );
        connectionRef.current = conn;
        await conn.connect(url);
        
        // Join channel
        if (method.channel) {
          conn.joinChannel(method.channel);
        }
      } else if (config.mode === 'websocket') {
        const conn = new EthRpcConnection((status, error) => {
          setConnectionStatus(status);
          if (error) setErrorMessage(error);
        });
        connectionRef.current = conn;
        await conn.connect(url);
      }
      
      return true;
    } catch (err) {
      return false;
    }
  }, [config.mode, network, method.channel]);

  // Disconnect
  const handleDisconnect = () => {
    if (connectionRef.current) {
      if (config.mode === 'phoenix' && method.channel) {
        (connectionRef.current as PhoenixConnection).leaveChannel(method.channel);
      }
      connectionRef.current.disconnect();
      connectionRef.current = null;
    }
  };

  // Helper function to build parameters
  const buildParams = useCallback(() => {
    const params: any[] = [];
    method.params.forEach(param => {
      const value = paramValues[param.name];
      if (value) {
        try {
          if (value.startsWith('[') || value.startsWith('{') || value === 'true' || value === 'false') {
            params.push(JSON.parse(value));
          } else {
            params.push(value);
          }
        } catch {
          params.push(value);
        }
      }
    });
    return params;
  }, [method.params, paramValues]);

  // Execute single request
  const executeRequest = useCallback(async () => {
    const params = buildParams();
    
    if (config.mode === 'http') {
      return await httpRequest(network.httpUrl!, method.name, params);
    } else if (config.mode === 'websocket') {
      const connected = await handleConnect();
      if (!connected) throw new Error('WebSocket connection failed');
      return await (connectionRef.current as EthRpcConnection).request(method.name, params);
    }
    return null;
  }, [config.mode, network, method.name, buildParams, handleConnect]);

  // Execute request
  const handleTryIt = useCallback(async () => {
    // If subscribing, stop first
    await stopPolling();
    
    setLoading(true);
    setResponse(null);
    setErrorMessage('');

    try {
      if (config.mode === 'phoenix') {
        await handleConnect();
        // Phoenix is subscription mode, no separate request needed
        setResponse('Subscribed, waiting for messages...');
        setLoading(false);
        return;
      }

      // Execute request once to get current result
      const result = await executeRequest();
      setResponse(JSON.stringify(result, null, 2));

      // In WebSocket mode, subscribe to newHeads for real-time updates
      if (config.mode === 'websocket' && connectionRef.current instanceof EthRpcConnection) {
        const conn = connectionRef.current as EthRpcConnection;
        
        try {
          // Subscribe to new block headers
          await conn.subscribeNewHeads(async (blockHeader) => {
            try {
              // Re-execute request when new block arrives
              const newResult = await executeRequest();
              setResponse(JSON.stringify(newResult, null, 2));
            } catch (err: any) {
              console.error('Subscription update failed:', err);
            }
          });
          setIsPolling(true); // Reuse isPolling state to indicate subscription
        } catch (subscribeErr: any) {
          // If subscription fails (node doesn't support), fallback to polling
          console.warn('WebSocket subscription failed, falling back to polling:', subscribeErr.message);
          setIsPolling(true);
          pollingRef.current = setInterval(async () => {
            try {
              const newResult = await executeRequest();
              setResponse(JSON.stringify(newResult, null, 2));
            } catch (err: any) {
              stopPolling();
              setErrorMessage(err.message || 'Polling request failed');
            }
          }, 2000);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Request failed');
      setResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  }, [config.mode, handleConnect, executeRequest, stopPolling]);

  // Code examples
  const params = method.params.map(p => {
    const value = paramValues[p.name];
    if (!value) return null;
    try {
      if (value.startsWith('[') || value.startsWith('{') || value === 'true' || value === 'false') {
        return JSON.parse(value);
      }
    } catch {}
    return value;
  }).filter(v => v !== null);

  const httpUrl = network.httpUrl || '';
  const wsUrl = network.wsUrl || '';

  const codeExamples: Record<string, string> = {
    curl: config.codeExamples?.curl?.(method, httpUrl, params) || 
      `curl -X POST ${httpUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"${method.name}","params":${JSON.stringify(params)},"id":1}'`,
    
    viem: config.codeExamples?.morphSdk?.(method, httpUrl, params) ||
      (config.mode === 'websocket' 
        ? `import { createPublicClient, webSocket } from 'viem';
import { morph } from 'viem/chains';

// Create WebSocket client
const client = createPublicClient({
  chain: morph,
  transport: webSocket('${wsUrl}'),
});

// Single request
const result = await client.request({
  method: '${method.name}',
  params: ${JSON.stringify(params)},
});
console.log('Result:', result);

// Watch for new blocks (real-time updates)
const unwatch = client.watchBlocks({
  onBlock: async (block) => {
    const newResult = await client.request({
      method: '${method.name}',
      params: ${JSON.stringify(params)},
    });
    console.log('Block:', block.number, 'Result:', newResult);
  },
});

// Stop watching
// unwatch();`
        : `import { createPublicClient, http } from 'viem';
import { morph } from 'viem/chains';

const client = createPublicClient({
  chain: morph,
  transport: http('${httpUrl}'),
});

const result = await client.request({
  method: '${method.name}',
  params: ${JSON.stringify(params)},
});
console.log(result);`),

    ethers: config.codeExamples?.ethers?.(method, httpUrl, wsUrl, params) ||
      (config.mode === 'websocket'
        ? `import { ethers } from 'ethers';

// Use WebSocket Provider
const provider = new ethers.WebSocketProvider('${wsUrl}');

// Single request
const result = await provider.send('${method.name}', ${JSON.stringify(params)});
console.log('Result:', result);

// Listen for new blocks (real-time updates)
provider.on('block', async (blockNumber) => {
  const newResult = await provider.send('${method.name}', ${JSON.stringify(params)});
  console.log('Block:', blockNumber, 'Result:', newResult);
});

// Stop listening
// provider.removeAllListeners('block');

// Disconnect
// provider.destroy();`
        : `import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('${httpUrl}');
const result = await provider.send('${method.name}', ${JSON.stringify(params)});
console.log(result);`),

    native: config.codeExamples?.native?.(method, wsUrl, params) ||
      `const ws = new WebSocket('${wsUrl}');

ws.onopen = () => {
  ws.send(JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: '${method.name}',
    params: ${JSON.stringify(params)}
  }));
};

ws.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};`,
  };

  const availableTabs = config.mode === 'http' 
    ? ['curl', 'viem', 'ethers']
    : config.mode === 'phoenix'
      ? ['viem', 'native']
      : ['viem', 'ethers', 'native'];  // WebSocket doesn't need cURL

  const currentCode = codeExamples[activeTab] || codeExamples.viem;

  const copyCode = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = connectionStatus === 'connected' || connectionStatus === 'subscribed';

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'subscribed': return '#22c55e';
      case 'connecting': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'subscribed': return 'Subscribed';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className={styles.playground}>
      {/* Method title */}
      <div className={styles.playgroundHeader}>
        <h2 className={styles.methodTitle}>
          {method.icon && <span>{method.icon}</span>}
          <code>{method.title || method.name}</code>
          {checkAvailability && (
            isSupported ? (
              <span className={styles.supportedBadge}>✓ Supported</span>
            ) : (
              <span className={styles.unsupportedBadge}>✗ Unsupported</span>
            )
          )}
        </h2>
        <p className={styles.methodDesc}>{method.summary || method.description}</p>
      </div>

      <div className={styles.playgroundBody}>
        {/* Left side: Parameters */}
        <div className={styles.playgroundLeft}>
          <div className={styles.paramsSection}>
            <h4 className={styles.sectionTitle}>params</h4>
            {method.params.length === 0 ? (
              <p className={styles.noParams}>This method requires no parameters</p>
            ) : (
              <div className={styles.paramsList}>
                {method.params.map((param, i) => {
                  const currentValue = paramValues[param.name] || '';
                  // Whether current value is JSON format (object or array)
                  const isJsonValue = currentValue.trim().startsWith('{') || currentValue.trim().startsWith('[');
                  // Whether default value is JSON format
                  const defaultIsJson = param.defaultValue?.trim().startsWith('{') || param.defaultValue?.trim().startsWith('[');
                  const useTextarea = isJsonValue || defaultIsJson;
                  
                  return (
                    <div key={i} className={styles.paramItem}>
                      <div className={styles.paramHeader}>
                        <code className={styles.paramName}>{param.name}</code>
                        {param.required && <span className={styles.requiredBadge}>required</span>}
                        {param.type && <span className={styles.paramType}>{param.type}</span>}
                        {useTextarea && <span className={styles.jsonBadge}>JSON</span>}
                      </div>
                      {param.description && <p className={styles.paramDesc}>{param.description}</p>}
                      {useTextarea ? (
                        <textarea
                          className={styles.paramTextarea}
                          placeholder={`Enter JSON for ${param.name}...`}
                          value={currentValue}
                          onChange={(e) => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                          rows={Math.min(10, Math.max(3, currentValue.split('\n').length))}
                        />
                      ) : (
                        <input
                          type="text"
                          className={styles.paramInput}
                          placeholder={`Enter ${param.name}...`}
                          value={currentValue}
                          onChange={(e) => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Result / Payload */}
          {(method.result || method.payload) && (
            <div className={styles.resultSection}>
              <h4 className={styles.sectionTitle}>{method.payload ? 'payload' : 'result'}</h4>
              {method.result && (
                <div className={styles.resultInfo}>
                  <code className={styles.resultName}>{method.result.name}</code>
                  {method.result.description && <p className={styles.resultDesc}>{method.result.description}</p>}
                </div>
              )}
              {method.payload && (
                <div className={styles.payloadList}>
                  {Object.entries(method.payload).map(([key, value]) => (
                    <div key={key} className={styles.payloadItem}>
                      <code className={styles.payloadName}>{key}</code>
                      <span className={styles.payloadType}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Examples */}
          {method.examples && method.examples.length > 0 && (
            <div className={styles.examplesSection}>
              <h4 className={styles.sectionTitle}>examples</h4>
              {method.examples.map((example, i) => (
                <div key={i} className={styles.exampleItem}>
                  <div className={styles.exampleName}>{example.name}</div>
                  
                  {/* Params */}
                  <div className={styles.exampleBlock}>
                    <div className={styles.exampleBlockLabel}>Request Params</div>
                    <pre className={styles.exampleCode}>
                      <code>{JSON.stringify(example.params.map(p => p.value), null, 2)}</code>
                    </pre>
                  </div>
                  
                  {/* Result */}
                  <div className={styles.exampleBlock}>
                    <div className={styles.exampleBlockLabel}>Response</div>
                    <pre className={styles.exampleCode}>
                      <code>{JSON.stringify(example.result.value, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Playground */}
        <div className={styles.playgroundRight}>
          {/* Network selection */}
          <div className={styles.networkSelect}>
            <label>Network:</label>
            <select
              value={network.name}
              onChange={(e) => {
                const n = config.networks.find(net => net.name === e.target.value);
                if (n) onNetworkChange(n);
              }}
              className={styles.urlDropdown}
              disabled={isConnected}
            >
              {config.networks.map((n) => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* WebSocket connection control */}
          {config.mode !== 'http' && (
            <div className={styles.connectionControl}>
              <div className={styles.connectionStatus}>
                <span className={styles.statusDot} style={{ backgroundColor: getStatusColor() }}></span>
                <span className={styles.statusText}>{config.mode === 'phoenix' ? 'Phoenix' : 'WebSocket'}: {getStatusText()}</span>
              </div>
              
              {!isConnected ? (
                <button className={styles.connectBtn} onClick={handleConnect} disabled={connectionStatus === 'connecting'}>
                  {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                </button>
              ) : (
                <button className={styles.disconnectBtn} onClick={handleDisconnect}>Disconnect</button>
              )}
            </div>
          )}

          {/* Try It button */}
          {/* Try It / Stop polling button */}
          <div className={styles.tryItWrapper}>
            <button onClick={handleTryIt} disabled={loading} className={styles.tryItButton}>
              {loading ? 'Loading...' : '▶ Try it'}
            </button>
            {isPolling && (
              <button onClick={stopPolling} className={styles.stopPollingBtn}>
                ⏹ Stop
              </button>
            )}
          </div>
          {isPolling && (
            <div className={styles.pollingIndicator}>
              <span className={styles.pollingDot}></span>
              Real-time subscription (auto-updates on new blocks)
            </div>
          )}

          {/* Error message */}
          {errorMessage && <div className={styles.errorMessage}>⚠️ {errorMessage}</div>}

          {/* Response result */}
          {response && (
            <div className={styles.responseBlock}>
              <div className={styles.responseHeader}><span>📨 Response</span></div>
              <pre className={styles.responseContent}><code>{response}</code></pre>
            </div>
          )}

          {/* Phoenix real-time messages */}
          {config.mode === 'phoenix' && messages.length > 0 && (
            <div className={styles.messagesBlock}>
              <div className={styles.messagesHeader}>
                <span>📨 Real-time Messages ({messages.length})</span>
                <button className={styles.clearBtn} onClick={() => setMessages([])}>Clear</button>
              </div>
              <div className={styles.messagesList}>
                {messages.map((msg, i) => (
                  <div key={i} className={styles.messageItem}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageEvent}>{msg.event}</span>
                      <span className={styles.messageTime}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className={styles.messagePayload}><code>{JSON.stringify(msg.payload, null, 2)}</code></pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code examples */}
          <div className={styles.codeWrapper}>
            <div className={styles.codeTabs}>
              {availableTabs.map(tab => (
                <button
                  key={tab}
                  className={`${styles.codeTab} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'curl' ? 'cURL' : tab === 'viem' ? 'viem' : tab === 'ethers' ? 'ethers.js' : 'Native WS'}
                </button>
              ))}
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>📝 {activeTab === 'curl' ? 'Shell' : 'TypeScript'}</span>
                <button onClick={copyCode} className={styles.copyBtn}>{copied ? '✓ Copied' : '📋 Copy'}</button>
              </div>
              <pre className={styles.codeContent}><code>{currentCode}</code></pre>
            </div>
          </div>

          {/* URL display */}
          <div className={styles.urlDisplay}>
            <div className={styles.urlHeader}><span className={styles.urlLabel}>🔗 Connection Info</span></div>
            <div className={styles.urlContent}>
              {network.httpUrl && (
                <div className={styles.urlRow}>
                  <span className={styles.urlKey}>HTTP:</span>
                  <code className={styles.urlValue} onClick={() => navigator.clipboard.writeText(network.httpUrl!)}>{network.httpUrl}</code>
                </div>
              )}
              {network.wsUrl && (
                <div className={styles.urlRow}>
                  <span className={styles.urlKey}>WebSocket:</span>
                  <code className={styles.urlValue} onClick={() => navigator.clipboard.writeText(network.wsUrl!)}>{network.wsUrl}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ApiExplorer({ config }: { config: ApiExplorerConfig }) {
  // Determine default filter mode based on config
  const defaultFilter = config.showOnlySupported ? 'supported' : 'all';
  
  const [selectedMethod, setSelectedMethod] = useState<ApiMethod>(config.methods[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [network, setNetwork] = useState<NetworkOption>(config.networks[0]);
  const [filter, setFilter] = useState<'all' | 'supported' | 'unsupported'>(defaultFilter);

  // Current network identifier
  const currentNetwork = useMemo(() => getNetworkKey(network.name), [network.name]);

  // When filter results change, check if currently selected method is still in the list
  // Whether to check availability (default true)
  const checkAvailability = config.checkAvailability !== false;

  const filteredMethods = useMemo((): ApiMethod[] => {
    return config.methods.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Only filter by support status when checkAvailability is true
      if (!checkAvailability) return matchesSearch;
      
      const methodSupported = isMethodSupported(m.name, currentNetwork);
      const matchesFilter = filter === 'all' 
        || (filter === 'supported' && methodSupported)
        || (filter === 'unsupported' && !methodSupported);
      return matchesSearch && matchesFilter;
    });
  }, [config.methods, searchTerm, filter, currentNetwork, checkAvailability]);

  // When selected method is not in filtered list, select the first one
  useEffect(() => {
    if (selectedMethod && !filteredMethods.find(m => m.name === selectedMethod.name)) {
      if (filteredMethods.length > 0) {
        setSelectedMethod(filteredMethods[0]);
      }
    }
  }, [filteredMethods, selectedMethod]);

  return (
    <div className={styles.container}>
      <MethodMenu
        methods={config.methods}
        selectedMethod={selectedMethod}
        onSelect={setSelectedMethod}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentNetwork={currentNetwork}
        filter={filter}
        onFilterChange={setFilter}
        showFilters={!config.showOnlySupported}
        checkAvailability={config.checkAvailability !== false}
      />

      <div className={styles.content}>
        <MethodPlayground
          method={selectedMethod}
          config={config}
          network={network}
          onNetworkChange={setNetwork}
          currentNetwork={currentNetwork}
          checkAvailability={config.checkAvailability !== false}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Export Helper Functions
// ============================================================================

export { ApiExplorer };

