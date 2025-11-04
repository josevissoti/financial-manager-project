import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLancamento } from './form-lancamento';

describe('FormLancamento', () => {
  let component: FormLancamento;
  let fixture: ComponentFixture<FormLancamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLancamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLancamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
