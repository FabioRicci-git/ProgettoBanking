import { Injectable, signal } from '@angular/core';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'convert-crypto' | 'convert-fiat';
  amount: number;
  currency?: string;
  rate?: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BankStore {
  private readonly _balance = signal(0);
  private readonly _transactions = signal<Transaction[]>([]);
  private readonly _selectedTransaction = signal<Transaction | null>(null);

  readonly balance = this._balance.asReadonly();
  readonly transactions = this._transactions.asReadonly();
  readonly selectedTransaction = this._selectedTransaction.asReadonly();

  deposit(amount: number) {
    this._balance.update(b => b + amount);
    this.addTransaction('deposit', amount);
  }

  withdraw(amount: number) {
    if (this._balance() >= amount) {
      this._balance.update(b => b - amount);
      this.addTransaction('withdraw', amount);
    } else {
      throw new Error('Saldo insufficiente');
    }
  }

  convertCrypto(amount: number, currency: string, rate: number) {
    if (this._balance() >= amount) {
      this._balance.update(b => b - amount);
      this.addTransaction('convert-crypto', amount, currency, rate);
    } else {
      throw new Error('Saldo insufficiente');
    }
  }

  convertFiat(amount: number, currency: string, rate: number) {
    this._balance.update(b => b + amount * rate);
    this.addTransaction('convert-fiat', amount, currency, rate);
  }

  selectTransaction(id: string) {
    const transaction = this._transactions().find(t => t.id === id);
    this._selectedTransaction.set(transaction || null);
  }

  private addTransaction(type: Transaction['type'], amount: number, currency?: string, rate?: number) {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      currency,
      rate,
      date: new Date()
    };
    this._transactions.update(t => [...t, transaction]);
  }
}