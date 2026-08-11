import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankService } from '../../services/bank'; 

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credits.html',
  styleUrl: './credits.css'
})
export class CreditsComponent implements OnInit {

  public bankService = inject(BankService);

  // Listes
  public credits: any[] = [];
  public comptes: any[] = [];

  // Formulaire
  public nouveauClient: any = null;
  public nouveauMontant: number = 0;
  public nouveauTaux: number = 0;

  // Modale échéance
  public selectedCreditForEcheance: any = null;
  public creditSelectionne: any = null;

  ngOnInit(): void {
    this.chargerCredits();
    this.chargerComptes();
  }

  chargerCredits() {
    this.credits = this.bankService.getCredits() || [];
  }

  chargerComptes() {
    this.comptes = this.bankService.getClients() || [];
  }

  scrollToForm() {
    const element = document.getElementById('formulaireCredit');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  validerNouveauCredit() {
  if (!this.nouveauClient || this.nouveauMontant <= 0) {
    alert("Veuillez sélectionner un client et entrer un montant valide !");
    return;
  }

  // Génération d'un échéancier de 3 mois par exemple
  const montantMensuel = Math.round(this.nouveauMontant / 3);
    const echeancierGenere = [
      { mois: 1, dateDue: '09/05/2026', amountDue: montantMensuel, amountPaid: 0, statut: 'En_attente' },
      { mois: 2, dateDue: '10/05/2026', amountDue: montantMensuel, amountPaid: 0, statut: 'En_attente' },
      { mois: 3, dateDue: '11/05/2026', amountDue: (this.nouveauMontant - (montantMensuel * 2)), amountPaid: 0, statut: 'En_attente' }
    ];

    // Récupérer le nom du client sélectionné
const clientTrouve = this.comptes.find((c: any) => c.id === this.nouveauClient);
const nomClient = clientTrouve ? (clientTrouve.nomComplet || clientTrouve.nom || 'Client') : 'Inconnu';

// Récupérer le nom de l'agent connecté (selon la clé que tu utilises dans ton localStorage)
const agentConnecte = JSON.parse(localStorage.getItem('currentUser') || '{}');
const nomAgent = agentConnecte.nomComplet || agentConnecte.nom || 'Agent';

  const nouveauCredit = {
  reference: `CRE-${Math.floor(1000 + Math.random() * 9000)}`,
  client: this.nouveauClient,
  clientNom: nomClient,         // <-- Ajouté ici pour l'affichage du nom
  agentNom: nomAgent,           // <-- Ajouté ici pour l'agent référent
  montant: Number(this.nouveauMontant),
  montantRestant: Number(this.nouveauMontant), // <-- Indispensable pour le calcul des impayés/remboursements
  taux: Number(this.nouveauTaux || 5),
  statut: 'En_attente',
  echeancier: echeancierGenere
};

  if (this.bankService.ajouterCredit(nouveauCredit)) {
    this.nouveauClient = null;
    this.nouveauMontant = 0;
    this.nouveauTaux = 0;
    this.chargerCredits();
  }
}
  approuverCredit(reference: string) {
    if (this.bankService.validerCredit(reference)) {
      this.chargerCredits();
    }
  }

  payerRemboursement(reference: string) {
    if (this.bankService.rembourserCredit(reference)) {
      this.chargerCredits();
    }
  }

 
  payerEcheance(credit: any, echeance: any) {
    if (echeance.statut !== 'PAYÉ') {
      
      // 1. On trouve le client associé dans la liste des comptes chargés
      const clientConcerne = this.comptes.find((c: any) => c.id === credit.client);
      
      if (clientConcerne) {
        
        const montantAPayer = Number(echeance.amountDue); 
        
        // 2. On déduit le montant du solde du client
        clientConcerne.solde = Number(clientConcerne.solde) - montantAPayer;
        
        // 3. On passe l'échéance en 'Payé'
        echeance.statut = 'PAYÉ';

      this.bankService.sauvegarderDonnees();
      
        
        alert(`Paiement de ${montantAPayer} FCFA effectué ! Nouveau solde de ${clientConcerne.nom} : ${clientConcerne.solde} FCFA.`);
        
        } else {
        alert("Erreur : Impossible de retrouver le compte du client pour déduire le solde.");
        return;
      }

      // 4. Recalculer le montant restant du crédit en additionnant les échéances non payées
const montantRestantCalcule = credit.echeancier
  .filter((e: any) => e.statut !== 'PAYÉ')
  .reduce((acc: number, curr: any) => acc + Number(curr.amountDue || 0), 0);

credit.montantRestant = montantRestantCalcule;

// 5. Vérifier si TOUTES les échéances sont maintenant payées pour solder le crédit
if (credit.echeancier && credit.echeancier.length > 0) {
  const toutPaye = credit.echeancier.every((e: any) => e.statut === 'PAYÉ');
  if (toutPaye) {
    credit.statut = 'Remboursé';
    credit.montantRestant = 0;
    alert(`Le crédit ${credit.reference} est désormais intégralement remboursé !`);
  }
}

// 6. Sauvegarder et rafraîchir l'affichage
this.bankService.sauvegarderDonnees();
this.chargerCredits();
    }
  }

  voirEcheancier(credit: any) {
  this.creditSelectionne = credit;
  console.log("Voici l'échéancier du crédit :", credit.echeancier);
  this.selectedCreditForEcheance = credit;
}




  closeEcheanceView() {
    this.selectedCreditForEcheance = null;
  }

}

