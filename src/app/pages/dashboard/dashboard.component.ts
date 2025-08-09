import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Schedule} from '../../../models/data.models';
import {ButtonComponent} from '../../components/button/button.component';
import { downloadICSFile, generateICSContent } from '../../../utils/calendar-export.utils';
import { environment } from '../../../environments/environment';
import { GoogleAuthService, GoogleUser } from '../../../services/google-auth.service';
import { LabelComponent } from "../../components/label/label.component";
import { SchedulesService } from '../../../services/schedules.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonComponent, LabelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  schedules: Schedule[] = [

  ]

  clientId = environment.googleClientId
  user!: GoogleUser | null
  
  constructor(private googleAuthService: GoogleAuthService, private schedulesService: SchedulesService) {

  }

  ngOnInit() {
    this.loadAllSchedules()

    this.googleAuthService.user$.subscribe({
      next: (user: GoogleUser | null) => {
        this.user = user;
        // console.log(user)

        if (user) {
          this.schedulesService.listMine().subscribe({
            next: (res: any) => {
              this.schedules = res.schedules
              console.log(this.schedules)
            },
            error: (err: any) => {
              console.log("An error occured whilst fetching user's schedules: ", err)
            },
          });
        }
      },
      error: (err: any) => {
        console.log("An error occured: ", err)
      }
    })
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

  exportToICS(id: number) {
    const scheduleData = this.loadSpecificSchedule(id);
    const icsContent = generateICSContent(scheduleData);
    downloadICSFile(icsContent, `${scheduleData.semester.schedule_name}.ics`);
  }

  ngOnDestroy() {

  }
}
