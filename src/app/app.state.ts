import { Injectable, computed, inject, signal } from '@angular/core';
import {
  catchError,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  BankingApiService,
  type AccountBalanceResponse,
  type ApiTransactionRow,
  type DepositWithdrawalResponse,
} from './servizi/servizio';
import { AuthService } from './auth.service';

/** Movimento mostrato in lista / dettaglio (derivato dall'API). */
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  description?: string;
  balanceAfter?: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BankStore {
  private readonly api = inject(BankingApiService);
  private readonly auth = inject(AuthService);

  private readonly _balance = signal(0);
  private readonly _ownerName = signal<string | null>(null);
  private readonly _currency = signal('EUR');
  private readonly _transactions = signal<Transaction[]>([]);
  private readonly _selectedTransaction = signal<Transaction | null>(null);
  private readonly _loading = signal(false);

  readonly balance = computed(() => this._balance());
  readonly ownerName = this._ownerName.asReadonly();
  readonly currency = computed(() => this._currency());
  readonly transactions = this._transactions.asReadonly();
  readonly selectedTransaction = this._selectedTransaction.asReadonly();
  readonly loading = this._loading.asReadonly();

  reset(): void {
    this._balance.set(0);
    this._ownerName.set(null);
    this._currency.set('EUR');
    this._transactions.set([]);
    this._selectedTransaction.set(null);
    this._loading.set(false);
  }

  /** Applica subito i dati saldo (es. risposta login o GET balance). */
  applyBalanceResponse(data: AccountBalanceResponse): void {
    const value = Number(data.balance);
    this._balance.set(Number.isFinite(value) ? value : 0);
    this._ownerName.set(data.owner_name ?? null);
    this._currency.set(data.currency || 'EUR');
  }

  /** Aggiorna il saldo dal campo `balance_after` di deposito/prelievo. */
  applyBalanceAfter(balanceAfter: number | string): void {
    const value = Number(balanceAfter);
    if (Number.isFinite(value)) {
      this._balance.set(value);
    }
  }

  /** Ricarica saldo e lista movimenti dal backend. */
  refreshFromApi(): Observable<void> {
    const id = this.auth.accountId();
    if (!id) {
      this.reset();
      return of(undefined);
    }

    this._loading.set(true);

    return forkJoin({
      balance: this.api.getBalance(id),
      txs: this.api.getTransactions(id).pipe(catchError(() => of([] as ApiTransactionRow[]))),
    }).pipe(
      tap(({ balance, txs }) => this.applyServerData(balance, txs)),
      map(() => undefined),
      finalize(() => this._loading.set(false)),
    );
  }

  /** Solo saldo (più leggero, es. all'apertura pagina Saldo). */
  refreshBalance(): Observable<void> {
    const id = this.auth.accountId();
    if (!id) {
      return of(undefined);
    }

    return this.api.getBalance(id).pipe(
      tap((balance) => this.applyBalanceResponse(balance)),
      map(() => undefined),
    );
  }

  deposit(amount: number, description = ''): Observable<void> {
    const id = this.auth.accountId();
    if (!id) {
      return throwError(() => new Error('Sessione non valida.'));
    }
    return this.api.createDeposit(id, { amount, description }).pipe(
      tap((res) => this.applyMutationResponse(res)),
      switchMap(() => this.refreshFromApi()),
    );
  }

  withdraw(amount: number, description = ''): Observable<void> {
    const id = this.auth.accountId();
    if (!id) {
      return throwError(() => new Error('Sessione non valida.'));
    }
    return this.api.createWithdrawal(id, { amount, description }).pipe(
      tap((res) => this.applyMutationResponse(res)),
      switchMap(() => this.refreshFromApi()),
    );
  }

  selectTransaction(id: string) {
    const transaction = this._transactions().find((t) => t.id === id);
    this._selectedTransaction.set(transaction ?? null);
  }

  private applyMutationResponse(res: DepositWithdrawalResponse): void {
    this.applyBalanceAfter(res.balance_after);
  }

  private applyServerData(balance: AccountBalanceResponse, txs: ApiTransactionRow[]): void {
    this.applyBalanceResponse(balance);
    this._transactions.set(txs.map((t) => this.mapRow(t, balance.currency || 'EUR')));
    const selectedId = this._selectedTransaction()?.id;
    if (selectedId) {
      const still = this._transactions().find((x) => x.id === selectedId) ?? null;
      this._selectedTransaction.set(still);
    }
  }

  private mapRow(t: ApiTransactionRow, accountCurrency: string): Transaction {
    return {
      id: String(t.id),
      type: t.type,
      amount: Number(t.amount),
      currency: accountCurrency,
      description: t.description || undefined,
      balanceAfter: t.balance_after != null ? Number(t.balance_after) : undefined,
      date: new Date(t.created_at),
    };
  }
}
