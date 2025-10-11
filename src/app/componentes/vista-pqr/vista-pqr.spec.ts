import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPQR } from './vista-pqr';

describe('VistaPQR', () => {
  let component: VistaPQR;
  let fixture: ComponentFixture<VistaPQR>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaPQR]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaPQR);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
