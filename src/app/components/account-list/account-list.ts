import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankService } from '../../services/bank';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.css']
})
export class AccountListComponent implements OnInit {
  public bankService = inject(BankService);
  private cdr = inject(ChangeDetectorRef);

  rechercheTexte: string = '';

  ngOnInit(): void {
    // On force le rafraîchissement immédiat de la vue
    this.cdr.detectChanges();
  }

 
  get clientsFiltres() {
    return this.bankService.clients.filter(client => 
      client.nom.toLowerCase().includes(this.rechercheTexte.toLowerCase()) ||
      (client.id && client.id.toString().toLowerCase().includes(this.rechercheTexte.toLowerCase()))
    );
  }

  supprimerClient(client: any) {
    this.bankService.supprimerClient(client);
  }
}



  
  