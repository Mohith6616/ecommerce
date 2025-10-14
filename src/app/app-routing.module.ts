import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { RealComponent } from './real/real.component';
import { AuthGuard } from './services/auth.guard';
import { ViewAllProductsComponent } from './products/viewallproducts.component';
import { EmptyComponent } from './shared/empty.component';
import { ViewProductComponent } from './products/viewproduct.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'products/viewallproducts', component: ViewAllProductsComponent},
  {path:'products/viewallbycategory/:catid', component: ViewAllProductsComponent},
  {path:'products/viewproduct/:id', component: ViewProductComponent},
  {path:'real', component: RealComponent, canActivate: [AuthGuard], children: [
    { path: '', component: EmptyComponent },
    { path: 'all', component: ViewAllProductsComponent },
    { path: 'category/:catid', component: ViewAllProductsComponent },
    { path: 'viewproduct/:id', component: ViewProductComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
