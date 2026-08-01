import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Bank } from '../../services/bank';
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

  // Liste fictive des comptes disponibles pour le client
  get comptes() {
  return this.bankService.clients;
}

  // On injecte le service ici aussi
  constructor(private fb: FormBuilder, private bankService: Bank) {
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
      // On récupère les valeurs du formulaire
      const type = this.operationForm.value.typeOperation;
      const montant = this.operationForm.value.montant;
      const destinataireId = this.operationForm.value.destinataireId;

      // On envoie ces valeurs à notre service !
      this.bankService.effectuerOperation(
      this.operationForm.value.compteId, 
      type, 
      montant, 
      destinataireId
      );
  
 this.successMessage = 'Opération effectuée avec succès !';
      
     setTimeout(() => {
        this.operationForm.reset({ typeOperation: 'depot' });
        this.successMessage = '';
      }, 3000);

    } else {
      this.operationForm.markAllAsTouched();
    }
  }
}