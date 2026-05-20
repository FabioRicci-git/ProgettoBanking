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
  protected readonly pending = signal(false);

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

    this.pending.set(true);
    this.error.set('');
    this.success.set('');
    this.bank.deposit(amount).subscribe({
      next: () => {
        this.success.set(
          `Deposito eseguito: ${amount.toFixed(2)} ${this.bank.currency()}. Nuovo saldo: ${this.bank.balance().toFixed(2)} ${this.bank.currency()}`,
        );
        this.amount.set('');
        this.pending.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Errore durante il deposito.');
        this.pending.set(false);
      },
    });
  }
}
