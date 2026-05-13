import { Component, input } from '@angular/core';

export type AppIconName =
  | 'brand'
  | 'home'
  | 'wallet'
  | 'deposit'
  | 'withdraw'
  | 'crypto'
  | 'exchange'
  | 'movements'
  | 'detail'
  | 'transfer'
  | 'profile'
  | 'hero-balance'
  | 'hero-operations'
  | 'hero-convert';

@Component({
  standalone: true,
  selector: 'app-icon',
  templateUrl: './app-icon.html',
  styleUrl: './app-icon.css',
})
export class AppIcon {
  readonly name = input.required<AppIconName>();
}
