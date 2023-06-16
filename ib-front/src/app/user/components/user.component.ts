import {Component, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../core/components/navigation/navigation.component";
import {LoadingService} from "../../core/services/loading.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @ViewChild(NavigationComponent) navigationComponent!: NavigationComponent;

  contentExpanded :boolean = false;

  constructor(public loadingService: LoadingService) {}

  toggleMenu() {
    this.navigationComponent.toggleMenu();
    this.contentExpanded = !this.contentExpanded;
  }

  onToggleSideNav($event: any) {
    this.contentExpanded = true;
  }
}
