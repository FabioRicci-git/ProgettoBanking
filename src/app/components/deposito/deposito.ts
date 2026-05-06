import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-deposito',
  imports: [CommonModule],
  templateUrl: './deposito.html',
  styleUrl: './deposito.css',
})
export class Deposito {
  protected readonly bank = inject(BankStore);
  protected readonly amount = signal('');
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected onAmountChange(event: Event) {
    this.error.set('');
    this.success.set('');
    this.amount.set((event.target as HTMLInputElement).value);
  }

  protected submitDeposit() {
    const amount = Number(this.amount());
    if (!amount || amount <= 0) {
      this.error.set('Inserisci un importo valido.');
      return;
    }

    this.bank.deposit(amount);
    this.success.set(`Deposito eseguito: €${amount.toFixed(2)}`);
    this.amount.set('');
  }
}
