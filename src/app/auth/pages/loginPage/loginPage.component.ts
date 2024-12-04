import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class LoginPageComponent { 

  constructor( 
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.authService.login('alexdavomar@gmail.com', '12345')
      .subscribe( user => {
        this.router.navigate(['/']);
      } )
  }

}
