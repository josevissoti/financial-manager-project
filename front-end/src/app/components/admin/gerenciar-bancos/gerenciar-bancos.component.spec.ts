import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarBancos } from './gerenciar-bancos';

describe('GerenciarBancos', () => {
  let component: GerenciarBancos;
  let fixture: ComponentFixture<GerenciarBancos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarBancos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarBancos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
