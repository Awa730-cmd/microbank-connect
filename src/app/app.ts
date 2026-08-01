import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar} from './components/sidebar/sidebar';
import { Navbar} from './components/navbar/navbar';
import { DashboardComponent } from './components/dashboard/dashboard';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, Sidebar, Navbar,  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'microbank-connect';
}