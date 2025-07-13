export type Schedule = {
  semester: semester;
  classes: Class[];
  id: number;
  created_at: Date
}

export type Toast = {
  header: string;
  message: string;
}

export type Class = {
  course_name: string; // e.g., "Intro to AI"
  days: Days[]; // e.g., ["Monday", "Wednesday"]
  color: string;
  color_light: string; // e.g., "#B54708", "#FFFAEB"
}

export type semester = {
  id: string; // Unique identifier for the semester, e.g., "fall-2025"
  schedule_name: string; // e.g., "Fall 2025"
  start_date: string; // e.g., "2025-08-05"
  end_date: string; // e.g., "2025-12-15"
  excluded_dates?: string[]; // e.g., ["2025-10-10", "2025-11-01"]
};

export type Days = {
  day: string; // e.g., "Monday"
  start_time: any
  end_time: any
  room: string
}


