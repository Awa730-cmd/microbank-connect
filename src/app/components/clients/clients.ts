import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bank } from '../../services/bank';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class ClientsComponent implements OnInit {
  private bankService = inject(Bank);

  listeClients: any[] = [];
  searchTerm: string = '';

  // Variables du formulaire
  nouveauNom: string = '';
  nouveauEmail: string = '';
  nouveauTelephone: string = '';
  nouveauSolde: number = 0;
  nouveauTypeCompte: string = 'Courant'; // Valeur par défaut

  clientEnEdition: any = null;

  ngOnInit() {
    // Va chercher la liste des clients à jour
    const clientsSauvegardes = localStorage.getItem('clients');
    if (clientsSauvegardes) {
      this.listeClients = JSON.parse(clientsSauvegardes);
    }
  }


  // Fonction pour charger les données du client dans le formulaire
  modifierClient(client: any) {
    this.clientEnEdition = client;
    this.nouveauNom = client.nom;
    this.nouveauEmail = client.email;
    this.nouveauTelephone = client.telephone;
    if (client.typeCompte) {
      this.nouveauTypeCompte = client.typeCompte;
    }
  }

  // Fonction pour supprimer un client
  supprimerClient(client: any) {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.listeClients = this.listeClients.filter(c => c !== client);
      localStorage.setItem('clients', JSON.stringify(this.listeClients));
    }
  }

  // Fonction d'enregistrement du client (Ajout ou Modification)
  nouveauClient() {
    if (!this.nouveauNom || !this.nouveauEmail || !this.nouveauTelephone) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    if (this.clientEnEdition) {
      // --- MODE Modification ---
      this.bankService.modifierClient(
        this.clientEnEdition.id,
        this.nouveauNom,
        this.nouveauEmail,
        this.nouveauTelephone
      );
      // On réinitialise l'état d'édition
      this.clientEnEdition = null;
    } else {
      // --- MODE Ajout ---
      const prefix = this.nouveauTypeCompte === 'Courant' ? 'CC' : 'CE';
      const randomId = Math.floor(Math.random() * 1000);
      const nouveauNumeroCompte = `ACC-2026-${prefix}-${randomId}`;

      this.bankService.ajouterClient(
        this.nouveauNom,
        this.nouveauEmail,
        this.nouveauTelephone,
        this.nouveauSolde || 0,
        nouveauNumeroCompte 
      );
    }

    localStorage.setItem('clients', JSON.stringify(this.listeClients));

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