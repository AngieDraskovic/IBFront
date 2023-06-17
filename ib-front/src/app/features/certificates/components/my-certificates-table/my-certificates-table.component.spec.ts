import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCertificatesTableComponent } from './my-certificates-table.component';

describe('MyCertificatesTableComponent', () => {
  let component: MyCertificatesTableComponent;
  let fixture: ComponentFixture<MyCertificatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCertificatesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCertificatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
