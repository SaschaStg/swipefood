import {Component, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {LocalStorageService} from "../services/local-storage.service";

export const storageKey = 'theme';

//credits to Google / Angular : https://github.com/angular/angular/blob/6f5dabe0d25a5660b7c3001041449b4622dd8924/aio/src/app/shared/theme-picker/theme-toggle.component.ts
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  isDark = false;

  constructor(@Inject(DOCUMENT) private document: Document, private localStorage: LocalStorageService) {
    this.initializeThemeFromPreferences();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    this.updateRenderedTheme();
  }

  private initializeThemeFromPreferences(): void {
    // Check whether there's an explicit preference in localStorage.
    const storedPreference = this.localStorage.getItem(storageKey);
    // If we do have a preference in localStorage, use that. Otherwise,
    // initialize based on the prefers-color-scheme media query.
    if (storedPreference) {
      this.isDark = storedPreference === 'true';
    } else {
      this.isDark = matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }

    const initialTheme = this.document.querySelector('#initial-theme');
    if (initialTheme) {
      initialTheme.remove();
    }

    const themeLink = this.document.createElement('link');
    themeLink.id = 'custom-theme';
    themeLink.rel = 'stylesheet';
    themeLink.href = `${this.getThemeName()}-theme.css`;
    this.document.head.appendChild(themeLink);
    this.initializeThemeWatcher();
  }

  getThemeName(): string {
    return this.isDark ? 'dark' : 'light';
  }

  getToggleLabel(): string {
    return `Switch to ${this.isDark ? 'light' : 'dark'} mode`;
  }

  private updateRenderedTheme(): void {
    // Set the active theme preference in the <html> element.
    const customLinkElement = this.document.getElementById('custom-theme') as HTMLLinkElement | null;
    if (customLinkElement) {
      customLinkElement.href = `${this.getThemeName()}-theme.css`;
    }

    this.localStorage.setItem(storageKey, String(this.isDark));
  }

  initializeThemeWatcher(): void {
    // Listen for changes to the prefers-color-scheme media query. "dark" because "light" indicates none or light theme. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      this.isDark = matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      this.updateRenderedTheme();
    });
  }
}
