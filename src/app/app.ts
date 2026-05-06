import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Saldo } from "./components/saldo/saldo";
import { Deposito } from "./components/deposito/deposito";
import { ConvertiCripto } from "./components/converti-cripto/converti-cripto";
import { Prelievo } from "./components/prelievo/prelievo";
import { Navbar } from "./components/navbar/navbar";
import { DettaglioMovimenti } from "./components/dettaglio-movimenti/dettaglio-movimenti";
import { ListaMovimenti } from "./components/lista-movimenti/lista-movimenti";
import { ConvertiFiat } from "./components/converti-fiat/converti-fiat";

@Component({
  selector: 'app-root',
  imports: [Saldo, Deposito, ConvertiCripto, Prelievo, Navbar, DettaglioMovimenti, ListaMovimenti, ConvertiFiat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProgettoBanking');
}
