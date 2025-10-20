import { Routes } from '@angular/router';
import { RegistroLoginComponent } from './componentes/registro-login/registro.component';
import { VerProducto } from './componentes/ver-producto/ver-producto';
import { Home } from './componentes/home/home';
import { CodigoValidacion } from './componentes/codigo-validacion/codigo-validacion';
import { CambioContrasena } from './componentes/cambio-contrasena/cambio-contrasena';
import { AuthGuard, PublicGuard } from './interceptor/AuthGuard';
import { Carrito } from './componentes/carrito/carrito';
import { CrudProducto} from './componentes/GestorProductos/crud-productos/crud-productos';
import { RolesGuard } from './servicios/roles.service';
import { DetallePedido } from './componentes/detalle-pedido/detalle-pedido';
import { PagoExitoso } from './componentes/Estado-Pago/pago-exitoso/pago-exitoso';
import { PagoFallido } from './componentes/Estado-Pago/pago-fallido/pago-fallido';
import { PagoPendiente } from './componentes/Estado-Pago/pago-pendiente/pago-pendiente';
import { VerProductoGestor } from './componentes/GestorProductos/ver-producto-gestor/ver-producto-gestor';
import { ActualizarProducto } from './componentes/GestorProductos/actualizar-producto/actualizar-producto';
import { GestorProductosHome } from './componentes/GestorProductos/gestor-productos-home/gestor-productos-home';
import { EncargadoAlmacenHome } from './componentes/EncargadoAlmacen/encargado-almacen-home/encargado-almacen-home';
import { ResumenInventario } from './componentes/EncargadoAlmacen/resumen-inventario/resumen-inventario';
import { StockDetallado } from './componentes/EncargadoAlmacen/stock-detallado/stock-detallado';

export const routes: Routes = [

    // PUBLIC ROUTES
    { path: '', component: Home },
    { path: 'login', component: RegistroLoginComponent, canActivate: [PublicGuard] },
    { path: 'codigo-validacion', component: CodigoValidacion, canActivate: [PublicGuard] },
    { path: 'cambio-contrasena', component: CambioContrasena, canActivate: [PublicGuard]  },
    { path: 'producto/:id', component: VerProducto },

    // GESTOR_PRODUCTOS ROUTES
    { path: 'gestor/home', component: GestorProductosHome, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },
    { path: 'gestor/productos', component: VerProductoGestor, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },
    { path: 'gestor/productos/editar/:id', component: ActualizarProducto, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },
    { path: 'gestor/productos/nuevo', component: CrudProducto, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },

    //ENCARGADO_ALMACEN ROUTES
    { path: 'almacen/home', component: EncargadoAlmacenHome, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/inventario', component: ResumenInventario, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/stock', component: StockDetallado, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },

    //USUARIO ROUTES
    { path: 'carrito', component: Carrito, canActivate: [AuthGuard] },
    { path: 'orden', component: DetallePedido, canActivate: [AuthGuard] },

    //STATE BUY ROUTES
    { path: 'pago-exitoso', component: PagoExitoso },
    { path: 'pago-pendiente', component: PagoPendiente },
    { path: 'pago-fallido', component: PagoFallido },

    { path: '**', pathMatch: 'full', redirectTo: ''}
];