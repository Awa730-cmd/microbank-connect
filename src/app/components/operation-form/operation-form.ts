import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BankService } from '../../services/bank';

@Component({
  selector: 'app-operation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './operation-form.html',
  styleUrls: ['./operation-form.css']
})
export class OperationFormComponent {

  operationForm: FormGroup;
  successMessage: string = '';

  // On injecte le service ici
  constructor(private fb: FormBuilder, private bankService: BankService) {
    this.operationForm = this.fb.group({
      typeOperation: ['depot', Validators.required],
      compteId: ['', Validators.required],
      destinataireId: [''],
      montant: ['', [Validators.required, Validators.min(100)]],
      motif: ['']
    });
  }

 onSubmit() {
  if (this.operationForm.valid) {
    const formValues = this.operationForm.value;
    const typeOperation = (formValues.typeOperation || 'depot').toLowerCase().trim();
    const montant = Number(formValues.montant);

    // Si c'est un virement, on appelle la fonction dédiée avec l'émetteur et le destinataire
    if (typeOperation === 'virement') {
    const emetteurId = this.operationForm.get('compteId')?.value;
    const destinataireId = this.operationForm.get('destinataireId')?.value;

    this.bankService.effectuerVirement(emetteurId, destinataireId, montant);
  } else {
    // Sinon, c'est un dépôt ou un retrait classique
    const compteSelectionne = this.operationForm.get('compteId')?.value;
    this.bankService.effectuerOperation(compteSelectionne, typeOperation, montant);
  }

    // Réinitialisation du formulaire
    this.operationForm.reset({ typeOperation: 'depot' });
  } else {
    this.operationForm.markAllAsTouched();
  }
}

  // Liste des comptes disponibles pour le client
  get comptes() {
    return this.bankService.getClients();
  }
}