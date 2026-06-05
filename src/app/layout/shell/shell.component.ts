import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { LogoMarkComponent } from '@shared/ui/logo-mark/logo-mark.component';
import { NAV_ITEMS } from './nav';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoMarkComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly user = this.auth.currentUser;
  readonly nav = computed(() => NAV_ITEMS.filter((item) => this.auth.hasSection(item.slug)));

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly currentLabel = computed(
    () => NAV_ITEMS.find((item) => this.url().startsWith(item.path))?.label ?? 'Inicio',
  );

  logout(): void {
    this.auth.logout();
  }

  notifications(): void {
    this.toast.show('Sin notificaciones nuevas.', 'info');
  }
}
