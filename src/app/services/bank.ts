import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service'

@Injectable({
  providedIn: 'root',
})
export class Bank {
  caisseBalance: number = 0;
  constructor(private notificationService: NotificationService) {}
totalCredits: string | number | undefined;

 supprimerClient(id: string) {
  const clientATrouver = this.clients.find(client => client.id === id);

  if (!clientATrouver) return;

  // 1. Vérification : est-ce que le solde est supérieur à 0 ?
  if (clientATrouver.solde > 0) {
    alert(`Impossible de supprimer le compte de ${clientATrouver.nom} : il reste ${clientATrouver.solde} FCFA. Le compte doit être à 0.`);
    return; // On bloque la suppression
  }
    const nomClient = clientATrouver ? clientATrouver.nom : 'Client inconnu';


    // 2. Suppression si le solde est à 0
  this.clients = this.clients.filter(client => client.id !== id);
  localStorage.setItem('clients', JSON.stringify(this.clients));
    this.clients = this.clients.filter(client => client.id !== id);
    localStorage.setItem('clients', JSON.stringify(this.clients));

    // 🔔 LA NOTIFICATION
    this.notificationService.addNotification(
      `suppression réussie : Le compte de ${nomClient} a été supprimé.`
    );
  }
getComptes() {
  return this.dernieresOperations;
}
  
  soldeCaisse: number = Number(localStorage.getItem('soldeCaisse')) || 0;
  clients: any[] = JSON.parse(localStorage.getItem('clients') || '[]');
  credits: any[] = JSON.parse(localStorage.getItem('credits') || '[]');
  dernieresOperations: any[] = JSON.parse(localStorage.getItem('dernieresOperations') || '[]');

  get clientsActifs(): number {
    return this.clients.length;
  }

  get totalCreditsActifs(): number {
  return this.credits
    .filter(c => c.statut === 'Actif')
    .reduce((acc, c) => acc + Number(c.montant), 0);
}
  
getCredits() {
    return this.credits;

  }
ajouterCredit(credit: any) {
    // 1. Ajouter le crédit au début de la liste
    this.credits.unshift(credit);

  // 3. Sauvegarder toutes les modifications dans le localStorage
  this.sauvegarderDonnees();
}

rembourserCredit(reference: string) {
  // 1. On cherche le crédit correspondant
  const credit= this.credits.find((c: any) => c.reference === reference);

  if (credit && credit.statut === 'Actif') {
    // 2. On change son statut
    credit.statut = 'Remboursé';


// 1. On cherche le compte du client associé à ce crédit
      const compteClientRemboursement = this.clients.find((c: any) => c.nom === credit.clientNom);

      if (compteClientRemboursement) {
        // 2. Le client rembourse la dette : on enlève l'argent de son solde
        compteClientRemboursement.solde -= Number(credit.montant);

        // 3. La banque encaisse l'argent : on ajoute le montant à la caisse
        this.caisseBalance += Number(credit.montant);
      }
      
      // --------------------------------------

    // 🔔 LA NOTIFICATION
    this.notificationService.addNotification(
      `Remboursement réussi : Le crédit Réf. ${reference} a été soldé.`
    );

    // 3. Optionnel : si le remboursement enlève l'argent du compte du client
    const compteConcerne = this.clients.find((c: any) => c.nom === credit.clientNom);
    if (compteConcerne) {
      compteConcerne.solde -= Number(credit.montant);
    }
    this.soldeCaisse += Number(credit.montant); // On ajoute le montant remboursé à la caisse générale

    // 4. Sauvegarde
    this.sauvegarderDonnees();
  }
}




  
  validerCredit(reference: string) {
    // On cherche le crédit qui correspond à la référence cliquée
    const creditATrouver = this.credits.find(c => c.reference === reference);
    
    // Si on le trouve, on change son statut
    if (creditATrouver) {
      creditATrouver.statut = 'Actif';


      // 1. On cherche le compte du client (comme tu l'avais fait dans ajouterCredit)
    const compteConcerne = this.clients.find((c: any) => c.nom === creditATrouver.clientNom);

    if (compteConcerne) {
      // 2. On ajoute l'argent du crédit au solde du client
      compteConcerne.solde += Number(creditATrouver.montant);

      // 3. On retire l'argent de la caisse de la banque 
      
      this.caisseBalance -= Number(creditATrouver.montant); 
    }

      // 🔔 LA NOTIFICATION
    this.notificationService.addNotification(
      `Crédit validé : Le crédit Réf. ${reference} est désormais Actif.`
    );

      this.sauvegarderDonnees();
  }

  }
  getClients() {
    return this.clients;
  }


 ajouterClient(nom: string, email: string, telephone: string, solde: number) {
  const numero = this.clients.length + 1;
  const nouvelleRef = '#CLI-' + numero;

  this.clients.unshift({
    id: nouvelleRef,
    nom: nom,
    email: email,
    telephone: telephone,
    solde: solde,
    statut: 'Actif'
  });

  // 🔔  LA NOTIFICATION
    this.notificationService.addNotification(
      `Nouveau client : Le compte de ${nom} a été créé avec succès.`
    );

  this.sauvegarderDonnees();
}


  // La fonction qui sera appelée quand on valide le formulaire
  effectuerOperation(clientId: any, type: string, montant: number, destinataireId?: string) {

   // 1. Mise à jour de la caisse générale
  if (type === 'depot') {
    this.soldeCaisse += montant;
  } else {
    this.soldeCaisse -= montant;
  }


  // 2. Recherche du compte/client par son ID
const clientEmetteur = this.clients.find(c => c.id === clientId);

if (clientEmetteur) {
  if (type === 'depot') {
    clientEmetteur.solde = (clientEmetteur.solde || 0) + montant;

    // 🔔 LA NOTIFICATION
this.notificationService.addNotification(
  `Dépôt réussi : ${montant} FCFA ajoutés sur le compte de ${clientEmetteur.nom}.`
);

  } 
  else if (type === 'retrait') {
    if ((clientEmetteur.solde || 0) >= montant) {
      clientEmetteur.solde = (clientEmetteur.solde || 0) - montant;

      // 🔔 AJOUTE LA NOTIFICATION DE RÉUSSITE ICI :
  this.notificationService.addNotification(
    `Retrait réussi : ${montant} FCFA retirés du compte de ${clientEmetteur.nom}.`
  );
    } else {

      // 🔔  LA NOTIFICATION D'ÉCHEC
      this.notificationService.addNotification(
        `Échec Retrait : Solde insuffisant (${montant} FCFA demandés).`
      );
      alert("Solde insuffisant pour effectuer le retrait !");
      return;
    }
  } 
  // AJOUT : Si c'est un virement, on gère les deux comptes !
  else if (type === 'transfert' && destinataireId) {
    const clientDestinataire = this.clients.find(c => c.id === destinataireId);
    
    if (clientDestinataire) {
      if ((clientEmetteur.solde || 0) >= montant) {
        clientEmetteur.solde = (clientEmetteur.solde || 0) - montant;      // On retire à l'émetteur
        clientDestinataire.solde = (clientDestinataire.solde || 0) + montant; // On ajoute au destinataire

// 🔔 1. LA NOTIFICATION DE RÉUSSITE :
        this.notificationService.addNotification(
      `Virement réussi : ${montant} FCFA transférés à un autre compte.`
    );
      } else {

        // 🔔 2.  LA NOTIFICATION D'ÉCHEC:
    this.notificationService.addNotification(
      `Échec Virement : Solde insuffisant (${montant} FCFA demandés).`
    );
       
       
        alert("Solde insuffisant pour effectuer le virement !");
        return;
      }
    } else {
      alert("Compte destinataire introuvable !");
      return;
    }
  }
}
    // 2. Formatage du mot pour l'affichage
    const typeFormatte = type === 'depot' ? 'Dépôt' : type === 'retrait' ? 'Retrait' : 'Virement';

    const dateDuJour = new Date().toLocaleDateString('fr-FR', { 
  day: 'numeric', 
  month: 'short', 
  hour: '2-digit', 
  minute: '2-digit' 
});
    this.dernieresOperations.unshift({

      id: Date.now(),
      type: typeFormatte,
      montant: montant,
      date: dateDuJour,
      statut: 'Réussi'
    });
    this.sauvegarderDonnees();
  }



  modifierClient(id: any, nouveauNom: any, nouvelEmail: any, nouveauTelephone: any) {
    const index = this.clients.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      this.clients[index].nom = nouveauNom;
      this.clients[index].email = nouvelEmail;
      this.clients[index].telephone = nouveauTelephone;

      this.sauvegarderDonnees();

      this.notificationService.addNotification(
        `Modification : Le profil de ${nouveauNom} a été mis à jour.`
      );
    }
  }
  private sauvegarderDonnees() {
    localStorage.setItem('soldeCaisse', this.soldeCaisse.toString());
    localStorage.setItem('clients', JSON.stringify(this.clients));
    localStorage.setItem('credits', JSON.stringify(this.credits));
    localStorage.setItem('dernieresOperations', JSON.stringify(this.dernieresOperations));
  }
}



