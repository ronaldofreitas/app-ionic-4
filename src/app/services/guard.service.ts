import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      const usap = JSON.parse(localStorage.getItem('user_app'))
      if(usap){
        resolve(true);
      }else{
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        resolve(false);
      }
    });
  }
}
