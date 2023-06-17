import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPasswordFormComponent } from './renew-password-form.component';

describe('RenewPasswordFormComponent', () => {
  let component: RenewPasswordFormComponent;
  let fixture: ComponentFixture<RenewPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewPasswordFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
