import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankService } from '../../services/bank';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class ClientsComponent implements OnInit {
  private bankService = inject(BankService);

  listeClients: any[] = [];
  searchTerm: string = '';

  // Variables du formulaire
  nouveauNom: string = '';
  nouveauEmail: string = '';
  nouveauTelephone: string = '';
  nouveauSolde: number = 0;
  nouveauTypeCompte: string = 'Courant';

  clientEnEdition: any = null;
  comptes: any;

  ngOnInit(): void {
    // Charge les clients dès l'ouverture de la page
    this.chargerClients();
  }

  chargerClients() {
    this.comptes = this.bankService.getClients();

    const clientsSauvegardes = localStorage.getItem('clients');
    if (clientsSauvegardes) {
      this.listeClients = JSON.parse(clientsSauvegardes);
    }
  }
  modifierClient(client: any) {
    this.clientEnEdition = client;
    this.nouveauNom = client.nom;
    this.nouveauEmail = client.email;
    this.nouveauTelephone = client.telephone;
    this.nouveauSolde = client.solde || 0;
    if (client.typeCompte) {
      this.nouveauTypeCompte = client.typeCompte;
    }
  }

  supprimerClient(client: any) {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.listeClients = this.listeClients.filter((c: any) => c !== client);
      localStorage.setItem('clients', JSON.stringify(this.listeClients));
    }
  }

  enregistrerClient() {
    if (!this.nouveauNom || !this.nouveauEmail || !this.nouveauTelephone) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }

    if (this.clientEnEdition) {
      // --- MODE MODIFICATION ---
      const clientModifie = {
        id: this.clientEnEdition.id,
        nom: this.nouveauNom,
        email: this.nouveauEmail,
        telephone: this.nouveauTelephone
      };
      this.bankService.modifierClient(clientModifie);
      this.clientEnEdition = null;
    } else {
      // --- MODE AJOUT ---
      const prefix = this.nouveauTypeCompte === 'Courant' ? 'CC' : 'CE';
      const randomId = Math.floor(Math.random() * 1000);
      const nouveauNumeroCompte = `ACC-2026-${prefix}-${randomId}`;

      const nouveauClientObj = {
        nom: this.nouveauNom,
        email: this.nouveauEmail,
        telephone: Number(this.nouveauTelephone),
        solde: Number(this.nouveauSolde) || 0,
        numeroCompte: nouveauNumeroCompte,
        typeCompte: this.nouveauTypeCompte
      };

      this.bankService.ajouterClient(nouveauClientObj);
    }

    // On recharge la liste mise à jour
    this.chargerClients();

    // Réinitialisation des champs du formulaire
    this.nouveauNom = '';
    this.nouveauEmail = '';
    this.nouveauTelephone = '';
    this.nouveauSolde = 0;
    this.nouveauTypeCompte = 'Courant';
  }

  // Fonction pour les initiales sans erreur
  getInitiales(client: any): string {
    if (!client || !client.nom) return 'CL';
    return client.nom.substring(0, 2).toUpperCase();
  }

  // Propriété pour la recherche
  get filteredClients() {
    if (!this.listeClients) return [];
    return this.listeClients.filter((client: any) => {
      const nomMatch = client.nom ? client.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      const emailMatch = client.email ? client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      return nomMatch || emailMatch;
    });
  }
}