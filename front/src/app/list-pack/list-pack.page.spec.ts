import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPackPage } from './list-pack.page';

describe('ListPackPage', () => {
  let component: ListPackPage;
  let fixture: ComponentFixture<ListPackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
