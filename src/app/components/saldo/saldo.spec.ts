import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Saldo } from './saldo';

describe('Saldo', () => {
  let component: Saldo;
  let fixture: ComponentFixture<Saldo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Saldo],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Saldo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
