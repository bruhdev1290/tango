import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Reset Password</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="info-section">
        <ion-icon name="mail-outline" color="primary"></ion-icon>
        <h2>Forgot your password?</h2>
        <p>Enter your email address and we'll send you instructions to reset your password.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <ion-list>
          <ion-item>
            <ion-input
              type="email"
              label="Email"
              labelPlacement="floating"
              formControlName="email"
            ></ion-input>
          </ion-item>
        </ion-list>

        <ion-button
          expand="block"
          type="submit"
          [disabled]="form.invalid || isLoading"
          class="ion-margin-top"
        >
          <ion-spinner *ngIf="isLoading" slot="start"></ion-spinner>
          {{ isLoading ? 'Sending...' : 'Send Reset Instructions' }}
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [`
    .info-section {
      text-align: center;
      padding: 40px 20px;
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
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class ForgotPasswordPage {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Sending...'
    });
    await loading.present();

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;
        
        const toast = await this.toastController.create({
          message: 'Password reset instructions have been sent to your email.',
          duration: 3000,
          color: 'success'
        });
        await toast.present();
        
        this.form.reset();
      },
      error: async () => {
        await loading.dismiss();
        this.isLoading = false;
      }
    });
  }
}
