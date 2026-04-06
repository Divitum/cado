import { Component } from '@angular/core';
import supabase from "../../services/supabase";

@Component({
  selector: 'app-sign-in',
  imports: [],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css',
  standalone: true
})
export class SignInPage {

  googleSignIn() {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://divitum.github.io/cado'
      }
    })
  }
}
