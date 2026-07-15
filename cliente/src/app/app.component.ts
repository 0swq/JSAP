import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { EventBusService } from './_shared/event-bus.service';
import { StorageService } from './_services/storage.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  eventBusSub?: Subscription;

  constructor(
    private storage: StorageService,
    private eventBus: EventBusService,
  ) {}

  ngOnInit(): void {
    this.eventBusSub = this.eventBus.on('logout', () => {
      this.storage.clean();
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
    this.eventBusSub?.unsubscribe();
  }
}
