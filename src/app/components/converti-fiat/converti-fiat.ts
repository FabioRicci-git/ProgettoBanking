import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-converti-fiat',
  imports: [CommonModule],
  templateUrl: './converti-fiat.html',
  styleUrl: './converti-fiat.css',
})
export class ConvertiFiat {
  protected readonly bank = inject(BankStore);
  protected readonly amount = signal('');
  protected readonly currency = signal('USD');
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

    const rates: Record<string, number> = { USD: 1.05, GBP: 0.86 };
    const rate = rates[currency];
    if (!rate) {
      this.error.set('Valuta non supportata.');
      return;
    }
    const result = amount * rate;
    this.bank.convertFiat(amount, currency, rate);
    this.result.set(`${result.toFixed(2)} ${currency}`);
    this.amount.set('');
  }
}
