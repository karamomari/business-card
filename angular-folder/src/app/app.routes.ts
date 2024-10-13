import { provideRouter, RouterModule, Routes, withDebugTracing } from '@angular/router';
import { ApplicationConfig, NgModule } from '@angular/core';
import path from 'path';
import { IndexComponent } from './home/index/index.component';
import { CreateCardComponent } from './card/create-card/create-card.component';
import { ListCardComponent } from './card/list-card/list-card.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
export const routes: Routes = [
    {path:'Add',component:CreateCardComponent},
    {path:'List',component:ListCardComponent},
    {path:'Import',component:FileUploadComponent},
    { path: '**', component: IndexComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
