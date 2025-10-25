import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component'; // ← MUDAR PARA LoginComponent

describe('LoginComponent', () => { // ← MUDAR PARA LoginComponent
  let component: LoginComponent; // ← MUDAR PARA LoginComponent
  let fixture: ComponentFixture<LoginComponent>; // ← MUDAR PARA LoginComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent] // ← MUDAR PARA LoginComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent); // ← MUDAR PARA LoginComponent
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});