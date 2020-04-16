import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPackPage } from './edit-pack.page';

describe('EditPackPage', () => {
  let component: EditPackPage;
  let fixture: ComponentFixture<EditPackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
