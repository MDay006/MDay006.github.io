import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrip } from './edit-trip.component';

describe('EditTrip', () => {
  let component: EditTrip;
  let fixture: ComponentFixture<EditTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
