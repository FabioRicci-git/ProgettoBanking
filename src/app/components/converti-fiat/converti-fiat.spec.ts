import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertiFiat } from './converti-fiat';

describe('ConvertiFiat', () => {
  let component: ConvertiFiat;
  let fixture: ComponentFixture<ConvertiFiat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertiFiat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertiFiat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
