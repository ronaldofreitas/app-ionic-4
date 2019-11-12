import { Injectable } from  '@angular/core'
import { HttpClient } from  '@angular/common/http'
import { tap } from  'rxjs/operators'
import { of, throwError, Observable, BehaviorSubject } from  'rxjs'
import { environment as ENV} from '../../environments/environment'
import { map, catchError } from 'rxjs/operators'

export interface User {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
      id: number,
      name: string,
      email: string,
      token: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	api:string = ENV.apiURL;
	authSubject:any = new BehaviorSubject(false);

	constructor(private httpClient:HttpClient){}

	login(user:User):Observable<AuthResponse>{
		return this.httpClient.post<AuthResponse>(`${this.api}/usuarios/authenticate`, user).pipe(
			tap(async (res:AuthResponse) => {
				if(res){
					await this.authSubject.next(true);
				}
			})
		);
	}

	logout():void{
		this.authSubject.next(false)
	}

	isLoggedIn():Observable<boolean>{
		return this.authSubject.asObservable();
	}

}
