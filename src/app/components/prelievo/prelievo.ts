import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-prelievo',
  imports: [CommonModule],
  templateUrl: './prelievo.html',
  styleUrl: './prelievo.css',
})
export class Prelievo {
  protected readonly bank = inject(BankStore);
  protected readonly amount = signal('');
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected onAmountChange(event: Event) {
    this.error.set('');
    this.success.set('');
    this.amount.set((event.target as HTMLInputElement).value);
  }

  protected submitWithdrawal() {
    const amount = Number(this.amount());
    if (!amount || amount <= 0) {
      this.error.set('Inserisci un importo valido.');
      return;
    }

    this.bank.withdraw(amount);
    this.success.set(`Prelievo eseguito: €${amount.toFixed(2)}`);
    this.amount.set('');
  }
}
