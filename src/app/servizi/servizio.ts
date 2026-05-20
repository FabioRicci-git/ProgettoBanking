import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

/** Base URL dell'API Mini Banking */
export const BANKING_API_BASE_URL = 'https://bankingapi-production-2687.up.railway.app';

export interface AccountBalanceResponse {
  account_id: number;
  owner_name?: string;
  currency: string;
  balance: number;
}

export interface ApiTransactionRow {
  id: number;
  account_id: number;
  type: 'deposit' | 'withdrawal';
  amount: string;
  description: string;
  balance_after: string;
  created_at: string;
}

export interface TransactionsListResponse {
  account_id: number;
  currency: string;
  transactions: ApiTransactionRow[];
}

export interface DepositWithdrawalResponse {
  message?: string;
  transaction_id: number;
  account_id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description?: string;
  balance_after: number;
}

export interface FiatConversionResponse {
  provider: string;
  conversion_type: string;
  from_currency: string;
  to_currency: string;
  original_balance: number;
  converted_balance: number;
  rate: number;
  date: string;
  account_id: number;
}

export interface CryptoConversionResponse {
  provider: string;
  conversion_type: string;
  from_currency: string;
  to_crypto: string;
  market_symbol?: string;
  original_balance: number;
  price: number;
  converted_amount: number;
  account_id: number;
}

function apiErrorMessage(err: HttpErrorResponse): string {
  const body = err.error as { error?: string; message?: string } | null;
  if (body && typeof body === 'object') {
    if (typeof body.error === 'string') return body.error;
    if (typeof body.message === 'string') return body.message;
  }
  return err.message || `Errore HTTP ${err.status}`;
}

@Injectable({
  providedIn: 'root',
})
export class BankingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = BANKING_API_BASE_URL;

  getInfo(): Observable<{ message: string; version: string }> {
    return this.http.get<{ message: string; version: string }>(`${this.baseUrl}/`).pipe(
      catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
    );
  }

  createAccount(body: Record<string, unknown>): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/accounts`, body).pipe(
      catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
    );
  }

  getBalance(accountId: string): Observable<AccountBalanceResponse> {
    return this.http
      .get<AccountBalanceResponse>(`${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/balance`)
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  getTransactions(accountId: string): Observable<ApiTransactionRow[]> {
    return this.http
      .get<TransactionsListResponse>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/transactions`,
      )
      .pipe(
        map((r) => r.transactions ?? []),
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  getTransaction(accountId: string, transactionId: string | number): Observable<ApiTransactionRow> {
    return this.http
      .get<ApiTransactionRow>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/transactions/${transactionId}`,
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  createDeposit(
    accountId: string,
    body: { amount: number; description?: string },
  ): Observable<DepositWithdrawalResponse> {
    return this.http
      .post<DepositWithdrawalResponse>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/deposits`,
        body,
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  createWithdrawal(
    accountId: string,
    body: { amount: number; description?: string },
  ): Observable<DepositWithdrawalResponse> {
    return this.http
      .post<DepositWithdrawalResponse>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/withdrawals`,
        body,
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  updateTransaction(
    accountId: string,
    transactionId: string | number,
    body: Record<string, unknown>,
  ): Observable<ApiTransactionRow> {
    return this.http
      .put<ApiTransactionRow>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/transactions/${transactionId}`,
        body,
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  deleteTransaction(accountId: string, transactionId: string | number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/transactions/${transactionId}`)
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  convertFiat(accountId: string, toCurrency: string, amount?: number): Observable<FiatConversionResponse> {
    let params = new HttpParams().set('to', toCurrency);
    if (amount != null && amount > 0) {
      params = params.set('amount', String(amount));
    }
    return this.http
      .get<FiatConversionResponse>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/balance/convert/fiat`,
        { params },
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }

  convertCrypto(accountId: string, toCrypto: string, amount?: number): Observable<CryptoConversionResponse> {
    let params = new HttpParams().set('to', toCrypto);
    if (amount != null && amount > 0) {
      params = params.set('amount', String(amount));
    }
    return this.http
      .get<CryptoConversionResponse>(
        `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/balance/convert/crypto`,
        { params },
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => new Error(apiErrorMessage(e)))),
      );
  }
}
