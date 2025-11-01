import { Component, signal, OnInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

type TabType = 'resumen' | 'trabajadores' | 'productos' | 'produccion' | 'almacen';

interface Tab {
  id: TabType;
  texto: string;
  icono: string;
}

@Component({
  selector: 'app-admin-subnav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subnav-admin.html',
  styleUrls: ['./subnav-admin.css']
})
export class AdminSubnavComponent implements OnInit, OnDestroy {

  readonly tabs = signal<Tab[]>([
    { id: 'resumen', texto: 'Resumen', icono: 'fa-chart-line' },
    { id: 'trabajadores', texto: 'Trabajadores', icono: 'fa-users' },
    { id: 'productos', texto: 'Productos', icono: 'fa-box' },
    { id: 'produccion', texto: 'Producción', icono: 'fa-industry' },
    { id: 'almacen', texto: 'Almacén', icono: 'fa-warehouse' }
  ]);

  readonly tabActiva = signal<TabType>('resumen');

  /**
   * Emite cuando cambia la tab activa
   */
  readonly tabChange = output<TabType>();

  private readonly rutas: Record<TabType, string> = {
    resumen: '/admin/home',
    trabajadores: '/admin/trabajadores',
    productos: '/gestor/home',
    produccion: '/supervisor/home',
    almacen: '/almacen/home'
  };

  private readonly rutaATab: Record<string, TabType> = {
    '/admin/home': 'resumen',
    '/admin/trabajadores': 'trabajadores',
    '/gestor/home': 'productos',
    '/supervisor/home': 'produccion',
    '/almacen/home': 'almacen'
  };

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.sincronizarTabConRuta();
    this.escucharCambiosDeRuta();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Navega a la ruta y emite el cambio de tab
   */
  navegarA(tabId: TabType): void {
    const ruta = this.rutas[tabId];
    
    if (ruta) {
      this.router.navigateByUrl(ruta);
      // Emitir cambio para que el dashboard se entere
      this.tabChange.emit(tabId);
    }
  }

  private sincronizarTabConRuta(): void {
    const rutaActual = this.router.url;
    const tabCorrespondiente = this.rutaATab[rutaActual];
    
    if (tabCorrespondiente) {
      this.tabActiva.set(tabCorrespondiente);
      this.tabChange.emit(tabCorrespondiente);
    }
  }

  private escucharCambiosDeRuta(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        const tabCorrespondiente = this.rutaATab[event.urlAfterRedirects];
        
        if (tabCorrespondiente) {
          this.tabActiva.set(tabCorrespondiente);
          this.tabChange.emit(tabCorrespondiente);
        }
      });
  }
}
