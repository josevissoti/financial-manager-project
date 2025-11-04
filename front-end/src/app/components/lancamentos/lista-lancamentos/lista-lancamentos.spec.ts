import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLancamentos } from './lista-lancamentos';

describe('ListaLancamentos', () => {
  let component: ListaLancamentos;
  let fixture: ComponentFixture<ListaLancamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaLancamentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaLancamentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
