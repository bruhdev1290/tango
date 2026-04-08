import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Create Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <ion-list>
          <ion-item>
            <ion-input
              type="text"
              label="Full Name"
              labelPlacement="floating"
              formControlName="full_name"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              type="text"
              label="Username"
              labelPlacement="floating"
              formControlName="username"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              type="email"
              label="Email"
              labelPlacement="floating"
              formControlName="email"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              type="password"
              label="Password"
              labelPlacement="floating"
              formControlName="password"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              type="password"
              label="Confirm Password"
              labelPlacement="floating"
              formControlName="confirm_password"
            ></ion-input>
          </ion-item>

          <ion-item lines="none">
            <ion-checkbox slot="start" formControlName="accepted_terms"></ion-checkbox>
            <ion-label class="ion-text-wrap">
              I accept the <a href="#" (click)="openTerms($event)">Terms of Service</a>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button
          expand="block"
          type="submit"
          [disabled]="registerForm.invalid || isLoading"
          class="ion-margin-top"
        >
          <ion-spinner *ngIf="isLoading" slot="start"></ion-spinner>
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </ion-button>
      </form>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      accepted_terms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirm_password')?.value
      ? null
      : { mismatch: true };
  }

  openTerms(event: Event) {
    event.preventDefault();
    // Open terms of service
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Creating account...'
    });
    await loading.present();

    const { confirm_password, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: async () => {
        await loading.dismiss();
        this.isLoading = false;
      }
    });
  }
}
