import { Routes } from '@angular/router';
import { RegistroLoginComponent } from './componentes/registro-login/registro.component';

export const routes: Routes = [

    { path: 'login', component: RegistroLoginComponent },
    { path: '**', pathMatch: 'full', redirectTo: ''}
];
