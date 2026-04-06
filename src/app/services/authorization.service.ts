import { Injectable } from '@angular/core';
import supabase from "./supabase";

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {

  async getLoggedInUser() {
    const {data, error} = await supabase.auth.getSession();
    return data?.session?.user;
  }

  async getLoggedInUserId() {
    const {data, error} = await supabase.auth.getSession();
    return data?.session?.user?.id;
  }

}
