export interface TaigaServer {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  lastUsed?: string;
}

export interface ServerConfig {
  servers: TaigaServer[];
  activeServerId: string | null;
}
