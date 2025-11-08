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
import { ClienteOnlyGuard } from './interceptor/ClienteOnlyGuard';
import { SupervisorProduccionHome } from './componentes/SupervisorProduccion/supervisor-produccion-home/supervisor-produccion-home';
import { ListarLotes } from './componentes/SupervisorProduccion/listar-lotes/listar-lotes';
import { CrearLote } from './componentes/SupervisorProduccion/crear-lote/crear-lote';
import { RegistrarEntrada } from './componentes/EncargadoAlmacen/registrar-entrada/registrar-entrada';
import { VerStockProducto } from './componentes/EncargadoAlmacen/ver-stock-producto/ver-stock-producto';
import { AlertasStockBajo } from './componentes/EncargadoAlmacen/alertas-stock-bajo/alertas-stock-bajo';
import { EditarLoteComponent } from './componentes/SupervisorProduccion/editar-lote/editar-lote';
import { VerDetalleLote } from './componentes/SupervisorProduccion/ver-detalle-lote/ver-detalle-lote';
import { AdminHome } from './componentes/Administrador/admin-home/admin-home';
import { CrudTrabajador } from './componentes/Administrador/crud-trabajador/crud-trabajador';
import { ListarTrabajadores } from './componentes/Administrador/listar-trabajadores/listar-trabajadores';
import { MiPerfil } from './componentes/mi-perfil/mi-perfil';
import { EditarPerfil } from './componentes/editar-perfil/editar-perfil';

export const routes: Routes = [

    // PUBLIC ROUTES
    { path: '', component: Home, canActivate: [ClienteOnlyGuard] },
    { path: 'login', component: RegistroLoginComponent, canActivate: [PublicGuard] },
    { path: 'codigo-validacion', component: CodigoValidacion, canActivate: [PublicGuard] },
    { path: 'cambio-contrasena', component: CambioContrasena, canActivate: [PublicGuard]  },
    { path: 'producto/:id', component: VerProducto, canActivate: [ClienteOnlyGuard] },

    // GESTOR_PRODUCTOS ROUTES
    { path: 'gestor/home', component: GestorProductosHome, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },
    { path: 'gestor/productos', component: VerProductoGestor, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },
    { path: 'gestor/productos/editar/:id', component: ActualizarProducto, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },
    { path: 'gestor/productos/nuevo', component: CrudProducto, canActivate: [RolesGuard], data: { expectedRole: ["GESTOR_PRODUCTOS", "ADMINISTRADOR"] } },

    //ENCARGADO_ALMACEN ROUTES
    { path: 'almacen/home', component: EncargadoAlmacenHome, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/inventario', component: ResumenInventario, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/stock', component: StockDetallado, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/registrar-entrada', component: RegistrarEntrada, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/ver-stock-producto/:id', component: VerStockProducto, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },
    { path: 'almacen/alertas-stock-bajo', component: AlertasStockBajo, canActivate: [RolesGuard], data: { expectedRole: ["ENCARGADO_ALMACEN", "ADMINISTRADOR"] } },

    //SUPERVISOR DE PRODUCCION ROUTES
    { path: 'supervisor/home', component: SupervisorProduccionHome, canActivate: [RolesGuard], data: { expectedRole: ["SUPERVISOR_PRODUCCION", "ADMINISTRADOR"] } },
    { path: 'supervisor/lotes/listar-lotes', component: ListarLotes, canActivate: [RolesGuard], data: { expectedRole: ["SUPERVISOR_PRODUCCION", "ADMINISTRADOR"] } },
    { path: 'supervisor/lotes/crear', component: CrearLote, canActivate: [RolesGuard], data: { expectedRole: ["SUPERVISOR_PRODUCCION", "ADMINISTRADOR"] } },
    { path: 'supervisor/lotes/ver-detalle/:id', component: VerDetalleLote, canActivate: [RolesGuard], data: { expectedRole: ["SUPERVISOR_PRODUCCION", "ADMINISTRADOR"] } },
    { path: 'supervisor/lotes/editar/:id', component: EditarLoteComponent, canActivate: [RolesGuard], data: { expectedRole: ["SUPERVISOR_PRODUCCION", "ADMINISTRADOR"] } },

    //ADMINISTRADOR ROUTES
    { path: 'admin/dashboard', component: AdminHome, canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },
    { path: 'admin/dashboard/crear-trabajador', component: CrudTrabajador, canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },
    { path: 'admin/dashboard/listar-trabajadores', component: ListarTrabajadores, canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },

    //USUARIO ROUTES
    { path: 'carrito', component: Carrito, canActivate: [AuthGuard] },
    { path: 'orden', component: DetallePedido, canActivate: [AuthGuard] },
    { path: 'mi-perfil', component: MiPerfil, canActivate: [AuthGuard] },
    { path: 'mi-perfil/editar-perfil', component: EditarPerfil, canActivate: [AuthGuard] },

    //STATE BUY ROUTES
    { path: 'pago-exitoso', component: PagoExitoso },
    { path: 'pago-pendiente', component: PagoPendiente },
    { path: 'pago-fallido', component: PagoFallido },

    { path: '**', pathMatch: 'full', redirectTo: ''}
];