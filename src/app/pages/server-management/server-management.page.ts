import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonIcon, IonList, IonListHeader, IonLabel,
  IonItemSliding, IonItem, IonCheckbox, IonInput, IonNote,
  IonButton, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  AlertController, ToastController, LoadingController, ActionSheetController 
} from '@ionic/angular/standalone';
import { ServerConfigService } from '../../services/server-config.service';
import { TaigaServer } from '../../models';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline, trashOutline, createOutline, serverOutline, globeOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-server-management',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Server Configuration</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="info-section">
        <ion-icon name="server-outline" color="primary"></ion-icon>
        <h2>Taiga Servers</h2>
        <p>Manage your Taiga server connections. You can connect to the official Taiga.io or your self-hosted instance.</p>
      </div>

      <ion-list>
        <ion-list-header>
          <ion-label>Configured Servers</ion-label>
        </ion-list-header>

        <ion-item-sliding *ngFor="let server of servers">
          <ion-item [detail]="false">
            <ion-icon 
              [name]="server.isDefault ? 'checkmark-circle' : 'globe-outline'" 
              slot="start" 
              [color]="server.isDefault ? 'success' : 'medium'"
            ></ion-icon>
            <ion-label>
              <h2>{{ server.name }}</h2>
              <p class="server-url">{{ server.url }}</p>
              <p class="server-meta" *ngIf="server.lastUsed">
                Last used: {{ server.lastUsed | date:'short' }}
              </p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button 
                *ngIf="!server.isDefault" 
                (click)="setAsDefault(server, $event)"
                fill="clear"
                color="success"
              >
                <ion-icon name="checkmark-outline"></ion-icon>
              </ion-button>
              <ion-button (click)="presentServerActions(server, $event)" fill="clear">
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-icon 
              *ngIf="isActiveServer(server)" 
              name="checkmark-circle" 
              slot="end" 
              color="primary"
            ></ion-icon>
          </ion-item>
        </ion-item-sliding>

        <ion-item *ngIf="servers.length === 0">
          <ion-label class="ion-text-center">
            <p>No servers configured</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Add New Server</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form [formGroup]="serverForm" (ngSubmit)="addServer()">
            <ion-list>
              <ion-item>
                <ion-input
                  type="text"
                  label="Server Name"
                  labelPlacement="floating"
                  formControlName="name"
                  placeholder="My Company Taiga"
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-input
                  type="url"
                  label="Server URL"
                  labelPlacement="floating"
                  formControlName="url"
                  placeholder="https://taiga.mycompany.com"
                ></ion-input>
              </ion-item>
              <ion-note class="ion-padding-start">
                Enter the base URL of your Taiga instance (e.g., https://taiga.mycompany.com or https://api.taiga.io)
              </ion-note>

              <ion-item lines="none">
                <ion-checkbox slot="start" formControlName="makeDefault"></ion-checkbox>
                <ion-label>Set as default server</ion-label>
              </ion-item>
            </ion-list>

            <ion-button
              expand="block"
              type="submit"
              [disabled]="serverForm.invalid || isAdding"
              class="ion-margin-top"
            >
              <ion-spinner *ngIf="isAdding" slot="start"></ion-spinner>
              {{ isAdding ? 'Testing Connection...' : 'Add Server' }}
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              (click)="testConnection()"
              [disabled]="serverForm.get('url')?.invalid || isTesting"
              class="ion-margin-top"
            >
              <ion-spinner *ngIf="isTesting" slot="start"></ion-spinner>
              {{ isTesting ? 'Testing...' : 'Test Connection' }}
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>

      <ion-card class="help-card">
        <ion-card-header>
          <ion-card-title>Self-Hosted Taiga?</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>
            If you're running your own Taiga instance, enter your server's URL above. 
            Make sure your Taiga API is accessible and CORS is properly configured.
          </p>
          <p class="ion-margin-top">
            <strong>Default:</strong> https://api.taiga.io (Official Taiga.io)
          </p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    .info-section {
      text-align: center;
      padding: 20px;
      margin-bottom: 20px;
    }

    .info-section ion-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .info-section h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
    }

    .info-section p {
      margin: 0;
      color: var(--ion-color-medium);
    }

    .server-url {
      font-size: 12px;
      color: var(--ion-color-medium);
      font-family: monospace;
    }

    .server-meta {
      font-size: 11px;
      color: var(--ion-color-medium);
    }

    .help-card {
      margin-top: 20px;
      background: var(--ion-color-light);
    }

    .help-card p {
      color: var(--ion-color-medium);
      line-height: 1.5;
    }

    ion-note {
      font-size: 12px;
      color: var(--ion-color-medium);
      display: block;
      margin-top: 4px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonIcon, IonList, IonListHeader, IonLabel,
    IonItemSliding, IonItem, IonCheckbox, IonInput, IonNote,
    IonButton, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ]
})
export class ServerManagementPage implements OnInit {
  servers: TaigaServer[] = [];
  activeServer: TaigaServer | null = null;
  serverForm: FormGroup;
  isAdding = false;
  isTesting = false;

  constructor(
    private fb: FormBuilder,
    private serverConfig: ServerConfigService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController
  ) {
    this.serverForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      makeDefault: [false]
    });

    addIcons({
      'add-outline': addOutline,
      'checkmark-outline': checkmarkOutline,
      'trash-outline': trashOutline,
      'create-outline': createOutline,
      'server-outline': serverOutline,
      'globe-outline': globeOutline,
      'checkmark-circle': checkmarkCircleOutline,
      'close-circle': closeCircleOutline
    });
  }

  ngOnInit() {
    this.loadServers();
  }

  loadServers() {
    this.servers = this.serverConfig.getAllServers();
    this.serverConfig.activeServer$.subscribe(server => {
      this.activeServer = server;
    });
  }

  isActiveServer(server: TaigaServer): boolean {
    return this.activeServer?.id === server.id;
  }

  async setAsDefault(server: TaigaServer, event: Event) {
    event.stopPropagation();
    await this.serverConfig.updateServer(server.id, { isDefault: true });
    this.loadServers();
    
    const toast = await this.toastController.create({
      message: `${server.name} set as default server`,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  async presentServerActions(server: TaigaServer, event: Event) {
    event.stopPropagation();
    
    const buttons: any[] = [
      {
        text: 'Set as Active',
        icon: 'checkmark-circle',
        handler: async () => {
          await this.serverConfig.setActiveServer(server.id);
          const toast = await this.toastController.create({
            message: `Switched to ${server.name}`,
            duration: 2000,
            color: 'success'
          });
          await toast.present();
        }
      },
      {
        text: 'Test Connection',
        icon: 'globe-outline',
        handler: () => this.testExistingConnection(server)
      }
    ];

    // Don't allow deleting the last server or the default without confirmation
    if (this.servers.length > 1) {
      buttons.push({
        text: 'Delete',
        icon: 'trash',
        role: 'destructive',
        handler: () => this.confirmDelete(server)
      });
    }

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: server.name,
      buttons
    });
    await actionSheet.present();
  }

  async testExistingConnection(server: TaigaServer) {
    const loading = await this.loadingController.create({
      message: 'Testing connection...'
    });
    await loading.present();

    const result = await this.serverConfig.testConnection(server.url);
    await loading.dismiss();

    const toast = await this.toastController.create({
      message: result.message,
      duration: 3000,
      color: result.success ? 'success' : 'danger'
    });
    await toast.present();
  }

  async confirmDelete(server: TaigaServer) {
    const alert = await this.alertController.create({
      header: 'Delete Server',
      message: `Are you sure you want to remove "${server.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.serverConfig.deleteServer(server.id);
            this.loadServers();
          }
        }
      ]
    });
    await alert.present();
  }

  async testConnection() {
    if (this.serverForm.get('url')?.invalid) return;

    this.isTesting = true;
    const url = this.serverForm.value.url;
    
    const result = await this.serverConfig.testConnection(url);
    
    const toast = await this.toastController.create({
      message: result.message,
      duration: 3000,
      color: result.success ? 'success' : 'danger'
    });
    await toast.present();
    
    this.isTesting = false;
  }

  async addServer() {
    if (this.serverForm.invalid) return;

    this.isAdding = true;
    
    // Test connection first
    const result = await this.serverConfig.testConnection(this.serverForm.value.url);
    
    if (!result.success) {
      const alert = await this.alertController.create({
        header: 'Connection Failed',
        message: `${result.message}\n\nDo you want to add this server anyway?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.isAdding = false;
            }
          },
          {
            text: 'Add Anyway',
            handler: () => this.saveServer()
          }
        ]
      });
      await alert.present();
    } else {
      await this.saveServer();
    }
  }

  private async saveServer() {
    try {
      const { name, url, makeDefault } = this.serverForm.value;
      await this.serverConfig.addServer(name, url, makeDefault);
      
      this.serverForm.reset({ makeDefault: false });
      this.loadServers();
      
      const toast = await this.toastController.create({
        message: 'Server added successfully',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Failed to add server',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
    
    this.isAdding = false;
  }
}
