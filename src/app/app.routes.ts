import { Routes } from '@angular/router';
import { RegistroLoginComponent } from './componentes/registro-login/registro.component';
import { Home } from './componentes/home/home';
import { CodigoValidacion } from './componentes/codigo-validacion/codigo-validacion';
import { CambioContrasena } from './componentes/cambio-contrasena/cambio-contrasena';
import { AuthGuard, PublicGuard } from './interceptor/AuthGuard';
import { Carrito } from './componentes/carrito/carrito';

export const routes: Routes = [

    // PUBLIC ROUTES
    { path: '', component: Home },
    { path: 'login', component: RegistroLoginComponent, canActivate: [PublicGuard] },
    { path: 'codigo-validacion', component: CodigoValidacion, canActivate: [PublicGuard] },
    { path: 'cambio-contrasena', component: CambioContrasena, canActivate: [PublicGuard]  },

    //USUARIO ROUTES
    { path: 'carrito', component: Carrito, canActivate: [AuthGuard] },


    { path: '**', pathMatch: 'full', redirectTo: ''}

];