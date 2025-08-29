import { Routes } from '@angular/router';
import { RegistroLoginComponent } from './componentes/registro-login/registro.component';
import { Home } from './componentes/home/home';
export const routes: Routes = [

    { path: '', component: Home },
    { path: 'login', component: RegistroLoginComponent },
    { path: '**', pathMatch: 'full', redirectTo: ''}
];
