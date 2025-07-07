import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Schedule} from '../../../models/data.models';
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  schedules: Schedule[] = [

  ]

  constructor() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
