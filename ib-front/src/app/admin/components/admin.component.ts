import {Component, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../core/components/navigation/navigation.component";
import {LoadingService} from "../../core/services/loading.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
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
