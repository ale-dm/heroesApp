import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginPageComponent } from './pages/loginPage/loginPage.component';
import { RegisterPageComponent } from './pages/registerPage/registerPage.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'login', component: LoginPageComponent},
            { path: 'new-account', component: RegisterPageComponent},
            { path: '**', redirectTo: 'login'},
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule],
})
export class AuthRoutingModule { }
