import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bank } from '../../services/bank';
import { AccountListComponent } from '../account-list/account-list'; 

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, AccountListComponent], 
  templateUrl: './accounts.html',
  styleUrls: ['./accounts.css'],
})
export class Accounts {
  constructor(public bankService: Bank) {}

  get listClients() {
    return this.bankService.clients;
  }
}