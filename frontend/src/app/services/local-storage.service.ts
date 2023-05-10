import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements Storage {
  clear(): void {
    localStorage.clear();
  }

  getItem(key: string) {
    const value = localStorage.getItem(key);
    return value === null ? value : JSON.parse(value);
  }

  key(index: number): string | null {
    return localStorage.key(index);
  }

  get length(): number {
    return localStorage.length;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  setItem(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
