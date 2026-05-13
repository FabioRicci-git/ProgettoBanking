import { Component, HostListener, signal, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { AppIcon } from '../../ui/app-icon/app-icon';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [AppIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly authService = inject(AuthService);
  protected readonly currentHash = signal(window.location.hash || '#home');

  @HostListener('window:hashchange')
  protected onHashChange() {
    this.currentHash.set(window.location.hash || '#home');
  }

  protected isActive(hash: string) {
    return this.currentHash() === hash;
  }

  protected logout() {
    this.authService.logout();
  }
}
