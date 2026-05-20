import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DettaglioMovimenti } from './dettaglio-movimenti';

describe('DettaglioMovimenti', () => {
  let component: DettaglioMovimenti;
  let fixture: ComponentFixture<DettaglioMovimenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioMovimenti],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DettaglioMovimenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
