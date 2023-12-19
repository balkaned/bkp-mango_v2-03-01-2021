import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() simpleMode: boolean = false;

  constructor(
    public router: Router
  ) { }

  irAlHome() {
    this.router.navigate(['/']);
  }

}
