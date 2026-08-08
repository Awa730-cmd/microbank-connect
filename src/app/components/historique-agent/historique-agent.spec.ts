import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueAgent } from './historique-agent';

describe('HistoriqueAgent', () => {
  let component: HistoriqueAgent;
  let fixture: ComponentFixture<HistoriqueAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriqueAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
