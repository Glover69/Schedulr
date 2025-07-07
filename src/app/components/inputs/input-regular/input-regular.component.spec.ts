import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRegularComponent } from './input-regular.component';

describe('InputRegularComponent', () => {
  let component: InputRegularComponent;
  let fixture: ComponentFixture<InputRegularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputRegularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
