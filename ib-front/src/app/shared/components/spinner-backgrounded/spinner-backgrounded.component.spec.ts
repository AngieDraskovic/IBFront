import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerBackgroundedComponent } from './spinner-backgrounded.component';

describe('SpinnerBackgroundedComponent', () => {
  let component: SpinnerBackgroundedComponent;
  let fixture: ComponentFixture<SpinnerBackgroundedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnerBackgroundedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerBackgroundedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
