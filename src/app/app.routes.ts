import { Routes } from '@angular/router';

import { AgentsComponent } from './components/agents/agents';
import { StatistiquesComponent } from './components/statistiques/statistiques';

import { DashboardComponent } from './components/dashboard/dashboard';
import { Clients } from './components/clients/clients';
import { Accounts } from './components/accounts/accounts';
import { Operations } from './components/operations/operations';
import { CreditsComponent } from './components/credits/credits';

export const routes: Routes = [{ path: '', component:DashboardComponent },
  { path: 'clients', component: Clients },
  { path: 'accounts', component: Accounts },
  { path: 'operations', component: Operations },
  { path: 'credits', component: CreditsComponent },
  { path: 'agents', component: AgentsComponent },
  { path: 'statistiques', component: StatistiquesComponent },
  { path: '**', redirectTo: '' }
];


