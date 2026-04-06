import {CanActivateFn, Router, Routes} from '@angular/router';
import HomePage from './components/home-page/home-page.component';
import supabase from "./services/supabase";
import {inject} from "@angular/core";
import {SignInPage} from "./components/sign-in/sign-in-page.component";

const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    return true;
  }

  return router.createUrlTree(['/sign-in']);
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: HomePage
  },
  {
    path: 'sign-in',
    component: SignInPage
  }
];
