import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Schedule} from '../../../models/data.models';
import { downloadICSFile, generateICSContent } from '../../../utils/calendar-export.utils';
import { environment } from '../../../environments/environment';
import { GoogleAuthService, GoogleUser } from '../../../services/google-auth.service';
import { LabelComponent } from "../../components/label/label.component";
import { SchedulesService } from '../../../services/schedules.service';
import { ButtonComponent } from '../../components/new/button/button.component';
import { InputFieldBaseComponent } from "../../components/new/input-field-base/input-field-base.component";
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonComponent, InputFieldBaseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  schedules: Schedule[] = [

  ]

  clientId = environment.googleClientId
  user!: GoogleUser | null
  first_name?: string = ''

  // Mobile sidebar state
  isSidebarOpen = false;
  isLoading = true;

  greeting = 'Hello';
  private greetingTimer?: number;
  
  constructor(private googleAuthService: GoogleAuthService, private schedulesService: SchedulesService) {

  }

  // ngOnInit() {
  //   this.loadAllSchedules()

  //   this.googleAuthService.user$.subscribe({
  //     next: (user: GoogleUser | null) => {
  //       this.user = user;
  //       // console.log(user)

  //       if (user) {
  //         this.schedulesService.listMine().subscribe({
  //           next: (res: any) => {
  //             this.schedules = res.schedules
  //             console.log(this.schedules)
  //           },
  //           error: (err: any) => {
  //             console.log("An error occured whilst fetching user's schedules: ", err)
  //           },
  //         });
  //       }
  //     },
  //     error: (err: any) => {
  //       console.log("An error occured: ", err)
  //     }
  //   })
  // }


  ngOnInit() {
    this.updateGreeting();
    this.greetingTimer = window.setInterval(() => this.updateGreeting(), 60_000);
    
    // hydrate user, then fetch schedules
    this.googleAuthService.hydrate().then(() => {
      this.googleAuthService.user$.subscribe((u: GoogleUser | null) => {
        this.user = u;
        this.first_name = u?.name.split(' ')[0]
        console.log(u)
        if (u) {
          this.fetchSchedules();
        } else {
          // no user; stop loading so empty/login UI can show
          this.isLoading = false;
        }
      });
    });
  }


  ngOnDestroy() {
    if (this.greetingTimer) window.clearInterval(this.greetingTimer);
  }

  private updateGreeting(date: Date = new Date()) {
    const h = date.getHours(); // user’s local time
    if (h >= 5 && h < 12) this.greeting = 'Good morning';
    else if (h >= 12 && h < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  private fetchSchedules() {
    this.isLoading = true;
    this.schedulesService
      .listMine()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => (this.schedules = res?.schedules ?? []),
        error: () => (this.schedules = []),
      });
  }

  // Toggle helpers
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar() {
    this.isSidebarOpen = false;
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

}
