import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTrainingComponent } from './latest-training.component';

describe('LatestTrainingComponent', () => {
  let component: LatestTrainingComponent;
  let fixture: ComponentFixture<LatestTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
