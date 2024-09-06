import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVueGlobalComponent } from './admin-vue-global.component';

describe('AdminVueGlobalComponent', () => {
  let component: AdminVueGlobalComponent;
  let fixture: ComponentFixture<AdminVueGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminVueGlobalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminVueGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
