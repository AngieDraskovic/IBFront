import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit{
  @Input() options: string[] = [];
  @Input() placeholder: string = "";
  selectedOption?: string;
  menuOpen: boolean = false;

  onChange = (option: string) => {};

  onTouched = () => {};

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onChange(option);
    this.toggleMenu();
  }

  writeValue(option: string): void {
    this.selectedOption = option;
  }

  registerOnChange(fn: (option: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
