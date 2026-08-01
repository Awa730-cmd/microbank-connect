import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isDropdownOpen = false;
  notifications: string[] = [];

  // On injecte le service ici
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // On s'abonne aux notifications pour mettre à jour l'affichage automatiquement
    this.notificationService.notifications$.subscribe(list => {
      this.notifications = list;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  clearNotifications() {
    this.notificationService.clearAll();
    this.isDropdownOpen = false;
  }
}