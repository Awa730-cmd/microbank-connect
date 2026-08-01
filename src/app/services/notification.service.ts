import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private STORAGE_KEY = 'microbank_notifications';
  private notificationsList: string[] = [];
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    // Étape A : On tente de charger les notifications sauvegardées au démarrage
    const savedNotifications = localStorage.getItem(this.STORAGE_KEY);
    if (savedNotifications) {
      this.notificationsList = JSON.parse(savedNotifications);
    } else {
      // Message initial par défaut si le stockage est complètement vide
      this.notificationsList = ['Bienvenue sur Microbank Connect !'];
    }
    // Étape B : On diffuse la liste initialisée à l'application
    this.notificationsSubject.next(this.notificationsList);
  }

  // Méthode pour ajouter une notification
  addNotification(message: string) {
    this.notificationsList.unshift(message);
    this.updateStorage();
  }

  // Méthode pour tout effacer
  clearAll() {
    this.notificationsList = [];
    this.updateStorage();
  }

  // Étape C : Fonction utilitaire privée pour sauvegarder dans le navigateur
  private updateStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notificationsList));
    this.notificationsSubject.next([...this.notificationsList]);
  }
}