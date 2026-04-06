import { Component } from '@angular/core';
import supabase from "../../services/supabase";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-sign-in',
  imports: [],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css',
  standalone: true
})
export class SignInPage {

  googleSignIn() {
    debugger;
    console.log('REDIRECT URL: ' + environment.redirectUrl);
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: environment.redirectUrl,
      }
    })
  }
}
