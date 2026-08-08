import { Routes } from '@angular/router';

// --- les COMPOSANTS ---
import { AgentsComponent } from './components/agents/agents';
import { DashboardComponent } from './components/dashboard/dashboard';
import { StatistiquesComponent } from './components/statistiques/statistiques';
import { Parametres } from './components/parametres/parametres';
import { ClientsComponent } from './components/clients/clients';
import { AccountsComponent } from './components/accounts/accounts';
import { Operations } from './components/operations/operations';
import { CreditsComponent } from './components/credits/credits';
import { HistoriqueAgentComponent } from './components/historique-agent/historique-agent';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard';
import { LoginComponent } from './components/login/login';
import { adminGuard } from './admin.guard';
export const routes: Routes = [
  // 1. La route publique de connexion
  { path: 'login', component: LoginComponent },

  // 2. les  routes protégées 
  { path: '', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [adminGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [adminGuard] },
  { path: 'operations', component: Operations, canActivate: [adminGuard] },
  { path: 'credits', component: CreditsComponent, canActivate: [adminGuard] },
  { path: 'agents', component: AgentsComponent, canActivate: [adminGuard] },
  { path: 'statistiques', component: StatistiquesComponent, canActivate: [adminGuard] },
  { path: 'historique-agent', component: HistoriqueAgentComponent, canActivate: [adminGuard] },
  { path: 'client-space', component: ClientDashboardComponent, canActivate: [adminGuard] },
  { path: 'parametres', component: Parametres, canActivate: [adminGuard] },
  { path: 'login', component: LoginComponent },

  // 3. Redirection automatique vers le login si l'URL est inconnue
  { path: '**', redirectTo: 'login' }
];