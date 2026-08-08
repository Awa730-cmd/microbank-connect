import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankService } from '../../services/bank';
import { AccountListComponent } from '../account-list/account-list'; 

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, AccountListComponent], 
  templateUrl: './accounts.html',
  styleUrls: ['./accounts.css'],
})
export class AccountsComponent implements OnInit {
  //  variable qui stocke les comptes
  comptes: any[] = []; 

  ngOnInit() {
    // Va chercher la liste à jour dans le localStorage
    const comptesSauvegardes = localStorage.getItem('accounts');
    if (comptesSauvegardes) {
      this.comptes = JSON.parse(comptesSauvegardes);
    }
  }
}