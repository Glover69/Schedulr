# 📅 Schedulr — Your Class Timetable → Calendar Exporter

Schedulr is a simple yet powerful web app that helps students and educators turn boring timetable entries into sleek, recurring calendar events — in seconds.

✨ Built with Angular | ⚡️ Generates .ics files | 🔁 Supports recurring classes

---

## 🎯 What Is It?

Manually adding weekly classes into your calendar? 😩 Too slow.  
Schedulr makes it effortless to:

✅ Create your class timetable with an intuitive interface  
✅ Set up semester durations and breaks  
✅ Preview your weekly schedule visually  
✅ Export it as a `.ics` file compatible with Google Calendar, Apple Calendar, and Outlook  
✅ Save your data locally (no account needed!)

---

## 🚀 Features

### 🧱 Core Features

- 🧾 **Timetable Input Interface**  
  Add courses with:
  - Course name  
  - Day(s) of the week  
  - Start & end times  
  - Optional room/location  
  - Support for recurring classes  

- 📅 **Semester Settings**  
  - Define semester start and end dates  
  - Include only selected weekdays  
  - Exclude public holidays or mid-semester breaks (manual for now)

- 📥 **ICS File Generator**  
  - One-click export to `.ics`  
  - Works with Google Calendar, Apple Calendar, and Outlook  
  - Handles recurring events based on semester schedule

- 👁️ **Timetable Preview**  
  - Visual grid layout with time blocks  
  - Helps users confirm schedule before exporting

---

### 🧪 MVP+ (If Time Permits)

- 📄 **CSV Import**  
  - Upload a `.csv` file or paste tabular data  
  - Map table headers to course fields

- 💾 **Save to Browser**  
  - LocalStorage saves user sessions  
  - Reuse/edit your timetable later without logging in

---

## 🧭 User Flow

1. 👋 User lands on homepage  
2. 📆 Inputs semester start/end dates and optional breaks  
3. 🧠 Adds each class (course name, days, time, room)  
4. 👁️ Views a live timetable preview  
5. 📤 Clicks “Download Calendar File” to export `.ics`  
6. 🗓️ Imports into Apple/Google/Outlook Calendar

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| ⚙️ Angular | Frontend framework |
| ⏱️ TypeScript | App logic |
| 🎨 SCSS & TailwindCSS | Styling |
| 📦 Angular CLI | Dev & build tools |

---

