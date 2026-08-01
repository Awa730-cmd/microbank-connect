import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationForm } from './operation-form';

describe('OperationForm', () => {
  let component: OperationForm;
  let fixture: ComponentFixture<OperationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
