import {ComponentFixture, TestBed} from '@angular/core/testing';
import {storageKey as themeStorageKey, ThemeToggleComponent} from './theme-toggle.component';
import {MatIconModule} from "@angular/material/icon";
import {LocalStorageService, NoopStorage} from "../services/local-storage.service";
import {By} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThemeToggleComponent],
      imports: [MatIconModule],
      providers: [{provide: LocalStorageService, useValue: new NoopStorage()}]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a toggle button', () => {
    expect(getToggleButton()).toBeTruthy();
  });

  it('should toggle between light and dark mode', () => {
    expect(component.getThemeName()).toBe('light');
    getToggleButton().click();
    expect(component.getThemeName()).toBe('dark');
  });

  it('should have the correct aria-label', () => {
    expect(component.getToggleLabel()).toBe('Switch to dark mode');
    component.toggleTheme();
    expect(component.getToggleLabel()).toBe('Switch to light mode');
  });

  it('should store the theme in `localStorage` and set the right theme', () => {
    const storage = TestBed.inject(LocalStorageService);
    const setItemSpy = spyOn(storage, 'setItem');
    const document = TestBed.inject(DOCUMENT);
    component.toggleTheme();
    expect(setItemSpy).toHaveBeenCalledWith(themeStorageKey, 'true');
    const dark_theme = document.getElementById('custom-theme') as HTMLLinkElement;
    expect(dark_theme.href).toContain('dark-theme.css');
    expect(dark_theme.href).not.toContain('light-theme.css');

    component.toggleTheme();
    const light_theme = document.getElementById('custom-theme') as HTMLLinkElement;
    expect(light_theme.href).toContain('light-theme.css');
    expect(dark_theme.href).not.toContain('dark-theme.css');
    expect(setItemSpy).toHaveBeenCalledWith(themeStorageKey, 'false');
  });

  it('should initialize the theme from `localStorage`', () => {
    const storage = TestBed.inject(LocalStorageService);
    const getItemSpy = spyOn(storage, 'getItem').withArgs(themeStorageKey);

    getItemSpy.and.returnValue('false');
    const component1 = TestBed.createComponent(ThemeToggleComponent).componentInstance;
    expect(component1.isDark).toBe(false);

    getItemSpy.and.returnValue('true');
    const component2 = TestBed.createComponent(ThemeToggleComponent).componentInstance;
    expect(component2.isDark).toBe(true);
  });

  //Helper functions
  function getToggleButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement;
  }
});
