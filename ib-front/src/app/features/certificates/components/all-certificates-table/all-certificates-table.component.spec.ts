import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCertificatesTableComponent } from './all-certificates-table.component';

describe('AllCertificatesTableComponent', () => {
  let component: AllCertificatesTableComponent;
  let fixture: ComponentFixture<AllCertificatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCertificatesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCertificatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
