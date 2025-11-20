import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideProfile } from './side-profile';

describe('SideProfile', () => {
  let component: SideProfile;
  let fixture: ComponentFixture<SideProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
