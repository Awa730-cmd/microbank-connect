import { Component } from '@angular/core';
import { OperationFormComponent } from "../operation-form/operation-form";

@Component({
  selector: 'app-operations',
  imports: [OperationFormComponent],
  templateUrl: './operations.html',
  styleUrl: './operations.css',
})
export class Operations {}
