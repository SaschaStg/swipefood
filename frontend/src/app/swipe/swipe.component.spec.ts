import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SwipeComponent} from "./swipe.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import { SnackBarService } from '../services/snackbar.service';
import { MatCardModule } from '@angular/material/card';

describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;

  const snackServiceMockData = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule
      ],
      providers: [
        SwipeComponent,
        {provide: SnackBarService,
          useValue: snackServiceMockData
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ],
      declarations: [ SwipeComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
