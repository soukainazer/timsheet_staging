import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueGeneraleComponent } from './vue-generale.component';

describe('VueGeneraleComponent', () => {
  let component: VueGeneraleComponent;
  let fixture: ComponentFixture<VueGeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VueGeneraleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VueGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
