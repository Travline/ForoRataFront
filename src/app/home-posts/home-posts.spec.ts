import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePosts } from './home-posts';

describe('HomePosts', () => {
  let component: HomePosts;
  let fixture: ComponentFixture<HomePosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
