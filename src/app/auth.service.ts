import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  login(username: string): void {
    this.cookieService.set('username', username);
  }

  getUsername(): string {
    return this.cookieService.get('username');
  }

  logout(): void {
    this.cookieService.delete('username');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('username');
  }
}
