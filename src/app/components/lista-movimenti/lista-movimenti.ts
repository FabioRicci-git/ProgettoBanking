import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-lista-movimenti',
  imports: [CommonModule],
  templateUrl: './lista-movimenti.html',
  styleUrl: './lista-movimenti.css',
})
export class ListaMovimenti {
  protected readonly bank = inject(BankStore);

  protected selectTransaction(id: string) {
    this.bank.selectTransaction(id);
  }
}
