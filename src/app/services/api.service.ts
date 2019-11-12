import { Injectable } from  '@angular/core'
import { HttpClient, HttpHeaders} from  '@angular/common/http'
import { tap } from  'rxjs/operators'
import { Observable } from  'rxjs'
import { environment as ENV} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

	api:string = ENV.apiURL

	constructor(private httpClient:HttpClient){}

	setHeader(){
	    const usap = JSON.parse(localStorage.getItem('user_app')) || null;
	    if(usap['data'] != undefined){
	      return new HttpHeaders({
	        'Content-Type': 'application/json',
	        'x-access-token': usap.data.token
	      });
	    }else{
	      return null
	    }
	}
	getFilmes():Observable<any>{
		return this.httpClient.get(`${this.api}/filmes`,{ headers: this.setHeader() }).pipe(
		  tap(async (res) => {
		    await res
		  })
		)
	}
	getComentariosByFilmeId(filmeId:string):Observable<any>{
		return this.httpClient.get(`${this.api}/comentarios/${filmeId}`,{ headers: this.setHeader() }).pipe(
		  tap(async (res) => {
		    await res
		  })
		)
	}
	getComentarios():Observable<any>{
		return this.httpClient.get(`${this.api}/comentarios`,{ headers: this.setHeader() }).pipe(
		  tap(async (res) => {
		    await res
		  })
		)
	}
	criarComentario(comentario:any):Observable<any>{
		return this.httpClient.post<any>(`${this.api}/comentarios`, comentario, { headers: this.setHeader() }).pipe(
		  tap(async (res:any) => {
		    if(res){
		      await res
		    }
		  })
		);
	}
}
