import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertiCripto } from './converti-cripto';

describe('ConvertiCripto', () => {
  let component: ConvertiCripto;
  let fixture: ComponentFixture<ConvertiCripto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertiCripto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertiCripto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
