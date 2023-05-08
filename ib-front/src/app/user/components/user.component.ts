import {Component, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../shared/components/navigation/navigation.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @ViewChild(NavigationComponent) navigationComponent!: NavigationComponent;

  contentExpanded :boolean = false;

  constructor() {}

  toggleMenu() {
    this.navigationComponent.toggleMenu();
    this.contentExpanded = !this.contentExpanded;
  }

  onToggleSideNav($event: any) {
    this.contentExpanded = true;
  }
}
