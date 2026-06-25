import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBooking } from './verify-booking';

describe('VerifyBooking', () => {
  let component: VerifyBooking;
  let fixture: ComponentFixture<VerifyBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
