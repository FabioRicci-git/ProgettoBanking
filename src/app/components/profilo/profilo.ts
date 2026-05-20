import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';
import { AuthService } from '../../auth.service';

@Component({
  standalone: true,
  selector: 'app-profilo',
  imports: [CommonModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css',
})
export class Profilo implements OnInit {
  protected readonly bank = inject(BankStore);
  protected readonly auth = inject(AuthService);

  /** PAN dimostrativo (non reale) derivato dall'id conto. */
  protected readonly cardPan = computed(() => {
    const id = this.auth.accountId() ?? '0';
    const n = parseInt(id.replace(/\D/g, ''), 10) || 0;
    const last4 = String(10000 + (n % 10000)).slice(-4);
    const block3 = String(1000 + (n % 9000)).slice(-4);
    return `4920 3184 ${block3} ${last4}`;
  });

  protected readonly cardHolder = computed(() => {
    const name = this.bank.ownerName();
    return name && name.trim().length > 0 ? name.toUpperCase() : 'INTESTATARIO';
  });

  protected readonly cardExpiry = '12 / 29';

  protected readonly movementsCount = computed(() => this.bank.transactions().length);

  ngOnInit(): void {
    this.bank.refreshFromApi().subscribe();
  }
}
