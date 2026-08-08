import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
      const compteSelectionne = formValues.compteId || formValues.destinataireId;
      const montant = Number(formValues.montant);
      const typeOperation = formValues.typeOperation || 'depot';

      // Appel direct et propre de la méthode centralisée dans le service BankService
      this.bankService.effectuerOperation(compteSelectionne, typeOperation, montant);

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