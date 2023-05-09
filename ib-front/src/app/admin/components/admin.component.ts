import {Component, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../shared/components/navigation/navigation.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
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
