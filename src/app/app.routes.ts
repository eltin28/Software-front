import { Routes } from '@angular/router';
import { RegistroLoginComponent } from './componentes/registro-login/registro.component';
import { Home } from './componentes/home/home';
import { CodigoValidacion } from './componentes/codigo-validacion/codigo-validacion';
import { CambioContrasena } from './componentes/cambio-contrasena/cambio-contrasena';
import { LoginGuard } from './servicios/auth.service';

export const routes: Routes = [

    // PUBLIC ROUTES
    { path: '', component: Home },
    { path: 'login', component: RegistroLoginComponent, canActivate: [LoginGuard] },
    { path: 'codigo-validacion', component: CodigoValidacion },
    { path: 'cambio-contrasena', component: CambioContrasena  },
    { path: '**', pathMatch: 'full', redirectTo: ''}
];
