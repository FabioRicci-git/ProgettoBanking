import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { BankingApiService } from '../../servizi/servizio';

@Component({
  standalone: true,
  selector: 'app-converti-fiat',
  imports: [CommonModule],
  templateUrl: './converti-fiat.html',
  styleUrl: './converti-fiat.css',
})
export class ConvertiFiat {
  private readonly api = inject(BankingApiService);
  private readonly auth = inject(AuthService);

  protected readonly currency = signal('USD');
  protected readonly result = signal('');
  protected readonly error = signal('');
  protected readonly pending = signal(false);

  protected convert() {
    const id = this.auth.accountId();
    if (!id) {
      this.error.set('Sessione non valida.');
      return;
    }

    this.pending.set(true);
    this.error.set('');
    this.result.set('');
    this.api.convertFiat(id, this.currency()).subscribe({
      next: (res) => {
        this.result.set(
          `Saldo ${res.original_balance.toFixed(2)} ${res.from_currency} ≈ ` +
            `${res.converted_balance.toFixed(2)} ${res.to_currency} (tasso ${res.rate})`,
        );
        this.pending.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Errore nella conversione.');
        this.pending.set(false);
      },
    });
  }
}
