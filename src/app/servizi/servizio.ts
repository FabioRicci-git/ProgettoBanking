import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServizioService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // =========================
  // ACCOUNT
  // =========================

  createAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts`, data);
  }

  // =========================
  // TRANSACTIONS
  // =========================

  getTransactions(accountId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/accounts/${accountId}/transactions`);
  }

  getTransaction(accountId: number, transactionId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/accounts/${accountId}/transactions/${transactionId}`
    );
  }

  updateTransaction(
    accountId: number,
    transactionId: number,
    data: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/accounts/${accountId}/transactions/${transactionId}`,
      data
    );
  }

  deleteTransaction(
    accountId: number,
    transactionId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/accounts/${accountId}/transactions/${transactionId}`
    );
  }

  // =========================
  // DEPOSITI
  // =========================

  createDeposit(accountId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/accounts/${accountId}/deposits`,
      data
    );
  }

  // =========================
  // PRELIEVI
  // =========================

  createWithdrawal(accountId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/accounts/${accountId}/withdrawals`,
      data
    );
  }

  // =========================
  // SALDO
  // =========================

  getBalance(accountId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/accounts/${accountId}/balance`
    );
  }

  convertFiat(accountId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/accounts/${accountId}/balance/convert/fiat`
    );
  }

  convertCrypto(accountId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/accounts/${accountId}/balance/convert/crypto`
    );
  }
}