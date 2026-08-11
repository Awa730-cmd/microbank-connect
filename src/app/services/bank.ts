import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  
  // Listes principales
  public clients: any[] = [];
  private _soldeCaisse = signal<number>(1000000);
  public soldeCaisse = this._soldeCaisse.asReadonly();
  public dernieresOperations: any[] = [];
  public credits: any[] = [];
  sauvegarderCredits: any;

  constructor() {
    this.chargerDonnees();
  }

  // Charger depuis le localStorage
  private chargerDonnees() {
    const caisseSaved = localStorage.getItem('balanceCaisse');
    if (caisseSaved !== null) {
      this._soldeCaisse.set(Number(caisseSaved));
    }
    
    const clientsSaved = localStorage.getItem('clients');
    if (clientsSaved) {
      this.clients = JSON.parse(clientsSaved);
    }
    
    const opsSaved = localStorage.getItem('dernieresOperations');
    if (opsSaved) {
      this.dernieresOperations = JSON.parse(opsSaved);
    }
    
    const creditsSaved = localStorage.getItem('credits');
    if (creditsSaved) {
      this.credits = JSON.parse(creditsSaved);
    }
  }

  // Sauvegarder dans le localStorage
  public sauvegarderDonnees() {
    localStorage.setItem('balanceCaisse', this._soldeCaisse().toString());
    localStorage.setItem('clients', JSON.stringify(this.clients));
    localStorage.setItem('dernieresOperations', JSON.stringify(this.dernieresOperations));
    localStorage.setItem('credits', JSON.stringify(this.credits));
  }

  // Ajouter un client
  ajouterClient(client: any) {
    const nouveauClient = {
      ...client,
      id: 'CLI-' + (this.clients.length + 1),
      solde: Number(client.soldeInitial) || 0,
      numeroCompte: 'ACC-2026-00#CLI-' + (this.clients.length + 1)
    };
    this.clients.push(nouveauClient);
    this.sauvegarderDonnees();
  }

  // Mettre à jour un client existant
  modifierClient(clientModifie: any) {
    const index = this.clients.findIndex(c => c.id === clientModifie.id || c.numeroCompte === clientModifie.numeroCompte);
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...clientModifie };
      this.sauvegarderDonnees();
    }
  }

  // Récupérer les opérations d'un client spécifique
  getOperationsClient(clientId: string) {
    return this.dernieresOperations.filter(op => op.clientId === clientId || op.compte === clientId);
  }

  // Supprimer un client
  supprimerClient(clientId: any) {
    this.clients = this.clients.filter(c => c.id !== clientId && c.numeroCompte !== clientId);
    this.sauvegarderDonnees();
  }

  // Récupérer la liste des clients
  getClients() {
    return this.clients;
  }

  // --- GESTION DES CRÉDITS ---
  
  getCredits() {
    const creditsSaved = localStorage.getItem('credits');
    if (creditsSaved) {
      this.credits = JSON.parse(creditsSaved);
    }
    return this.credits;
  }

  ajouterCredit(credit: any): boolean {
    this.credits.push(credit);
    this.sauvegarderDonnees();
    return true;
  }

  validerCredit(reference: string): boolean {
    const c = this.credits.find(item => item.reference === reference);
    if (c) {
      c.statut = 'Approuvé';
      this.sauvegarderDonnees();
      return true;
    }
    return false;
  }

 rembourserCredit(reference: string): boolean {
  const c = this.credits.find(item => item.reference === reference);
  if (c) {
    c.statut = 'Remboursé';
    c.montantRestant = 0; // <-- Remet le montant restant à 0

    // Si le crédit possède un échéancier, on marque tout comme payé
    if (c.echeancier && Array.isArray(c.echeancier)) {
      c.echeancier.forEach((e: any) => e.statut = 'PAYÉ');
    }

    this.sauvegarderDonnees();
    return true;
  }
  return false;
}
  // Effectuer une opération (Dépôt / Retrait) avec Alerte
 effectuerOperation(clientId: any, type: string, montantRecu: any) {
    console.log("ID reçu du formulaire :", clientId);
    const montant = Number(montantRecu);
    if (isNaN(montant) || montant <= 0) return false;

    const typeNormalise = type.toLowerCase().trim();

    // 1. Recherche du client
    let clientEmetteur = this.clients.find(c => 
      c.id === clientId || 
      c.numeroCompte === clientId || 
      c.idClient === clientId ||
      c.nom === clientId
    );

    // 2. Solution de secours si non trouvé par ID/Nom
    if (!clientEmetteur && this.clients.length > 0) {
      clientEmetteur = this.clients[0];
    }

    if (clientEmetteur) {
      // 3. Mise à jour des soldes
      if (typeNormalise === 'depot' || typeNormalise === 'dépôt') {
        clientEmetteur.solde = Number(clientEmetteur.solde || 0) + montant;
        this._soldeCaisse.set(Number(this._soldeCaisse()) + montant);
        alert(`Succès : Dépôt de ${montant} FCFA effectué pour ${clientEmetteur.nom} !`);
      } else if (typeNormalise === 'retrait') {
        if (Number(clientEmetteur.solde || 0) >= montant) {
          clientEmetteur.solde = Number(clientEmetteur.solde || 0) - montant;
          this._soldeCaisse.set(Number(this._soldeCaisse()) - montant);
          alert(`Succès : Retrait de ${montant} FCFA effectué !`);
        } else {
          alert("Erreur : Solde insuffisant pour ce retrait !");
          return false;
        }
      }

      // 4. Creation de l'opération avec les clés 'client' et 'compte' lues par le HTML
      const dateDuJour = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      });

      const nouvelleOperation = {
        id: Date.now(),
        clientId: clientEmetteur.id || clientId,
        client: clientEmetteur.nom,
        compte: clientEmetteur.numeroCompte || 'ACC-001',
        type: typeNormalise.includes('depot') ? 'Dépôt' : 'Retrait',
        montant: montant,
        date: dateDuJour,
        statut: 'Validé'
      };

      this.dernieresOperations.unshift(nouvelleOperation);
      this.sauvegarderDonnees();
      return true;
    } else {
      alert("Erreur : Client introuvable.");
      return false;
    }
 }

 effectuerVirement(compteEmetteurId: any, compteDestinataireId: any, montantRecu: any) {
    const montant = Number(montantRecu);
    if (isNaN(montant) || montant <= 0) {
      alert("Montant invalide !");
      return false;
    }

    let emetteur = this.clients.find(c => c.id === compteEmetteurId || c.numeroCompte === compteEmetteurId || c.nom === compteEmetteurId);
    let destinataire = this.clients.find(c => c.id === compteDestinataireId || c.numeroCompte === compteDestinataireId || c.nom === compteDestinataireId);

    if (!emetteur || !destinataire) {
      alert("Erreur : Compte émetteur ou destinataire introuvable.");
      return false;
    }

    const soldeEmetteur = Number(emetteur.solde || 0);
    if (soldeEmetteur < montant) {
      alert("Erreur : Solde insuffisant pour effectuer ce virement !");
      return false;
    }

    emetteur.solde = soldeEmetteur - montant;
    destinataire.solde = Number(destinataire.solde || 0) + montant;

    const dateDuJour = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    const nouvelleOperation = {
      id: Date.now(),
      clientId: emetteur.id,
      client: `${emetteur.nom} ➔ ${destinataire.nom}`,
      compte: emetteur.numeroCompte || 'ACC-001',
      type: 'Virement',
      montant: montant,
      date: dateDuJour,
      statut: 'Validé'
    };

    this.dernieresOperations.unshift(nouvelleOperation);
    this.sauvegarderDonnees();

    alert(`Succès : Virement de ${montant} FCFA effectué !`);
    return true;
  }
}
