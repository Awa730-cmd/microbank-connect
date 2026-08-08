import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankService } from '../../services/bank';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css'
})
export class ClientDashboardComponent implements OnInit {
  
  // Simule l'utilisateur connecté (CLI-1)
  currentClientId = 'CLI-1';

  clientInfo = signal<any>(null);
  clientCredits = signal<any[]>([]);
  clientOperations = signal<any[]>([]);

  constructor(private bankService: BankService) {}

  ngOnInit(): void {
    this.chargerDonneesClient();
  }

  chargerDonneesClient() {
    // Récupération synchrone des clients depuis le service
    const clients = this.bankService.getClients();

    if (clients && clients.length > 0) {
      const current = clients.find((c: any) => c.id === this.currentClientId) || clients[0];

      if (current) {
        // Met à jour les infos du client avec conversion propre du solde
        this.clientInfo.set({
          ...current,
          solde: Number(current.solde || 0)
        });

        // Récupère l'historique des opérations du client de manière synchrone
        if (current.id) {
          const operationsData = this.bankService.getOperationsClient(current.id);
          this.clientOperations.set(operationsData || []);
        }
      }
    }
  }
}