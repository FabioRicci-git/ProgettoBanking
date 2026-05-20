import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isAuthenticated = signal(false);
  private readonly _accountId = signal<string | null>(null);

  /** True se l'utente ha effettuato l'accesso con un conto valido. */
  readonly isAuthenticated = computed(() => this._isAuthenticated());

  /** Identificativo conto usato nelle chiamate API (`/accounts/{id}/…`). */
  readonly accountId = computed(() => this._accountId());

  login(accountId: string) {
    this._accountId.set(accountId);
    this._isAuthenticated.set(true);
  }

  logout() {
    this._isAuthenticated.set(false);
    this._accountId.set(null);
  }
}
