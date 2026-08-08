import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankService } from '../../services/bank'; 
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

  constructor(public bankService: BankService) {}

  ngOnInit() {
    this.chargerStatistiques();
  }

  // Cette méthode s'exécute à chaque fois que le composant est affiché/initialisé
  ionViewWillEnter() {
    this.chargerStatistiques();
  }
chargerStatistiques() {
  const tousLesCredits = JSON.parse(localStorage.getItem('credits') || '[]');
  
  // Affiche dans la console du navigateur ce que contient chaque crédit
  tousLesCredits.forEach((c: any, index: number) => {
    console.log(`Crédit ${index} - Statut exact :`, JSON.stringify(c.statut));
    console.log(`Crédit ${index} - Montant exact :`, c.montant);
  });

  // On prend  tous les crédits sans filtre pour tester l'affichage
  this.totalCredits = tousLesCredits.reduce((somme: number, credit: any) => somme + Number(credit.montant || 0), 0);
}
  get clientsActifs(): number {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    return clients.length;
  }


  get balanceCaisse(): number {
    return Number(localStorage.getItem('balanceCaisse')) || 0;
  }


 
 get filteredOperations() {
    // On récupère toutes les opérations directement depuis le localStorage
    const toutesLesOperations = JSON.parse(localStorage.getItem('dernieresOperations') || '[]');

    // Si la barre de recherche est vide... (Garde tout le reste de ton code tel quel !)
    if (!this.searchTerm) {
      return toutesLesOperations.slice(0, 5);
    }
    
    return toutesLesOperations.filter((op: any) => 
      (op.type && op.type.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (op.montant && op.montant.toString().includes(this.searchTerm)) ||
      (op.date && op.date.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}