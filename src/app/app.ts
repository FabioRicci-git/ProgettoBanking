import { Component, HostListener, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Saldo } from "./components/saldo/saldo";
import { Deposito } from "./components/deposito/deposito";
import { ConvertiCripto } from "./components/converti-cripto/converti-cripto";
import { Prelievo } from "./components/prelievo/prelievo";
import { Navbar } from "./components/navbar/navbar";
import { DettaglioMovimenti } from "./components/dettaglio-movimenti/dettaglio-movimenti";
import { ListaMovimenti } from "./components/lista-movimenti/lista-movimenti";
import { ConvertiFiat } from "./components/converti-fiat/converti-fiat";
import { DashboardCharts } from './components/dashboard-charts/dashboard-charts';
import { Profilo } from './components/profilo/profilo';
import { AuthService } from './auth.service';
import { AppIcon } from './ui/app-icon/app-icon';
import { BankStore } from './app.state';
import { BankingApiService } from './servizi/servizio';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, Saldo, Deposito, ConvertiCripto, Prelievo, Navbar, DettaglioMovimenti, ListaMovimenti, ConvertiFiat, DashboardCharts, Profilo, AppIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected isPage(hash: string) {
    return this.currentHash() === hash;
  }
  protected readonly authService = inject(AuthService);
  protected readonly bankStore = inject(BankStore);
  protected readonly bankingApi = inject(BankingApiService);
  protected readonly accountNumber = signal('');
  protected readonly loginError = signal('');
  protected readonly currentHash = signal(window.location.hash || '#home');

  constructor() {
    effect(() => {
      if (!this.authService.isAuthenticated()) {
        this.accountNumber.set('');
        this.loginError.set('');
        this.bankStore.reset();
        return;
      }
      const id = this.authService.accountId();
      if (id) {
        this.bankStore.refreshFromApi().subscribe();
      }
    });
  }

  @HostListener('window:hashchange')
  protected onHashChange() {
    this.currentHash.set(window.location.hash || '#home');
  }

  protected submitLogin(event: Event) {
    event.preventDefault();
    const numero = this.accountNumber().trim();

    if (!numero) {
      this.loginError.set('Inserisci il numero del conto per accedere.');
      return;
    }

    this.loginError.set('');
    this.bankingApi.getBalance(numero).subscribe({
      next: (balance) => {
        this.bankStore.applyBalanceResponse(balance);
        this.authService.login(numero);
      },
      error: (err: Error) => {
        const msg = err?.message ?? '';
        this.loginError.set(
          /not found|non trovato|Account/i.test(msg)
            ? 'Conto non trovato. Verifica il numero e riprova.'
            : msg || 'Impossibile contattare il servizio. Riprova più tardi.',
        );
      },
    });
  }

  protected navigateTo(hash: string) {
    window.location.hash = hash;
  }
}
