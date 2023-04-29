import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertSimpleViewComponent } from './cert-simple-view.component';

describe('CertSimpleViewComponent', () => {
  let component: CertSimpleViewComponent;
  let fixture: ComponentFixture<CertSimpleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertSimpleViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertSimpleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
