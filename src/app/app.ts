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
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, Saldo, Deposito, ConvertiCripto, Prelievo, Navbar, DettaglioMovimenti, ListaMovimenti, ConvertiFiat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected isPage(hash: string) {
    return this.currentHash() === hash;
  }
  protected readonly authService = inject(AuthService);
  protected readonly credential = signal('');
  protected readonly password = signal('');
  protected readonly loginError = signal('');
  protected readonly currentHash = signal(window.location.hash || '#home');

  constructor() {
    effect(() => {
      if (!this.authService.isAuthenticated) {
        this.credential.set('');
        this.password.set('');
        this.loginError.set('');
      }
    });
  }

  @HostListener('window:hashchange')
  protected onHashChange() {
    this.currentHash.set(window.location.hash || '#home');
  }

  protected submitLogin(event: Event) {
    event.preventDefault();
    const credential = this.credential().trim();
    const password = this.password().trim();

    if (!credential || !password) {
      this.loginError.set('Compila tutti i campi per accedere.');
      return;
    }

    if (password.length < 4) {
      this.loginError.set('La password deve avere almeno 4 caratteri.');
      return;
    }

    this.loginError.set('');
    this.authService.login();
  }

  protected navigateTo(hash: string) {
    window.location.hash = hash;
  }
}
