import { Injectable, inject } from '@angular/core';
import { InactivityService } from './inactivity.service';

@Injectable({
  providedIn: 'root'
})
export class TimerResetService {
  private readonly inactivityService = inject(InactivityService);

  public resetInactivityTimer(): void {
    this.inactivityService.resetTimerManually();
  }
}
