import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingLogComponent } from './training-log.component';

describe('TrainingLogComponent', () => {
  let component: TrainingLogComponent;
  let fixture: ComponentFixture<TrainingLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
