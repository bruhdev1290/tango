import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaigaServer, ServerConfig } from '../models/server.model';

const SERVER_CONFIG_KEY = 'taiga_server_config';
const DEFAULT_TAIGA_URL = 'https://api.taiga.io/api/v1';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {
  private serversSubject = new BehaviorSubject<TaigaServer[]>([]);
  private activeServerSubject = new BehaviorSubject<TaigaServer | null>(null);
  
  public servers$ = this.serversSubject.asObservable();
  public activeServer$ = this.activeServerSubject.asObservable();

  constructor() {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    const { value } = await Preferences.get({ key: SERVER_CONFIG_KEY });
    
    if (value) {
      try {
        const config: ServerConfig = JSON.parse(value);
        this.serversSubject.next(config.servers);
        
        const activeServer = config.servers.find(s => s.id === config.activeServerId) || 
                            config.servers.find(s => s.isDefault) ||
                            config.servers[0] || 
                            null;
        this.activeServerSubject.next(activeServer);
      } catch (e) {
        await this.initializeDefaultConfig();
      }
    } else {
      await this.initializeDefaultConfig();
    }
  }

  private async initializeDefaultConfig(): Promise<void> {
    const defaultServer: TaigaServer = {
      id: this.generateId(),
      name: 'Taiga.io (Official)',
      url: DEFAULT_TAIGA_URL,
      isDefault: true,
      lastUsed: new Date().toISOString()
    };

    const config: ServerConfig = {
      servers: [defaultServer],
      activeServerId: defaultServer.id
    };

    await this.saveConfig(config);
    this.serversSubject.next([defaultServer]);
    this.activeServerSubject.next(defaultServer);
  }

  private async saveConfig(config: ServerConfig): Promise<void> {
    await Preferences.set({
      key: SERVER_CONFIG_KEY,
      value: JSON.stringify(config)
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getActiveServer(): TaigaServer | null {
    return this.activeServerSubject.value;
  }

  getActiveServerUrl(): string {
    const server = this.activeServerSubject.value;
    return server?.url || DEFAULT_TAIGA_URL;
  }

  async addServer(name: string, url: string, makeDefault: boolean = false): Promise<TaigaServer> {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    if (!normalizedUrl.endsWith('/api/v1')) {
      normalizedUrl = `${normalizedUrl}/api/v1`;
    }

    const newServer: TaigaServer = {
      id: this.generateId(),
      name: name.trim(),
      url: normalizedUrl,
      isDefault: makeDefault,
      lastUsed: new Date().toISOString()
    };

    const currentServers = this.serversSubject.value;
    
    // If making this default, remove default from others
    if (makeDefault) {
      currentServers.forEach(s => s.isDefault = false);
    }

    const updatedServers = [...currentServers, newServer];
    
    const config: ServerConfig = {
      servers: updatedServers,
      activeServerId: makeDefault ? newServer.id : this.activeServerSubject.value?.id || newServer.id
    };

    await this.saveConfig(config);
    this.serversSubject.next(updatedServers);
    
    if (makeDefault || !this.activeServerSubject.value) {
      this.activeServerSubject.next(newServer);
    }

    return newServer;
  }

  async updateServer(id: string, updates: Partial<TaigaServer>): Promise<void> {
    const currentServers = this.serversSubject.value;
    const serverIndex = currentServers.findIndex(s => s.id === id);
    
    if (serverIndex === -1) return;

    // Handle URL normalization
    if (updates.url) {
      let normalizedUrl = updates.url.trim();
      if (normalizedUrl.endsWith('/')) {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }
      if (!normalizedUrl.endsWith('/api/v1')) {
        normalizedUrl = `${normalizedUrl}/api/v1`;
      }
      updates.url = normalizedUrl;
    }

    // Handle default server change
    if (updates.isDefault) {
      currentServers.forEach(s => s.isDefault = false);
    }

    currentServers[serverIndex] = { ...currentServers[serverIndex], ...updates };

    const config: ServerConfig = {
      servers: currentServers,
      activeServerId: this.activeServerSubject.value?.id || null
    };

    await this.saveConfig(config);
    this.serversSubject.next([...currentServers]);

    // Update active server if it was modified
    if (this.activeServerSubject.value?.id === id) {
      this.activeServerSubject.next(currentServers[serverIndex]);
    }
  }

  async deleteServer(id: string): Promise<void> {
    const currentServers = this.serversSubject.value;
    const updatedServers = currentServers.filter(s => s.id !== id);

    if (updatedServers.length === 0) {
      // Don't delete the last server, reset to default
      await this.initializeDefaultConfig();
      return;
    }

    let activeServerId = this.activeServerSubject.value?.id;
    
    // If deleting active server, switch to default or first available
    if (activeServerId === id) {
      const defaultServer = updatedServers.find(s => s.isDefault) || updatedServers[0];
      activeServerId = defaultServer.id;
      this.activeServerSubject.next(defaultServer);
    }

    const config: ServerConfig = {
      servers: updatedServers,
      activeServerId: activeServerId || null
    };

    await this.saveConfig(config);
    this.serversSubject.next(updatedServers);
  }

  async setActiveServer(id: string): Promise<void> {
    const servers = this.serversSubject.value;
    const server = servers.find(s => s.id === id);
    
    if (!server) return;

    // Update last used
    server.lastUsed = new Date().toISOString();

    const config: ServerConfig = {
      servers,
      activeServerId: id
    };

    await this.saveConfig(config);
    this.activeServerSubject.next(server);
    this.serversSubject.next([...servers]);
  }

  async testConnection(url: string): Promise<{ success: boolean; message: string }> {
    try {
      let testUrl = url.trim();
      if (testUrl.endsWith('/')) {
        testUrl = testUrl.slice(0, -1);
      }
      if (!testUrl.endsWith('/api/v1')) {
        testUrl = `${testUrl}/api/v1`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${testUrl}/projects`, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok || response.status === 401) {
        return { success: true, message: 'Connection successful!' };
      } else {
        return { success: false, message: `Server returned status: ${response.status}` };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { success: false, message: 'Connection timed out. Please check the URL.' };
      }
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }

  getAllServers(): TaigaServer[] {
    return this.serversSubject.value;
  }
}
