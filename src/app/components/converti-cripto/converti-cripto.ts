import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-converti-cripto',
  imports: [CommonModule],
  templateUrl: './converti-cripto.html',
  styleUrl: './converti-cripto.css',
})
export class ConvertiCripto {
  protected readonly bank = inject(BankStore);
  protected readonly amount = signal('');
  protected readonly currency = signal('BTC');
  protected readonly result = signal('');
  protected readonly error = signal('');

  protected onAmountChange(event: Event) {
    this.error.set('');
    this.result.set('');
    this.amount.set((event.target as HTMLInputElement).value);
  }

  protected convert() {
    const amount = Number(this.amount());
    const currency = this.currency();
    if (!amount || amount <= 0) {
      this.error.set('Inserisci un importo valido.');
      return;
    }

    const rate = currency === 'BTC' ? 35000 : 2500;
    const cryptoAmount = amount / rate;
    this.bank.convertCrypto(amount, currency, rate);
    this.result.set(`${cryptoAmount.toFixed(6)} ${currency}`);
    this.amount.set('');
  }
}
