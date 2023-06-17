import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMethodFormComponent } from './confirmation-method-form.component';

describe('ConfirmationMethodFormComponent', () => {
  let component: ConfirmationMethodFormComponent;
  let fixture: ComponentFixture<ConfirmationMethodFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationMethodFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationMethodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
