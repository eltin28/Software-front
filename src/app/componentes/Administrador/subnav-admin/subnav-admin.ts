import { Component, signal, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';

type TabType = 'resumen' | 'trabajadores' | 'productos' | 'produccion' | 'almacen';

interface Tab {
  id: TabType;
  texto: string;
  icono: string;
}

@Component({
  selector: 'app-admin-subnav',
  imports: [CommonModule, RouterModule ],
  templateUrl: './subnav-admin.html',
  styleUrls: ['./subnav-admin.css']
})
export class AdminSubnavComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly tabs = signal<Tab[]>([
    { id: 'resumen', texto: 'Resumen', icono: 'fa-chart-line' },
    { id: 'trabajadores', texto: 'Trabajadores', icono: 'fa-users' },
    { id: 'productos', texto: 'Productos', icono: 'fa-box' },
    { id: 'produccion', texto: 'Producción', icono: 'fa-industry' },
    { id: 'almacen', texto: 'Almacén', icono: 'fa-warehouse' }
  ]);

  readonly tabActiva = signal<TabType>('resumen');
  @Output() tabChange = new EventEmitter<TabType>();

  @ViewChildren('tabBtn') tabElements!: QueryList<ElementRef<HTMLButtonElement>>;

  private readonly rutas: Record<TabType, string> = {
    resumen: '/admin/dashboard',
    trabajadores: '/admin/dashboard/listar-trabajadores',
    productos: '/gestor/home',
    produccion: '/supervisor/home',
    almacen: '/almacen/home'
  };

  private readonly rutaATab: Record<string, TabType> = {
    '/admin/home': 'resumen',
    '/admin/dashboard/listar-trabajadores': 'trabajadores',
    '/gestor/home': 'productos',
    '/supervisor/home': 'produccion',
    '/almacen/home': 'almacen'
  };

  private readonly destroy$ = new Subject<void>();
  posicionIndicador = 0;
  anchoIndicador = 0;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.sincronizarTabConRuta();
    this.escucharCambiosDeRuta();
  }

  ngAfterViewInit(): void {
    // Calcular posición inicial del indicador después del renderizado
    setTimeout(() => this.actualizarIndicador(), 50);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navegarA(tabId: TabType): void {
    const ruta = this.rutas[tabId];
    if (!ruta) return;

    this.router.navigateByUrl(ruta);
    this.tabActiva.set(tabId);
    this.tabChange.emit(tabId);
    this.actualizarIndicador();
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
          this.actualizarIndicador();
        }
      });
  }

  private actualizarIndicador(): void {
    const activa = this.tabElements?.find(
      (el) => el.nativeElement.classList.contains('active')
    )?.nativeElement;

    if (activa) {
      const rect = activa.getBoundingClientRect();
      const containerRect = activa.parentElement?.getBoundingClientRect();
      if (!containerRect) return;

      this.posicionIndicador = rect.left - containerRect.left;
      this.anchoIndicador = rect.width;
    }
  }
}
