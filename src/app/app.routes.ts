import { Routes } from '@angular/router';
import { RegistroLoginComponent } from './componentes/registro-login/registro.component';
import { Home } from './componentes/home/home';
import { CodigoValidacion } from './componentes/codigo-validacion/codigo-validacion';
import { CambioContrasena } from './componentes/cambio-contrasena/cambio-contrasena';
import { AuthGuard, PublicGuard } from './interceptor/AuthGuard';
import { Carrito } from './componentes/carrito/carrito';
import { CrudProducto} from './componentes/crud-productos/crud-productos';
import { RolesGuard } from './servicios/roles.service';
import { DetallePedido } from './componentes/detalle-pedido/detalle-pedido';

export const routes: Routes = [

    // PUBLIC ROUTES
    { path: '', component: Home },
    { path: 'login', component: RegistroLoginComponent, canActivate: [PublicGuard] },
    { path: 'codigo-validacion', component: CodigoValidacion, canActivate: [PublicGuard] },
    { path: 'cambio-contrasena', component: CambioContrasena, canActivate: [PublicGuard]  },

    //ADMIN ROUTES
    { path: 'admin-productos', component: CrudProducto, canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },

    //USUARIO ROUTES
    { path: 'carrito', component: Carrito, canActivate: [AuthGuard] },
    { path: 'orden', component: DetallePedido, canActivate: [AuthGuard] },


    { path: '**', pathMatch: 'full', redirectTo: ''}

];
