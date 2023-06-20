import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {

  }

  openSnackBar(message: string, style?: string, duration?: number) {
    const snackbarStyle = style == "warn" ? "snackbarWarn" : "snackbarPrimary";
    const sbRef = this.snackBar.open(
      message, 'Close', {
        duration: (duration || 0) >= 1000 ? duration : 4000, // if duration is greater than 1000, use duration, else use 4000, so it doesn't disappear too quickly
        panelClass: [snackbarStyle],
      })
    sbRef.onAction().subscribe(() => {
      sbRef.dismiss();
    });
  }
}
