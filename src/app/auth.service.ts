import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isAuthenticated = signal(false);

  get isAuthenticated() {
    return this._isAuthenticated();
  }

  login() {
    this._isAuthenticated.set(true);
  }

  logout() {
    this._isAuthenticated.set(false);
  }
}