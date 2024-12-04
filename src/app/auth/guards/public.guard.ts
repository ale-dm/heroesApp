import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard {
    constructor( 
        private authService: AuthService,
        private router: Router,
    ) { }

    private checkAuthStatus(): boolean | Observable<boolean> {
        return this.authService.checkAuthentication()
            .pipe(
                tap( isAuthenticated => {
                    if ( isAuthenticated ) this.router.navigate(['./'])
                }),
            map( isAuthenticated => !isAuthenticated )
            )
    }

    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        console.log('Can Match')
        return this.checkAuthStatus();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        console.log('Can Activate')
        return this.checkAuthStatus();
    }
    
}