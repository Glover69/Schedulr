import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class LabelComponent {

  @Input() text: string = ""
  @Input() size: "Regular" | "Medium" | "Bold" = "Regular"
  @Input() forButton: boolean = false

}
