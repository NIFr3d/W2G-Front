import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'W2G';
  darkMode = true;

  constructor(private authService: AuthService) {}

  username = '';
  isLoggedIn = false;

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isLoggedIn = this.authService.isLoggedIn();
    if (!this.isLoggedIn && window.location.pathname !== '/index') {
      window.location.href = '/index';
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.username = '';
    this.isLoggedIn = false;
    window.location.reload();
  }
}
