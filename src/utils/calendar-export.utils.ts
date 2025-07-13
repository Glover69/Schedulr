
// Generate ICS content format from schedule data
export function generateICSContent(scheduleData: any): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Schedulr//Class Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  scheduleData.classes.forEach((classItem: any) => {
    classItem.days.forEach((daySchedule: any) => {
      const events = generateRecurringEvents(classItem, daySchedule, scheduleData.semester);
      lines.push(...events);
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}


// Make each event recurring from the start to end period in the schedule data
export function generateRecurringEvents(classItem: any, daySchedule: any, semester: any): string[] {
  const dayMap: { [key: string]: string } = {
    'Mon': 'MO', 'Tue': 'TU', 'Wed': 'WE', 'Thu': 'TH',
    'Fri': 'FR', 'Sat': 'SA', 'Sun': 'SU'
  };

  // Get first occurrence date
  const startDate = new Date(semester.start_date);
  const endDate = new Date(semester.end_date);
  const firstOccurrence = getFirstOccurrenceDate(startDate, daySchedule.day);
  
  // Generate unique UID
  const uid = `${classItem.course_name.replace(/\s+/g, '-')}-${daySchedule.day}-${Date.now()}@schedulr.app`;
  
  // Convert time to datetime
  const dtstart = formatDateTime(firstOccurrence, daySchedule.start_time);
  const dtend = formatDateTime(firstOccurrence, daySchedule.end_time);
  const until = formatDateTimeUTC(endDate);

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${classItem.course_name}`,
    `LOCATION:${daySchedule.room}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${dayMap[daySchedule.day]};UNTIL=${until}`,
    `DESCRIPTION:Course: ${classItem.course_name}\\nRoom: ${daySchedule.room}`,
    'END:VEVENT'
  ];
}

export function getFirstOccurrenceDate(startDate: Date, targetDay: string): Date {
  const dayNumbers: { [key: string]: number } = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  };
  
  const start = new Date(startDate);
  const targetDayNum = dayNumbers[targetDay];
  const currentDayNum = start.getDay();
  
  const daysToAdd = (targetDayNum - currentDayNum + 7) % 7;
  start.setDate(start.getDate() + daysToAdd);
  
  return start;
}


// Formatting the date & time for each event to match ICS format standard
export function formatDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':');
  const datetime = new Date(date);
  datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return datetime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function formatDateTimeUTC(date: Date): string {
  const utcDate = new Date(date);
  utcDate.setHours(23, 59, 59, 999);
  return utcDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function downloadICSFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}