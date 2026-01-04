# 📅 Schedulr: Your Class Timetable → Calendar Exporter

Schedulr is a simple yet powerful web app that helps primarily students turn boring timetable entries into sleek, recurring calendar events, in seconds!

## 🎯 What Is It Exactly?

Building this came from a personal experience. At the start of school, I always wanted my school timetable in my native calendar app, without having to put everything in one-by-one (mainly because I saw it to be stressful and a long process), especially because I was now getting used to the schedule. My school uses MyCamu for our course registration and it has no in-built way to export your timetable to your native calendar app. So I was like `f*** it`, i'll just build something to help me. And this is what brought about Schedulr! 
This platform makes it effortless to:

✅ Create your class timetable with an intuitive interface  
✅ Set up semester durations and breaks  
✅ Preview your weekly schedule visually  
✅ Export it as a `.ics` file compatible with Google Calendar, Apple Calendar, and Outlook  
✅ Access your schedules across different devices (using your Google Account)

---


## 🧑🏾‍🦱 User Flow

- **Login Page** (Starting point)

  This is the first page you see when you visit the platform (if it's your first time). We use Google for authentication because it's easy and fast (compared to the traditional email and password signups) and almost everyone has literally created a Google account before so, that's the reason for that. It also makes it easier for you to access your saved schedules from any device using that same account. And don't worry, for those cencerned about data, the only information about you we use is your name, email and profile photo (if any).

  ![Login Page](public/screenshots/login.png)


- **Dashboard** (Home page)

  After successfully logging in, you're brought to this simple, yet lovely dashboard (yes, i designed it myself 😆). You're welcomed with a very warm greeting 😂, and this is where you can access your saved schedules, make edits, as well as create new ones when needed.

  ![Dashboard Page](public/screenshots/dashboard.png)


- **Add/Edit Schedules**

  Now we move to talking about the main functionality of the platform. As mentioned earlier, you can create schedules and edit existing ones. Here, I have a personal schedule I created for the just ended semester. When you click on it you have the chance to either edit it, or download it to your device as a `.ics` file, which is the format most (if not all) calendars support. Creating and editing schedules is very easy here. Both processes are done on one single page to avoid building the same thing for slightly different tasks. When you're creating, you start off with a fresh form, and when you're trying to edit, the data for that schedule is populated into the form.

  You start off by inputting a name for the schedule (it can be anything), then the time frame of that schedule. We recommend using the time-frame of your semester, so that when the semester ends, you stop seeing school stuff in your calendar app.

  Step 2 of the process is adding your classes. Each class takes all the days (and their times) you have that class in a week, the name of the class, as well as the rooms/lecture halls you have them in (an optional nice-to-have).


<html>
 <p align="center">
  <img src="public/screenshots/edit-schedule.png" width="48%">
  &nbsp;&nbsp;&nbsp;
  <img src="public/screenshots/add-and-view-classes.png" width="48%">
 </p>
</html>


- **Preview Schedules before saving**

  Personally one of my favorite features, Step 3 allows you to preview your schedule in a calendar-like layout with your classes in all the times you've put them, for all the days of the week. And they're color-coded, to improve clarity when viewing them. After previewing, when all is good, then you can save your schedule (or update if editing) and it'll be accesible on any device that you log in to. You can even use this to plan your schedule ahead of time before registering courses, for instance.

![Preview Page](public/screenshots/preview-schedule.png)
  

