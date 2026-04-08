import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, lastValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { User, AuthResponse, LoginCredentials } from '../models';
import { ServerConfigService } from './server-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {
    this.loadStoredAuth();
  }

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  private async loadStoredAuth(): Promise<void> {
    const { value: token } = await Preferences.get({ key: 'auth_token' });
    const { value: userStr } = await Preferences.get({ key: 'current_user' });
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        await this.logout();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth`, credentials)
      .pipe(
        tap(async (response) => {
          await this.storeAuth(response);
          this.currentUserSubject.next(response);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  private async storeAuth(response: AuthResponse): Promise<void> {
    const token = response.auth_token || response.token;
    if (token) {
      await Preferences.set({ key: 'auth_token', value: token });
    }
    await Preferences.set({ key: 'current_user', value: JSON.stringify(response) });
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'auth_token' });
    await Preferences.remove({ key: 'current_user' });
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/password_recovery`, { email });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change_password`, {
      current_password: currentPassword,
      password: newPassword
    });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }
}
