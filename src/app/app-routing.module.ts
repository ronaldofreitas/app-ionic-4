import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { GuardService } from './services/guard.service'

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  { path: 'filmes', loadChildren: './pages/filmes/filmes.module#FilmesPageModule', canActivate: [GuardService]},
  { path: 'comentarios/:idFilme', loadChildren: './pages/comentarios/comentarios.module#ComentariosPageModule', canActivate: [GuardService]},
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
