import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonNote,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ServerConfigService } from '../../services/server-config.service';
import { LoginCredentials, TaigaServer } from '../../models';
import { addIcons } from 'ionicons';
import { 
  eyeOutline, 
  eyeOffOutline, 
  settingsOutline, 
  serverOutline, 
  chevronDownOutline,
  flashOutline,
  personOutline,
  lockClosedOutline,
  globeOutline,
  checkmark
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="logo-section">
          <div class="logo">
            <ion-icon name="flash-outline" color="primary"></ion-icon>
          </div>
          <h1>Taiga Mobile</h1>
          <p>Project Management on the Go</p>
        </div>

        <!-- Server Selection -->
        <ion-card class="server-card" *ngIf="activeServer">
          <ion-card-content (click)="toggleServerSelect()">
            <div class="server-info">
              <ion-icon name="server-outline" color="primary"></ion-icon>
              <div class="server-details">
                <span class="server-name">{{ activeServer.name }}</span>
                <span class="server-url">{{ activeServer.url }}</span>
              </div>
              <ion-icon name="chevron-down-outline" [class.rotate]="showServerSelect"></ion-icon>
            </div>
          </ion-card-content>
          
          <div class="server-list" *ngIf="showServerSelect">
            <ion-list lines="full">
              <ion-item 
                *ngFor="let server of servers" 
                (click)="selectServer(server)"
                [class.active-server]="server.id === activeServer?.id"
                button
              >
                <ion-icon 
                  name="globe-outline" 
                  slot="start" 
                  [color]="server.id === activeServer?.id ? 'primary' : 'medium'"
                ></ion-icon>
                <ion-label>
                  <h3>{{ server.name }}</h3>
                  <p>{{ server.url }}</p>
                </ion-label>
                <ion-icon 
                  *ngIf="server.id === activeServer?.id" 
                  name="checkmark" 
                  slot="end" 
                  color="primary"
                ></ion-icon>
              </ion-item>
              
              <ion-item (click)="manageServers()" button detail>
                <ion-icon name="settings-outline" slot="start" color="secondary"></ion-icon>
                <ion-label>
                  <h3>Manage Servers</h3>
                  <p>Add or configure servers</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-card>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Sign In</ion-card-title>
            </ion-card-header>
            
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-icon name="person-outline" slot="start" color="medium"></ion-icon>
                  <ion-input
                    type="text"
                    label="Username"
                    labelPlacement="floating"
                    formControlName="username"
                    autocomplete="username"
                  ></ion-input>
                </ion-item>

                <ion-item>
                  <ion-icon name="lock-closed-outline" slot="start" color="medium"></ion-icon>
                  <ion-input
                    [type]="showPassword ? 'text' : 'password'"
                    label="Password"
                    labelPlacement="floating"
                    formControlName="password"
                    autocomplete="current-password"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    (click)="togglePassword()"
                    type="button"
                  >
                    <ion-icon
                      [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                      slot="icon-only"
                    ></ion-icon>
                  </ion-button>
                </ion-item>
              </ion-list>

              <ion-button
                expand="block"
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="login-button"
              >
                <ion-spinner *ngIf="isLoading" slot="start"></ion-spinner>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </ion-button>

              <div class="links">
                <ion-button fill="clear" size="small" routerLink="/forgot-password">
                  Forgot Password?
                </ion-button>
                <ion-button fill="clear" size="small" routerLink="/register">
                  Create Account
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </form>

        <div class="help-text" *ngIf="activeServer?.url !== 'https://api.taiga.io/api/v1'">
          <ion-note>
            Connecting to: {{ activeServer?.url }}
          </ion-note>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px 0;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: var(--ion-color-primary);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo ion-icon {
      font-size: 40px;
      color: white;
    }

    .logo-section h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }

    .logo-section p {
      margin: 8px 0 0;
      color: var(--ion-color-medium);
    }

    .server-card {
      margin: 0 0 16px 0;
      cursor: pointer;
    }

    .server-card ion-card-content {
      padding: 12px 16px;
    }

    .server-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .server-info > ion-icon:first-child {
      font-size: 24px;
    }

    .server-info > ion-icon:last-child {
      font-size: 20px;
      transition: transform 0.2s;
    }

    .server-info > ion-icon:last-child.rotate {
      transform: rotate(180deg);
    }

    .server-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .server-name {
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    .server-url {
      font-size: 12px;
      color: var(--ion-color-medium);
      font-family: monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .server-list {
      border-top: 1px solid var(--ion-color-light);
    }

    .server-list ion-list {
      margin: 0;
    }

    .active-server {
      --background: var(--ion-color-primary-tint);
    }

    ion-card {
      border-radius: 16px;
    }

    ion-card-header {
      text-align: center;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      --background: transparent;
    }

    .login-button {
      margin-top: 20px;
    }

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }

    .help-text {
      text-align: center;
      margin-top: 16px;
    }

    .help-text ion-note {
      font-size: 12px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCardHeader,
    IonCardTitle,
    IonSpinner,
    IonNote,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showServerSelect = false;
  servers: TaigaServer[] = [];
  activeServer: TaigaServer | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private serverConfig: ServerConfigService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    addIcons({
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'settings-outline': settingsOutline,
      'server-outline': serverOutline,
      'chevron-down-outline': chevronDownOutline,
      'flash-outline': flashOutline,
      'person-outline': personOutline,
      'lock-closed-outline': lockClosedOutline,
      'globe-outline': globeOutline,
      'checkmark': checkmark
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
    this.serverConfig.servers$.subscribe(servers => {
      this.servers = servers;
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleServerSelect() {
    this.showServerSelect = !this.showServerSelect;
  }

  async selectServer(server: TaigaServer) {
    await this.serverConfig.setActiveServer(server.id);
    this.showServerSelect = false;
    
    const toast = await this.toastController.create({
      message: `Switched to ${server.name}`,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  manageServers() {
    this.router.navigate(['/server-management']);
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Signing in...',
      spinner: 'crescent'
    });
    await loading.present();

    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;
        this.router.navigate(['/tabs/projects']);
      },
      error: async () => {
        await loading.dismiss();
        this.isLoading = false;
      }
    });
  }
}
