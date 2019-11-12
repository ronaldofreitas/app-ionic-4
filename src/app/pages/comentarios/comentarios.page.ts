import { Component, OnInit, ViewChild,NgZone} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from  '../../services/api.service'
import { LoadingController,ToastController } from '@ionic/angular'
import { IonContent } from "@ionic/angular";
import { FiltraService } from '../../services/filtra.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  loadingcnt:any
  comentarios=[]
  coment:string=''
  toastComent:any

  constructor(
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public filtra:FiltraService,
    public _zone: NgZone,
    public router:Router,
    private api:ApiService){}

  ngOnInit(){
    if(this.route.snapshot.params){
      let id = this.route.snapshot.params['idFilme']
      this.preload()
      this.getComentarios(id)
    }
  }

  getComentarios(id:string){
    let self = this
    this.api.getComentariosByFilmeId(id).subscribe(res => {

      setTimeout(function(){
        if(self.loadingcnt != undefined){
          self.loadingcnt.dismiss()
        }
      }, 200)

      if(res['code'] == 200){
        res.data.forEach(cmts => {
          this.comentarios.push({comentario:cmts.comentario})
        })

        this._zone.run(() => {
          setTimeout(() => {
            this.content.scrollToBottom(300);
          });
        });
      }else{
        console.log('erro ao requisitar comentarios',res)
      }
    },
    e => {
      if(self.loadingcnt != undefined){
        self.loadingcnt.dismiss()
      }
      localStorage.clear();
      this.router.navigateByUrl('login')
      console.log(e)
    })
  }

  comentar(){
    let self = this
    let comnt = this.filtra.trimString(this.coment)
    if(comnt.length > 0){

      let filme = JSON.parse(localStorage.getItem("filme_select"))
      const comt = {
          comentario:comnt,
          filme: filme
      }
      this.api.criarComentario(comt).subscribe(res => {
        this.comentarios.push({comentario:comnt})
        setTimeout(function(){
          self.coment = ''
          self._zone.run(() => {
            setTimeout(() => {
              self.content.scrollToBottom(300);
            });
          });
        }, 200)
      },
      e => {
          self.toasNaoFoiPossivelComentar()
      })

    }
  }

  async preload(){
		this.loadingcnt = await this.loadingCtrl.create({
			spinner: "bubbles",
			message: 'Aguarde...',
			translucent: true,
		});
		return this.loadingcnt.present();
	}
  async toasNaoFoiPossivelComentar() {
    this.toastComent = await this.toastController.create({
      message: 'Não foi possível enviar seu comentário',
      duration: 2500,
      position: 'middle',
      animated:true,
    });
    this.toastComent.present();
  }
}