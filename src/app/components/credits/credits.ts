import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bank } from '../../services/bank'; 

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credits.html',
  styleUrl: './credits.css'
})
export class CreditsComponent implements OnInit {

  private bankService = inject(Bank);
  credits: any[] | undefined;
  
  // Variables
 get listeCredits() {
  return this.bankService.credits;
}
  nouveauMontant: number = 0;
  nouveauTaux: number = 0;
  // La variable pour stocker le client choisi dans le menu déroulant
nouveauClient: string = '';

// On récupère la liste des clients depuis le service pour le menu déroulant
get comptes() {
  return this.bankService.clients;
}
 

ngOnInit(): void {
  this.chargerCredits(); // 2. Charge les crédits au démarrage
  }
  chargerCredits() {
    this.credits = this.bankService.getCredits(); // 3. Récupère les données depuis le service
  }
  

  // Fonctions
  scrollToForm() {
    const element = document.getElementById('formulaireCredit');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  approuverCredit(reference: string) {
    this.bankService.validerCredit(reference);
    this.credits = [...this.bankService.getCredits()];
  }
  payerRemboursement(reference: string) {
  this.bankService.rembourserCredit(reference);
}

rembourserCredit(reference: string) {
    // 1. Appelle le service pour faire le remboursement et mettre à jour le solde
    this.bankService.rembourserCredit(reference);

    // 2. Rafraîchit la liste locale pour voir le changement 
    this.credits = this.bankService.getCredits();
  }
  validerNouveauCredit() {
  if (this.nouveauMontant > 0 && this.nouveauTaux > 0 && this.nouveauClient) {
  this.credits = [...this.bankService.getCredits()]; // Mettre à jour la liste des crédits après l'ajout
    
    // 1. Recherche du nom du client
    const clientChoisi = this.comptes.find((c: any) => c.id === this.nouveauClient);
    const nomDuClient = clientChoisi ? clientChoisi.nom : 'Client inconnu';

    // 2. Création de l'objet crédit
    const nouveauCredit = {
      id: Date.now(),
      reference: 'CRD-' + Math.floor(1000 + Math.random() * 9000),
      clientNom: nomDuClient, 
      montant: this.nouveauMontant,
      taux: this.nouveauTaux,
      statut: 'En attente',
    };

    // 3. Sauvegarde via le service !
    this.bankService.ajouterCredit(nouveauCredit);
    this.credits = [...this.bankService.getCredits()];

    // 4. Réinitialisation des champs du formulaire
    this.nouveauMontant = 0;
    this.nouveauTaux = 0;
    this.nouveauClient = '';
  }
}
}