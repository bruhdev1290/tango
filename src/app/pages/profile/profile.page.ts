import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ActionSheetController, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ServerConfigService } from '../../services/server-config.service';
import { User, TaigaServer } from '../../models';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="presentActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="user">
      <div class="profile-header">
        <div class="avatar-container">
          <img
            *ngIf="user.photo || user.gravatar_id"
            [src]="user.photo || 'https://www.gravatar.com/avatar/' + user.gravatar_id + '?s=200&d=identicon'"
            [alt]="user.full_name"
            class="profile-avatar"
          >
          <div *ngIf="!user.photo && !user.gravatar_id" class="avatar-placeholder">
            {{ getInitials(user.full_name) }}
          </div>
        </div>
        <h1>{{ user.full_name }}</h1>
        <p class="username">&#64;{{ user.username }}</p>
        <p class="bio" *ngIf="user.bio">{{ user.bio }}</p>
        
        <div class="server-badge" *ngIf="activeServer">
          <ion-chip color="primary" (click)="switchServer()">
            <ion-icon name="server-outline"></ion-icon>
            <ion-label>{{ activeServer.name }}</ion-label>
          </ion-chip>
        </div>
      </div>

      <ion-list>
        <ion-list-header>
          <ion-label>Account Information</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-icon name="mail-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Email</h3>
            <p>{{ user.email }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="language-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Language</h3>
            <p>{{ user.lang || 'Not set' }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="time-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Timezone</h3>
            <p>{{ user.timezone || 'Not set' }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="color-palette-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Theme</h3>
            <p>{{ user.theme || 'Default' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Server</ion-label>
        </ion-list-header>

        <ion-item (click)="switchServer()" button detail>
          <ion-icon name="server-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>
            <h3>Current Server</h3>
            <p>{{ activeServer?.name || 'Not connected' }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="globe-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>
            <h3>Server URL</h3>
            <p class="server-url">{{ activeServer?.url || 'N/A' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Statistics</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-icon name="folder-outline" slot="start" color="tertiary"></ion-icon>
          <ion-label>Private Projects</ion-label>
          <ion-badge slot="end" color="tertiary">{{ user.total_private_projects || 0 }}</ion-badge>
        </ion-item>

        <ion-item>
          <ion-icon name="globe-outline" slot="start" color="success"></ion-icon>
          <ion-label>Public Projects</ion-label>
          <ion-badge slot="end" color="success">{{ user.total_public_projects || 0 }}</ion-badge>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Settings</ion-label>
        </ion-list-header>

        <ion-item button (click)="editProfile()">
          <ion-icon name="create-outline" slot="start" color="primary"></ion-icon>
          <ion-label>Edit Profile</ion-label>
        </ion-item>

        <ion-item button (click)="changePassword()">
          <ion-icon name="lock-closed-outline" slot="start" color="primary"></ion-icon>
          <ion-label>Change Password</ion-label>
        </ion-item>

        <ion-item button (click)="notifications()">
          <ion-icon name="notifications-outline" slot="start" color="primary"></ion-icon>
          <ion-label>Notifications</ion-label>
        </ion-item>

        <ion-item button (click)="manageServers()">
          <ion-icon name="settings-outline" slot="start" color="primary"></ion-icon>
          <ion-label>Server Configuration</ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-item button (click)="logout()" color="danger">
          <ion-icon name="log-out-outline" slot="start"></ion-icon>
          <ion-label>Sign Out</ion-label>
        </ion-item>
      </ion-list>

      <div class="app-info">
        <p>Taiga Mobile v1.0.0</p>
        <p>Connected to: {{ activeServer?.name || 'Unknown' }}</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .profile-header {
      padding: 32px 20px;
      text-align: center;
      background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
      color: white;
    }

    .avatar-container {
      margin-bottom: 16px;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid white;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: 600;
      margin: 0 auto;
      border: 4px solid white;
    }

    .profile-header h1 {
      margin: 0 0 4px;
      font-size: 24px;
      font-weight: 600;
    }

    .username {
      margin: 0 0 12px;
      opacity: 0.9;
    }

    .bio {
      margin: 0 0 16px;
      opacity: 0.8;
      font-size: 14px;
    }

    .server-badge {
      margin-top: 8px;
    }

    .server-badge ion-chip {
      --background: rgba(255, 255, 255, 0.2);
      --color: white;
    }

    ion-list {
      margin-top: 16px;
    }

    .server-url {
      font-family: monospace;
      font-size: 12px;
    }

    .app-info {
      text-align: center;
      padding: 32px 20px;
      color: var(--ion-color-medium);
      font-size: 12px;
    }

    .app-info p {
      margin: 4px 0;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  activeServer: TaigaServer | null = null;

  constructor(
    private authService: AuthService,
    private serverConfig: ServerConfigService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUser();
    this.serverConfig.activeServer$.subscribe(server => {
      this.activeServer = server;
    });
  }

  loadUser() {
    this.authService.getMe().subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  editProfile() {
    // Navigate to edit profile
  }

  changePassword() {
    // Show change password modal
  }

  notifications() {
    // Navigate to notifications settings
  }

  manageServers() {
    this.router.navigate(['/server-management']);
  }

  async switchServer() {
    const servers = this.serverConfig.getAllServers();
    
    const buttons = servers.map(server => ({
      text: server.name,
      icon: server.id === this.activeServer?.id ? 'checkmark-circle' : 'globe-outline',
      handler: async () => {
        if (server.id !== this.activeServer?.id) {
          await this.serverConfig.setActiveServer(server.id);
          // Reload user data from new server
          this.loadUser();
        }
      }
    }));

    buttons.push({
      text: 'Manage Servers',
      icon: 'settings-outline',
      handler: () => this.manageServers()
    });

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Switch Server',
      buttons
    });
    await actionSheet.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sign Out',
          role: 'destructive',
          handler: () => {
            this.authService.logout().then(() => {
              this.router.navigate(['/login']);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile Options',
      buttons: [
        {
          text: 'Edit Profile',
          icon: 'create-outline',
          handler: () => this.editProfile()
        },
        {
          text: 'Change Photo',
          icon: 'camera-outline',
          handler: () => {
            // Change photo
          }
        },
        {
          text: 'Switch Server',
          icon: 'server-outline',
          handler: () => this.switchServer()
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
