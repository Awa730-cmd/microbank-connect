import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bank } from '../../services/bank'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Tes variables de statistiques
  totalCredits: number = 0;
 searchTerm = '';

  constructor(public bankService: Bank) {}

  ngOnInit() {
    this.chargerStatistiques();
  }

  // Cette méthode s'exécute à chaque fois que le composant est affiché/initialisé
  ionViewWillEnter() {
    this.chargerStatistiques();
  }

  chargerStatistiques() {
    // Mets ici la logique pour rafraîchir tes données si nécessaire, 
    // ou appelle tes méthodes de service qui calculent les totaux.
  }

  // Garde ton getter pour les clients actifs si tu veux
  get clientsActifs(): number {
    return this.bankService.getClients().length;
  }



  // Ce "getter" remplace ta liste d'opérations classique
  get filteredOperations() {
    // On récupère toutes les opérations depuis le service
    const toutesLesOperations = this.bankService.dernieresOperations;

    // Si la barre de recherche est vide, on renvoie juste les 5 dernières
    if (!this.searchTerm) {
      return toutesLesOperations.slice(0, 5); 
    }

    // Si on a tapé quelque chose, on filtre la liste complète
    return toutesLesOperations.filter((op: any) => 
      (op.type && op.type.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (op.montant && op.montant.toString().includes(this.searchTerm)) ||
      (op.date && op.date.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
  }


function filteredOperations() {
  throw new Error('Function not implemented.');
}
