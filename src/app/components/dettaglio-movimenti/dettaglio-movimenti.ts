import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-dettaglio-movimenti',
  imports: [CommonModule],
  templateUrl: './dettaglio-movimenti.html',
  styleUrl: './dettaglio-movimenti.css',
})
export class DettaglioMovimenti {
  protected readonly bank = inject(BankStore);
}
