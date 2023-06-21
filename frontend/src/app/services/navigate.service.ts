import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  comingFrom = "";
  goingTo = "";

  constructor(private router: Router) {
  }

  navigateTo(comingFrom: string, goingTo: string) {
    if (this.comingFrom === '/cookbook') {
      this.comingFrom = comingFrom;
      this.goingTo = goingTo;
      this.router.navigate(['/cookbook']);
      return;
    }
    this.comingFrom = comingFrom;
    this.goingTo = goingTo;
    this.router.navigate([goingTo]);
  }
}
