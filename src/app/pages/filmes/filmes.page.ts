import { Component, OnInit,ViewChild } from '@angular/core'
import { ApiService } from  '../../services/api.service'
import { FiltraService } from '../../services/filtra.service'
import { LoadingController,ToastController,IonInfiniteScroll } from '@ionic/angular'
import { Router } from '@angular/router'

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.page.html',
  styleUrls: ['./filmes.page.scss'],
})
export class FilmesPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  loadingcnt:any
  filmes = []
  resultado:boolean=true
  isConnected:boolean = navigator.onLine
  offlineDataInf=[]
  searchCriteria:any
  toastBusca:any
  timerBusca:any
  limitload:number=30

  constructor(
    private api:ApiService,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public filtra:FiltraService,
    public router:Router
    ){}

  ngOnInit(){
    this.preload()
    this.getFilmes()
  }

  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      this.limitload = this.limitload+30
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  getFilmes(){
    let self = this
		this.api.getFilmes().subscribe(res => {
      this.loadingcnt.dismiss()
			if(res['code'] == 200){
        self.resultado=false
        res.data.forEach(flm => {
          var filme = {
            _id:flm._id,
            nome:flm.nome,
            descricao:flm.descricao,
            categoria:flm.categoria,
            categoria_nome:flm.categoria.nome,
          }
          self.filmes.push(filme)  
        })
        localStorage.setItem('data_filmes', JSON.stringify(self.filmes))
			}else{
        self.resultado=true
				console.log('erro ao requisitar filmes',res)
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

  busca(e){
    var texbusc = e.target.value.toLowerCase()
    if(texbusc.length > 1){
      this.offlineDataInf = JSON.parse(localStorage.getItem('data_filmes'))
      let afterFilter = this.filtra.searchFor(this.offlineDataInf,texbusc)

      if(this.toastBusca != undefined){
        this.toastBusca.dismiss()
      }

      if(afterFilter.length > 0){
        this.filmes = afterFilter
      }else{
        this.toasBuscaNaoEncontrada()
      }
    }else if(texbusc.length == 1){
      // 
    }else if(texbusc.length == 0){
      this.offlineDataInf = JSON.parse(localStorage.getItem('data_filmes'))
      this.filmes = this.offlineDataInf
    }
  }

  searchBoxInput(e){
    let self = this
    clearTimeout(self.timerBusca);
    this.timerBusca = setTimeout(function(){
      self.busca(e)
    }, 1400)
  }
  
  detalhes(filme:any){
    localStorage.setItem("filme_select", JSON.stringify(filme))
    this.router.navigateByUrl('comentarios/'+filme._id)
  }

  searchBoxCancel(e){
    this.offlineDataInf = JSON.parse(localStorage.getItem('data_filmes'))
    this.filmes = this.offlineDataInf
    this.limitload = 30
  }
  
	async preload(){
		this.loadingcnt = await this.loadingCtrl.create({
			spinner: "bubbles",
			message: 'Aguarde...',
			translucent: true,
		});
		return this.loadingcnt.present();
	}
  async toasBuscaNaoEncontrada() {
    this.toastBusca = await this.toastController.create({
      message: 'Nada encontrado',
      duration: 1500,
      position: 'top',
      animated:true,
    });
    this.toastBusca.present();
  }
}
