import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agents.html',
  styleUrls: ['./agents.css']
})
export class AgentsComponent implements OnInit {

  listeAgents: any[] = [];
  agentsFiltres: any[] = [];
  termeRecherche: string = '';

  // Variables du formulaire connectées au HTML
  nouveauNom: string = '';
  nouvelEmail: string = '';
  nouvelAgence: string = '';
  isEditing: boolean = false;
  agentEnCoursId: any = null;

  ngOnInit() {
    this.chargerAgents();
  }

  chargerAgents() {
    const agentsSauvegardes = localStorage.getItem('agents');
    if (agentsSauvegardes) {
      this.listeAgents = JSON.parse(agentsSauvegardes);
      this.agentsFiltres = [...this.listeAgents];
    } else {
      this.listeAgents = [];
      this.agentsFiltres = [];
    }
  }

  rechercherAgent() {
    const terme = this.termeRecherche.toLowerCase().trim();
    if (!terme) {
      this.agentsFiltres = [...this.listeAgents];
    } else {
      this.agentsFiltres = this.listeAgents.filter(agent => 
        (agent.nom && agent.nom.toLowerCase().includes(terme)) ||
        (agent.email && agent.email.toLowerCase().includes(terme)) ||
        (agent.agence && agent.agence.toLowerCase().includes(terme))
      );
    }
  }

  ajouterOuModifierAgent() {
    if (!this.nouveauNom || !this.nouvelEmail) return;

    let agents = localStorage.getItem('agents') ? JSON.parse(localStorage.getItem('agents')!) : [];

    if (this.isEditing) {
      // Modification
      agents = agents.map((ag: any) => {
        if (ag.id === this.agentEnCoursId) {
          return {
            ...ag,
            nom: this.nouveauNom,
            email: this.nouvelEmail,
            agence: this.nouvelAgence
          };
        }
        return ag;
      });
      this.isEditing = false;
      this.agentEnCoursId = null;
    } else {
      // Ajout
      const nouvelAgent = {
        id: Date.now(),
        nom: this.nouveauNom,
        email: this.nouvelEmail,
        agence: this.nouvelAgence,
        statut: 'Actif'
      };
      agents.push(nouvelAgent);
    }

    localStorage.setItem('agents', JSON.stringify(agents));
    this.reinitialiserFormulaire();
    this.chargerAgents();
  }

  preparerModification(agent: any) {
    this.isEditing = true;
    this.agentEnCoursId = agent.id;
    this.nouveauNom = agent.nom;
    this.nouvelEmail = agent.email;
    this.nouvelAgence = agent.agence;
  }

  basculerStatut(agent: any) {
    let agents = JSON.parse(localStorage.getItem('agents') || '[]');
    agents = agents.map((ag: any) => {
      if (ag.id === agent.id) {
        ag.statut = ag.statut === 'Actif' ? 'Suspendu' : 'Actif';
      }
      return ag;
    });
    localStorage.setItem('agents', JSON.stringify(agents));
    this.chargerAgents();
  }

  supprimerAgent(id: any) {
    let agents = JSON.parse(localStorage.getItem('agents') || '[]');
    agents = agents.filter((ag: any) => ag.id !== id);
    localStorage.setItem('agents', JSON.stringify(agents));
    this.chargerAgents();
  }

  reinitialiserFormulaire() {
    this.nouveauNom = '';
    this.nouvelEmail = '';
    this.nouvelAgence = '';
    this.isEditing = false;
    this.agentEnCoursId = null;
  }

}