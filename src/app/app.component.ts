import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {title: 'Filmes', url: '/filmes', icon: 'list'},
    {title: 'Logoff',url: '/infracoes',icon: 'list'}
  ];

  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      localStorage.clear();
      this.router.navigateByUrl('login')

      /*let usuario = JSON.parse( localStorage.getItem('user_app') )
      if(usuario['code'] == 200){
        this.router.navigateByUrl('filmes')
      }else{
        this.router.navigateByUrl('login')
      }*/

    });
  }

  sair(){
    localStorage.clear()
    this.router.navigateByUrl('login')
  }
}
