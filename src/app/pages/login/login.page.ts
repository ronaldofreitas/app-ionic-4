import { Component,OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'

import { Observable } from "rxjs"
import { LoadingController,AlertController, Platform } from '@ionic/angular'
import { UtilsService } from  '../../services/utils.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

	usAcc:any
	isLoggedIn:Observable<boolean>
	formulario:any={email:'',senha:''}
	loadingcnt:any
	timeoutld:boolean=false
	subscription:any

	constructor(
		private router: Router,
		private auth:AuthService,
		public loadingCtrl: LoadingController,
		public alertController: AlertController,
		public utils:UtilsService,
		private platform: Platform,
		){}

	ngOnInit(){
		let usuario = JSON.parse( localStorage.getItem('user_app') )
		if(usuario){
		  if(usuario.id){
			this.router.navigateByUrl('home')
		  }
		}
	}

	keyDownHandler(event){
		if(event.which === 32){
			event.preventDefault()
		}
	}

	login(){
		if(this.formulario.email == '' || this.formulario.senha == ''){
			this.presentAlert('Atenção','Obrigatório preencher seu email e senha')
			return false
		}
		if(!this.utils.testaEmail(this.formulario.email)){
			this.presentAlert('Atenção','Verifique seu email e tente novamente')
			return false
		}

		this.preloadLogin()
		
		this.timeoutld=true
		this.usAcc = {email:this.formulario.email,password:this.formulario.senha}

		this.auth.login(this.usAcc).subscribe(res => {
			this.loadingcnt.dismiss()
			this.timeoutld=false
			if(res['code'] == 200){
				localStorage.setItem("user_app", JSON.stringify(res))
				this.router.navigateByUrl('filmes')
			}else{
				this.presentAlert('Não foi possível acessar','Tente novamente')
			}
		},
		e => {

			if(this.loadingcnt != undefined){
				this.loadingcnt.dismiss()
			}
			
			this.timeoutld=false

			if( e.error.code == 401 ){
				this.presentAlert('Não foi possível acessar','Usuário ou senha incorretos')
			}else{
				let self = this
				setTimeout(function(){
					if(self.loadingcnt != undefined){
						self.loadingcnt.dismiss()
					}
					self.alertTimeout()
				}, 300);
			}
		});
	}

	async preloadLogin(){
		this.loadingcnt = await this.loadingCtrl.create({
			spinner: "bubbles",
			message: 'Aguarde...',
			translucent: true,
		});
		let self = this
		setTimeout(function(){
			if(self.timeoutld){
				self.loadingcnt.dismiss()
				self.alertTimeout()
			}
		}, 10000);
	
		return this.loadingcnt.present();
	}

	async presentAlert(titulo:string,msg:string){
		const alert = await this.alertController.create({
			header: titulo,
			message: msg,
			buttons: ['OK']
		});
		await alert.present();
	}

	async alertTimeout(){
		const alert = await this.alertController.create({
			header: 'Não foi possível autenticar',
			message: 'Tente novamente mais tarde',
			buttons: ['OK']
		});
		await alert.present();
	}


}
