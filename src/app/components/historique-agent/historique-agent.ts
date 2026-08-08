import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-historique-agent',
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-agent.html',
  styleUrl: './historique-agent.css',
})

export class HistoriqueAgentComponent implements OnInit {
  transactions: any[] = [];
  transactionsFiltrees: any[] = [];
  
  // Variables pour les filtres
  rechercheTexte: string = '';
  typeFiltre: string = 'TOUS';
t: any;

ngOnInit() {
  const data = localStorage.getItem('dernieresOperations');
  
  if (data) {
    const rawData = JSON.parse(data);
    
    
    // Lecture directe et dynamique des propriétés figées lors de l'opération
    this.transactions = rawData.map((op: any) => ({
      date: op.date || '3 août 2026',
      type: op.type || 'Dépôt',
      client: op.client || 'Client inconnu',
      compte: op.compte || 'N/A',
      montant: op.montant || 0
    }));
  } else {
    this.transactions = [];
  }
}


telechargerPDF() {
  console.log('Le bouton PDF a bien été cliqué !');
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Microbank Connect - Historique des Transactions', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

    const lignes = this.transactionsFiltrees.map((t: any) => [
      t.date,
      t.type,
      t.client,
      t.compte,
      `${t.montant} FCFA`
    ]);
    



    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Type', 'Client', 'Compte', 'Montant']],
      body: lignes,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }, 
    });

    doc.save('historique-transactions.pdf');
  }

  filtrerTransactions() {
    this.transactionsFiltrees = this.transactions.filter(t => {
      const clientStr = t.client ? t.client.toLowerCase() : '';
      const compteStr = t.compte ? t.compte.toLowerCase() : '';
      const rechercheStr = this.rechercheTexte ? this.rechercheTexte.toLowerCase() : '';

      const matchTexte = clientStr.includes(rechercheStr) || compteStr.includes(rechercheStr);
      const matchType = !this.typeFiltre || this.typeFiltre === 'TOUS' || t.type === this.typeFiltre;
      
      return matchTexte && matchType;
    });
  }

}
