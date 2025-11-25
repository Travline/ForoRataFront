import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusPost } from './focus-post';

describe('FocusPost', () => {
  let component: FocusPost;
  let fixture: ComponentFixture<FocusPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
