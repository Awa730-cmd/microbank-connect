import { Component, OnInit, ElementRef, ViewChild, signal, computed, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

export type Periode = 'JOUR' | 'MOIS' | 'TRIMESTRE' | 'ANNEE';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrls: ['./statistiques.css']
})
export class StatistiquesComponent implements OnInit, AfterViewInit {

// Signal pour les crédits en souffrance
creditsEnSouffrance = computed(() => {
  const creditsSauvegardes = localStorage.getItem('credits'); // Vérifie que c'est bien la clé 'credits'
  const listeCredits = creditsSauvegardes ? JSON.parse(creditsSauvegardes) : [];
  
  // pour éviter l'erreur "void"
  return listeCredits.map((c: any) => ({
    ...c,
    montantRestantFormatted: `${Number(c.montantRestant || c.montant || 0).toLocaleString('fr-FR')} FCFA`
  }));
});


// 1. Export Excel
  exportToExcel() {
    const data = this.statsData();
    const worksheet = XLSX.utils.json_to_sheet([
      { Métrique: 'Total Clients', Valeur: data.totalClients },
      { Métrique: 'Total Agents', Valeur: data.totalAgents },
      { Métrique: 'Volume Transactions', Valeur: data.volumeTransactions },
      { Métrique: 'Période', Valeur: this.periodeActive() }
    ]);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statistiques');
    XLSX.writeFile(workbook, `Rapport_MicroBank_${new Date().toLocaleDateString()}.xlsx`);
  }

  // 2. Export PDF
  async exportToPDF() {
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    // Capture de l'élément HTML en image
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Création du PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`Rapport_MicroBank_${new Date().toLocaleDateString()}.pdf`);
  }
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  // Signal pour gérer le filtre de période active
  periodeActive = signal<Periode>('MOIS');

  // Signals pour stocker les collections lues depuis localStorage
  allClients = signal<any[]>([]);
  allAgents = signal<any[]>([]);
  allOperations = signal<any[]>([]);
  allCredits = signal<any[]>([]);

  // Propriétés existantes
  totalClients: number = 0;
  totalAgents: number = 0;
  volumeTransactions: number = 0;
  derniersClients: any[] = [];

  // Calcul dynamique réactif (Stats KPI + Données du graphique)
  statsData = computed(() => {
    const maintenant = new Date();
    const periode = this.periodeActive();

    // 1. Filtrage selon la période
    const clientsFiltres = this.allClients().filter(c =>
      this.estDansPeriode(new Date(c.dateCreation || c.createdAt || Date.now()), periode, maintenant)
    );
    const opsFiltrees = this.allOperations().filter(op =>
      this.estDansPeriode(new Date(op.date || op.createdAt || Date.now()), periode, maintenant)
    );

 

    // 2. Métriques dynamiques
    const totalClients = clientsFiltres.length;
    const totalAgents = this.allAgents().length;
    const volume = opsFiltrees.reduce((total: number, op: any) => total + (Number(op.montant) || 0), 0);

    // 3. Configuration de l'axe et des barres du graphique
    const chartConfig = this.genererRepartitions(periode, clientsFiltres, maintenant);

    return {
      totalClients,
      totalAgents,
      volumeTransactions: volume,
      volumeFormatted: `${volume.toLocaleString('fr-FR')} FCFA`,
      labels: chartConfig.labels,
      chartData: chartConfig.data
    };
  });

  constructor() {
    // Met à jour les KPI et re-dessine le graphique à chaque changement de période
    effect(() => {
      const data = this.statsData();
      this.totalClients = data.totalClients;
      this.totalAgents = data.totalAgents;
      this.volumeTransactions = data.volumeTransactions;

      if (this.chart) {
        this.updateChart(data.labels, data.chartData);
      }
    });
  }

  ngOnInit() {
    this.chargerDonnees();
  }

  ngAfterViewInit() {
    this.initChart();
  }

  changerPeriode(p: Periode) {
    this.periodeActive.set(p);
  }

  chargerDonnees() {
    // 1. Récupération des clients depuis localStorage
    const clientsSauvegardes = localStorage.getItem('clients');
    if (clientsSauvegardes) {
      const listeClients = JSON.parse(clientsSauvegardes);
      this.allClients.set(listeClients);
      this.derniersClients = listeClients.slice(-3).reverse();
    } else {
      this.allClients.set([]);
      this.derniersClients = [];
    }

    // 2. Récupération des agents
    const agentsSauvegardes = localStorage.getItem('agents');
    if (agentsSauvegardes) {
      this.allAgents.set(JSON.parse(agentsSauvegardes));
    } else {
      this.allAgents.set([]);
    }

    // 3. Récupération des opérations
    const operationsSauvegardees = localStorage.getItem('dernieresOperations');
    if (operationsSauvegardees) {
      this.allOperations.set(JSON.parse(operationsSauvegardees));
    } else {
      this.allOperations.set([]);
    }

    // 4. Récupération des crédits
const creditsSauvegardes = localStorage.getItem('credits');
if (creditsSauvegardes) {
  this.allCredits.set(JSON.parse(creditsSauvegardes));
} else {
  this.allCredits.set([]);
}
  }

  // 4. Récupération des crédits

  // Filtrage dynamique des dates selon la période choisie
  private estDansPeriode(date: Date, periode: Periode, reference: Date): boolean {
    if (isNaN(date.getTime())) return false;
    const diffJours = (reference.getTime() - date.getTime()) / (1000 * 3600 * 24);

    switch (periode) {
      case 'JOUR':
        return date.toDateString() === reference.toDateString();
      case 'MOIS':
        return date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear();
      case 'TRIMESTRE':
        return diffJours >= 0 && diffJours <= 90;
      case 'ANNEE':
        return date.getFullYear() === reference.getFullYear();
    }
  }

  // Aggrégation mathématique des ouvertures de comptes pour le graphique
  private genererRepartitions(periode: Periode, clients: any[], reference: Date) {
    let labels: string[] = [];
    let data: number[] = [];

    if (periode === 'JOUR') {
      labels = ['00h-04h', '04h-08h', '08h-12h', '12h-16h', '16h-20h', '20h-24h'];
      data = new Array(6).fill(0);
      clients.forEach(c => {
        const h = new Date(c.dateCreation || c.createdAt || Date.now()).getHours();
        data[Math.floor(h / 4)]++;
      });
    } else if (periode === 'MOIS') {
      labels = ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'];
      data = new Array(4).fill(0);
      clients.forEach(c => {
        const j = new Date(c.dateCreation || c.createdAt || Date.now()).getDate();
        const idx = Math.min(Math.floor((j - 1) / 7), 3);
        data[idx]++;
      });
    } else if (periode === 'TRIMESTRE') {
      const m = reference.getMonth();
      labels = [
        new Date(reference.getFullYear(), m - 2, 1).toLocaleString('fr-FR', { month: 'short' }),
        new Date(reference.getFullYear(), m - 1, 1).toLocaleString('fr-FR', { month: 'short' }),
        reference.toLocaleString('fr-FR', { month: 'short' })
      ];
      data = new Array(3).fill(0);
      clients.forEach(c => {
        const d = new Date(c.dateCreation || c.createdAt || Date.now());
        const diffMois = (reference.getFullYear() - d.getFullYear()) * 12 + (reference.getMonth() - d.getMonth());
        if (diffMois >= 0 && diffMois < 3) data[2 - diffMois]++;
      });
    } else {
      labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      data = new Array(12).fill(0);
      clients.forEach(c => {
        const d = new Date(c.dateCreation || c.createdAt || Date.now());
        if (d.getFullYear() === reference.getFullYear()) data[d.getMonth()]++;
      });
    }

    return { labels, data };
  }

  private initChart() {
    const data = this.statsData();
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Ouvertures de comptes',
          data: data.chartData,
          backgroundColor: '#1d4ed8',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  private updateChart(labels: string[], dataValues: number[]) {
    if (!this.chart) return;
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = dataValues;
    this.chart.update();
  }
}