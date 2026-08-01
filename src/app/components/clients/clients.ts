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
export class Clients implements OnInit {
  private bankService = inject(Bank);
  
  listeClients: any[] = [];
  searchTerm: string = '';

  // Variables du formulaire
  nouveauNom: string = '';
  nouveauEmail: string = '';
  nouveauTelephone: string = '';
  nouveauSolde: number = 0;

  clientEnEdition: any = null;

  // Fonction pour charger les données du client dans le formulaire
  modifierClient(client: any) {
    this.clientEnEdition = client;
    this.nouveauNom = client.nom;
    this.nouveauEmail = client.email;
    this.nouveauTelephone = client.telephone;
  }

  // Fonction pour supprimer un client
  supprimerClient(client: any) {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.bankService.supprimerClient(client.id); // ou selon la méthode de ton service
      
      this.listeClients = this.listeClients.filter(c => c !== client);
      
    }
  }
  ngOnInit(): void {
    this.listeClients = this.bankService.getClients() || [];
  }

  // Fonction d'enregistrement du client
  nouveauClient() {
    if (!this.nouveauNom || !this.nouveauEmail || !this.nouveauTelephone) {
    alert("Veuillez remplir tous les champs obligatoires !");
    return;
  }
      if (this.clientEnEdition) {
  // --- MODE MODIFICATION ---
  this.bankService.modifierClient(
    this.clientEnEdition.id,
    this.nouveauNom,
    this.nouveauEmail,
    this.nouveauTelephone
  );
        // On réinitialise l'état d'édition
        this.clientEnEdition = null; 
      } else {
        // --- MODE Ajout
       this.bankService.ajouterClient(
           this.nouveauNom,
           this.nouveauEmail,
           this.nouveauTelephone,
          this.nouveauSolde || 0,
        );
      }

      localStorage.setItem('clients', JSON.stringify(this.listeClients));

      // Réinitialisation des champs du formulaire
      this.nouveauNom = '';
      this.nouveauEmail = '';
      this.nouveauTelephone = '';
      this.nouveauSolde = 0;
    }

  // Fonction pour les initiales sans erreur
  getInitiales(Clients: any): string {
    if (!Clients || !Clients.nom)return 'CL';
    return Clients.nom.substring(0, 2).toUpperCase();
  }

  // Propriété pour la recherche
  get filteredClients() {
    if (!this.listeClients) return [];
    return this.listeClients.filter((client: { nom: string; email: string; }) => 
      client.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

function filteredClients() {
  throw new Error('Function not implemented.');
}
function getInitiales(client: any, any: any) {
  throw new Error('Function not implemented.');
}

