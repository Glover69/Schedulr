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
| 🎨 SCSS | Styling |
| 📦 Angular CLI | Dev & build tools |

---

## 🧪 Development

To start the development server:

```bash
ng serve

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
