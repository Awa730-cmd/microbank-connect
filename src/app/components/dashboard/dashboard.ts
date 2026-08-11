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

  //  variables de statistiques
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
  this.totalCredits = tousLesCredits
  .filter((c: any) => c.statut !== 'Remboursé' && c.statut !== 'Rejeté')
  .reduce((somme: number, credit: any) => somme + Number(credit.montantRestant || credit.montant || 0), 0);
}


  get clientsActifs(): number {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    return clients.length;
  }


  get balanceCaisse(): number {
    // 1. Récupérer la base de la caisse enregistrée
  const caisseDeBase = Number(localStorage.getItem('balanceCaisse')) || 0;

  // 2. Récupérer tous les crédits pour calculer les intérêts perçus ou à percevoir
  const tousLesCredits = JSON.parse(localStorage.getItem('credits') || '[]');
  
  let totalInterets = 0;
  tousLesCredits.forEach((c: any) => {
    // Si le crédit a un taux d'intérêt, on calcule la part des intérêts
    const taux = Number(c.taux || 5); // Par défaut 5% si non défini
    const montantPrincipal = Number(c.montant || 0);
    const interetCredit = montantPrincipal * (taux / 100);

    // Option A : Ajouter les intérêts proportionnellement aux échéances payées
    if (c.echeancier && Array.isArray(c.echeancier)) {
      const echeancesPayees = c.echeancier.filter((e: any) => e.statut === 'PAYÉ').length;
      const totalEcheances = c.echeancier.length;
      if (totalEcheances > 0) {
        totalInterets += (interetCredit / totalEcheances) * echeancesPayees;
      }
    } 
    // Option B (alternative si tout est remboursé) : si c.statut === 'Remboursé', on prend tout l'intérêt
    else if (c.statut === 'Remboursé') {
      totalInterets += interetCredit;
    }
  });

  // 3. Retourner la caisse de base augmentée des intérêts perçus
  return caisseDeBase + Math.round(totalInterets);
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