import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import{FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HomeComponent } from './home/home.component';
import { RealComponent } from './real/real.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewAllProductsComponent } from './products/viewallproducts.component';
import { HttpClientModule } from '@angular/common/http';
import { CompareProductsComponent } from './compare-products/compare-products.component';


const firebaseConfig = {
  apiKey: "AIzaSyBMwu__yBCYAigHSmR2WOEjylOwtRKdf6Y",
  authDomain: "ecommerce-cc76b.firebaseapp.com",
  projectId: "ecommerce-cc76b",
  storageBucket: "ecommerce-cc76b.firebasestorage.app",
  messagingSenderId: "853628457025",
  appId: "1:853628457025:web:b690d9abc708dd0f10f6c0",
  measurementId: "G-S89VTZ1NJB"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    RealComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ViewAllProductsComponent,
    CompareProductsComponent,
    SidebarComponent
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ,
  provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
