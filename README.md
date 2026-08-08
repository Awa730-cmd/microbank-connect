#  MicroBank Connect

**Plateforme de Gestion Bancaire et de Microfinance**  
*Module : Développement Frontend Angular v20 — MIAGE 1 (ISI KM)*  
*Enseignant : M. GAYE Abdoulaye*  
*Année académique : 2025 - 2026*
Auteur: 
Nah Awa Faye — Étudiante en Master 1 MIAGE (ISI KM)

---

## Présentation du projet

**MicroBank Connect** est une application web moderne de gestion des opérations courantes d'une institution de microfinance en zone UEMOA. Elle permet d'optimiser la gestion des agences à travers un parcours utilisateur fluide, sécurisé et adapté à plusieurs profils (Client, Agent, Gestionnaire/Administrateur).

---

##  Fonctionnalités principales

* **Authentification & Gestion des rôles :** Connexion sécurisée avec des profils dédiés (`Client`, `Agent`, `Gestionnaire`) et protection des routes par des guards (`CanActivateFn`).
* **Tableau de bord dynamique :** Vues personnalisées selon le rôle avec indicateurs clés, alertes et graphiques.
* **Gestion des Clients :** Fiches clients, création, recherche et historique des relations.
* **Comptes Bancaires :** Ouverture de comptes (courant, épargne) et consultation des soldes en temps réel.
* **Opérations Bancaires :** Dépôts, retraits et virements entre comptes avec validation et formulaires réactifs robustes.
* **Crédits & Prêts :** Simulation de crédit, demandes et suivi de l'échéancier de remboursement.
* **Historique & Relevés :** Liste filtrable des transactions avec options de consultation détaillée.
* **Notifications in-app :** Alertes sur les états d'opérations et les soldes.

---

##  Stack technique

* **Framework :** Angular v20 (Architecture en composants *Standalone* sans NgModules)
* **Gestion d'état :** Angular Signals (`signal`, `computed`, `effect`)
* **Routage :** Angular Router avec *Lazy Loading* par fonctionnalité et Guards de rôles
* **Formulaires :** Reactive Forms avec validateurs personnalisés (gestion des plafonds et montants)
* **Communication HTTP :** `HttpClient` avec intercepteurs pour la gestion des tokens et des erreurs
* **Design UI :** Tailwind CSS (Interface responsive desktop, tablette, mobile)

---

##  Instructions d'installation et de lancement


### 1. Prérequis

* [Node.js](https://nodejs.org/) (recommandé : version LTS)
* Angular CLI v20

### 2. Cloner le dépôt
```bash
git clone [https://github.com/Awa730-cmd/microbank-connect.git](https://github.com/Awa730-cmd/microbank-connect.git)
cd microbank-connect