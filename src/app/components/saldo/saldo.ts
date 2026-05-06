import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

@Component({
  standalone: true,
  selector: 'app-saldo',
  imports: [CommonModule],
  templateUrl: './saldo.html',
  styleUrl: './saldo.css',
})
export class Saldo {
  protected readonly bank = inject(BankStore);
}
