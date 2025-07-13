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
    this.loadAllSchedules()
  }

  loadAllSchedules() {
    const saved = localStorage.getItem('schedulr-schedules');

    if (saved) {
      console.log(JSON.parse(saved))
      this.schedules = JSON.parse(saved)
    }else{
      console.log("not found")
    }

    return saved ? JSON.parse(saved) : [];
  }

  loadSpecificSchedule(id: number) {
    const schedules = this.loadAllSchedules();
    return schedules.find((schedule: any) => schedule.id === id);
  }

  ngOnDestroy() {

  }
}
