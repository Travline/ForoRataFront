import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideActions } from './side-actions';

describe('SideActions', () => {
  let component: SideActions;
  let fixture: ComponentFixture<SideActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
