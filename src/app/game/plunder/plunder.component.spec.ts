import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlunderComponent } from './plunder.component';

describe('PlunderComponent', () => {
  let component: PlunderComponent;
  let fixture: ComponentFixture<PlunderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlunderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlunderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
