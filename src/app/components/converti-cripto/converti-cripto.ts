import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { BankingApiService } from '../../servizi/servizio';

@Component({
  standalone: true,
  selector: 'app-converti-cripto',
  imports: [CommonModule],
  templateUrl: './converti-cripto.html',
  styleUrl: './converti-cripto.css',
})
export class ConvertiCripto {
  private readonly api = inject(BankingApiService);
  private readonly auth = inject(AuthService);

  protected readonly currency = signal('BTC');
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
    this.api.convertCrypto(id, this.currency()).subscribe({
      next: (res) => {
        this.result.set(
          `Saldo ${res.original_balance.toFixed(2)} ${res.from_currency} ≈ ` +
            `${res.converted_amount} ${res.to_crypto} (prezzo ~${res.price} EUR)`,
        );
        this.pending.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Errore nella conversione crypto.');
        this.pending.set(false);
      },
    });
  }
}
