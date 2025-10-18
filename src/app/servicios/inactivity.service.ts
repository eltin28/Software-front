import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private readonly inactivityTime = 60000; // 1 minuto
  private inactivityTimer: any = null;
  private readonly router = inject(Router);
  private logoutCallback: (() => void) | null = null;
  private isTimerActive = false;

  private events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  private resetTimerBound = this.resetTimer.bind(this);

  public setLogoutCallback(callback: () => void): void {
    this.logoutCallback = callback;
  }

  public startInactivityTimer(): void {
    if (this.isTimerActive) return;

    this.isTimerActive = true;
    this.resetTimer();

    this.events.forEach(event => {
      document.addEventListener(event, this.resetTimerBound);
    });
  }

  public stopInactivityTimer(): void {
    this.isTimerActive = false;

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    this.events.forEach(event => {
      document.removeEventListener(event, this.resetTimerBound);
    });
  }

  private resetTimer(): void {
    if (!this.isTimerActive) return;

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.logoutDueToInactivity();
    }, this.inactivityTime);
  }

  private logoutDueToInactivity(): void {
    if (this.logoutCallback && this.isTimerActive) {
      this.stopInactivityTimer();
      this.logoutCallback();
      alert('Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente.');
    }
  }

  public resetTimerManually(): void {
    if (this.isTimerActive) {
      this.resetTimer();
    }
  }
}