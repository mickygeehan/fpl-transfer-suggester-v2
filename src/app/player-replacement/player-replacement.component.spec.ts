import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerReplacementComponent } from './player-replacement.component';

describe('PlayerReplacementComponent', () => {
  let component: PlayerReplacementComponent;
  let fixture: ComponentFixture<PlayerReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
