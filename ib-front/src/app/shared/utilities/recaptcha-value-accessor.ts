import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 're-captcha',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReCaptchaValueAccessorDirective),
      multi: true
    }
  ]
})
export class ReCaptchaValueAccessorDirective implements ControlValueAccessor {
  onChange: any;
  onTouched: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  writeValue(value: any): void {
    if (value) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    } else {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('resolved', ['$event'])
  onResolve(event: any): void {
    if (event) {
      this.onChange(event);
      this.onTouched();
    }
  }
}
