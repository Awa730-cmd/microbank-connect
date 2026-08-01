import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrls: ['./statistiques.css']
})
export class StatistiquesComponent implements OnInit {

  totalClients: number = 0;
  totalAgents: number = 0;
  volumeTransactions: number = 0;
  derniersClients: any[] = []; // Tableau pour stocker les derniers inscrits

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    // 1. On récupère les clients et on prend les derniers enregistrés
    const clientsSauvegardes = localStorage.getItem('clients');
    if (clientsSauvegardes) {
      const listeClients = JSON.parse(clientsSauvegardes);
      this.totalClients = listeClients.length;
      
      // On prend les 3 derniers clients ajoutés et on les inverse pour afficher le plus récent en haut
      this.derniersClients = listeClients.slice(-3).reverse();
    } else {
      this.totalClients = 0;
      this.derniersClients = [];
    }

    // 2. On compte les agents
    const agentsSauvegardes = localStorage.getItem('agents');
    if (agentsSauvegardes) {
      this.totalAgents = JSON.parse(agentsSauvegardes).length;
    } else {
      this.totalAgents = 0;
    }

    // 3. On calcule le volume des transactions
    const operationsSauvegardees = localStorage.getItem('dernieresOperations');
    if (operationsSauvegardees) {
      const listeOperations = JSON.parse(operationsSauvegardees);
      this.volumeTransactions = listeOperations.reduce((total: number, op: any) => {
        const valeurMontant = Number(op.montant) || 0;
        return total + valeurMontant;
      }, 0);
    } else {
      this.volumeTransactions = 0;
    }
  }

}