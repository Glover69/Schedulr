# Schedulr iOS App - Product Requirements Document

## 📋 Table of Contents
- [1. Executive Summary](#1-executive-summary)
- [2. Product Overview](#2-product-overview)
- [3. User Personas & Use Cases](#3-user-personas--use-cases)
- [4. Feature Requirements](#4-feature-requirements)
- [5. Technical Requirements](#5-technical-requirements)
- [6. User Experience & Design](#6-user-experience--design)
- [7. Data Models](#7-data-models)
- [8. API Integration](#8-api-integration)
- [9. Security & Privacy](#9-security--privacy)
- [10. Performance Requirements](#10-performance-requirements)
- [11. Platform-Specific Features](#11-platform-specific-features)
- [12. Release Strategy](#12-release-strategy)
- [13. Success Metrics](#13-success-metrics)

---

## 1. Executive Summary

### 1.1 Product Vision
Schedulr iOS is a native mobile application that empowers students and educators to effortlessly create, manage, and export their class schedules to their preferred calendar applications. Building upon the successful web platform, the iOS app will provide an optimized mobile experience for schedule management on-the-go.

### 1.2 Business Objectives
- Expand Schedulr's reach to iOS users
- Increase user engagement through native mobile experience
- Leverage iOS-specific features for enhanced usability
- Maintain feature parity with the web platform while optimizing for mobile

### 1.3 Key Value Propositions
- **Effortless Schedule Creation**: Intuitive interface for building class timetables
- **Universal Calendar Export**: Generate .ics files compatible with all major calendar apps
- **Cloud Synchronization**: Seamless data sync across devices
- **Mobile-First Design**: Optimized for iPhone usage patterns

---

## 2. Product Overview

### 2.1 Core Functionality
Schedulr iOS transforms the manual process of adding recurring classes to calendars into a streamlined, one-tap experience. Users can:

1. Create comprehensive semester schedules
2. Add classes with detailed information (times, locations, colors)
3. Preview their weekly timetable
4. Export to .ics format for calendar import
5. Manage multiple schedules across different semesters

### 2.2 Target Platform
- **Primary**: iOS 18.0+
- **Devices**: iPhone (primary), iPad (secondary)
- **Orientation**: Portrait (primary), landscape support for timetable preview

### 2.3 Current Web Platform Analysis
The existing Angular web application includes:
- Google OAuth authentication
- Multi-step schedule creation wizard
- Real-time timetable preview
- Cloud data persistence
- Responsive design with mobile considerations
- Feedback system and version management

---

## 3. User Personas & Use Cases

### 3.1 Primary Personas

#### 3.1.1 College Student - "Alex"
- **Age**: 18-22
- **Tech Savvy**: High
- **Pain Points**: 
  - Manually entering recurring classes into calendar
  - Keeping track of room changes
  - Managing multiple semester schedules
- **Goals**: Quick schedule setup, reliable calendar integration

#### 3.1.2 Graduate Student - "Sarah"
- **Age**: 23-28
- **Tech Savvy**: Medium-High
- **Pain Points**: 
  - Complex schedules with irregular timings
  - Need for detailed location information
  - Sharing schedules with study groups
- **Goals**: Detailed schedule management, export flexibility

#### 3.1.3 University Staff - "Dr. Johnson"
- **Age**: 30-55
- **Tech Savvy**: Medium
- **Pain Points**: 
  - Managing teaching schedules across semesters
  - Coordinating with administrative calendars
- **Goals**: Professional schedule management, easy updates

### 3.2 User Journey Map

#### 3.2.1 First-Time User Journey
1. **Discovery**: Download app from App Store
2. **Onboarding**: Brief feature introduction
3. **Authentication**: Sign in with Google
4. **First Schedule**: Create semester with guided wizard
5. **Class Addition**: Add first class with detailed information
6. **Preview**: View generated timetable
7. **Export**: Download .ics file and import to calendar
8. **Success**: Classes appear in default calendar app

#### 3.2.2 Returning User Journey
1. **Launch**: Open app, auto-login
2. **Dashboard**: View existing schedules
3. **Management**: Edit/add classes or create new semester
4. **Export**: Quick export to calendar
5. **Sync**: Changes reflected across devices

---

## 4. Feature Requirements

### 4.1 MVP Features (Phase 1)

#### 4.1.1 Authentication & Account Management
- **Google OAuth Integration**
  - Single sign-on with Google account
  - Secure token management
  - Account linking/unlinking
  - Auto-login for returning users

#### 4.1.2 Schedule Creation Wizard
- **Semester Setup**
  - Schedule name input
  - Start and end date selection (iOS date picker)
  - Academic calendar integration
  
- **Class Information Input**
  - Course name
  - Multiple day selection (checkboxes)
  - Time selection (iOS time picker)
  - Room/location information
  - Color coding (color picker)

#### 4.1.3 Dashboard & Schedule Management
- **Schedule Overview**
  - Grid/card view of all schedules
  - Quick actions (edit, delete, export)
  - Visual schedule previews
  - Search and filter capabilities

#### 4.1.4 Timetable Preview
- **Weekly View**
  - Color-coded time blocks
  - Scrollable time grid
  - Class details on tap
  - Landscape mode optimization

#### 4.1.5 Calendar Export
- **ICS Generation**
  - Standard .ics format
  - Recurring event creation
  - Metadata inclusion (location, description)
  - Share sheet integration

#### 4.1.6 Data Synchronization
- **Cloud Sync**
  - Real-time data backup
  - Cross-device synchronization
  - Offline capability with sync on connection
  - Conflict resolution

### 4.2 Enhanced Features (Phase 2)

#### 4.2.1 iOS-Specific Integrations
- **Native Calendar Integration**
  - Direct calendar app import
  - EventKit framework usage
  - Calendar permission management
  
- **Shortcuts Support**
  - Siri shortcuts for quick actions
  - "Add to Calendar" voice command
  - Quick export shortcuts

#### 4.2.2 Widget Support
- **Today Widget**
  - Current day schedule display
  - Next class information
  - Quick schedule access

#### 4.2.3 Advanced Schedule Features
- **Schedule Templates**
  - Semester templates
  - Class type presets
  - Quick duplicate functionality

- **Bulk Operations**
  - Multi-class editing
  - Batch color changes
  - Schedule merging

#### 4.2.4 Sharing & Collaboration
- **Schedule Sharing**
  - Share via link
  - QR code generation
  - Social media integration

### 4.3 Future Enhancements (Phase 3)

#### 4.3.1 Apple Watch Support
- **Glance View**: Next class information
- **Complications**: Schedule data on watch face
- **Notifications**: Class reminders

#### 4.3.2 Advanced Analytics
- **Usage Statistics**: Schedule creation patterns
- **Time Analysis**: Class distribution insights
- **Export Tracking**: Calendar integration success

---

## 5. Technical Requirements

### 5.1 Development Stack

#### 5.1.1 Primary Technologies
- **Language**: Swift 5.0+
- **Framework**: SwiftUI
- **Architecture**: MVVM with Combine
- **Dependency Management**: Swift Package Manager
- **Backend**: Node.js/Express (existing)

#### 5.1.2 Key Frameworks & Libraries
- **Networking**: URLSession with async/await
- **Authentication**: GoogleSignIn SDK
- **Data Persistence**: Core Data
- **Calendar Integration**: EventKit
- **UI Components**: Custom design system
- **Analytics**: Firebase Analytics (optional)

### 5.2 System Architecture

#### 5.2.1 App Architecture
```
┌─────────────────────────────────────┐
│             Presentation            │
│   ViewControllers & ViewModels      │
├─────────────────────────────────────┤
│              Business               │
│        Services & Managers          │
├─────────────────────────────────────┤
│               Data                  │
│     Core Data & Network Layer       │
├─────────────────────────────────────┤
│              External               │
│      APIs & System Services         │
└─────────────────────────────────────┘
```

#### 5.2.2 Data Flow
1. **User Input** → ViewModel
2. **ViewModel** → Service Layer
3. **Service** → API/Core Data
4. **Response** → ViewModel → UI Update

### 5.3 Core Data Model

#### 5.3.1 Entity Relationships
```
Schedule (1) ──── (Many) Class
    │                 │
    │                 └── (Many) ClassDay
    │
    └── Semester
```

#### 5.3.2 Offline Support
- Core Data for local storage
- Background sync on app launch
- Conflict resolution strategy
- Cache management

---

## 6. User Experience & Design

### 6.1 Design Principles

#### 6.1.1 iOS Human Interface Guidelines
- Follow Apple's HIG for native feel
- Consistent navigation patterns
- Accessibility compliance (VoiceOver, Dynamic Type)
- Dark mode support

#### 6.1.2 Brand Consistency
- Maintain Schedulr visual identity
- Custom color scheme (#brand-500 primary)
- Typography consistency with web platform
- Icon library alignment

### 6.2 Screen Flows

#### 6.2.1 Primary Navigation Structure
```
Tab Bar Controller
├── Dashboard (Schedules List)
├── Create Schedule (Wizard)
├── Timetable Preview
└── Settings/Profile
```

#### 6.2.2 Key Screen Wireframes

**Dashboard Screen**
- Navigation bar with search
- Schedule cards with preview
- Floating action button for new schedule
- Pull-to-refresh functionality

**Schedule Creation Wizard**
- Step indicator at top
- Form sections with iOS native controls
- Progress saving
- Cancel/back navigation

**Timetable Preview**
- Scrollable time grid
- Color-coded class blocks
- Zoom and pan support
- Export action in navigation

### 6.3 Interaction Patterns

#### 6.3.1 Gestures & Navigation
- **Swipe Actions**: Delete/edit on schedule cards
- **Pull to Refresh**: Dashboard data reload
- **Pinch to Zoom**: Timetable scaling
- **Long Press**: Context menus for quick actions

#### 6.3.2 Feedback & Animations
- Haptic feedback for important actions
- Smooth transitions between screens
- Loading states with progress indicators
- Success/error states with appropriate messaging

---

## 7. Data Models

### 7.1 Core Models (Mirroring Web Platform)

#### 7.1.1 Schedule Model
```swift
struct Schedule: Codable, Identifiable {
    let id: String
    let semester: Semester
    let classes: [Class]
    let createdAt: Date
    let updatedAt: Date
}
```

#### 7.1.2 Semester Model
```swift
struct Semester: Codable {
    let id: String
    let scheduleName: String
    let startDate: Date
    let endDate: Date
    let excludedDates: [Date]?
}
```

#### 7.1.3 Class Model
```swift
struct Class: Codable, Identifiable {
    let id: String
    let courseName: String
    let days: [ClassDay]
    let color: String
    let colorLight: String
}
```

#### 7.1.4 ClassDay Model
```swift
struct ClassDay: Codable, Identifiable {
    let id: String
    let day: String // "Monday", "Tuesday", etc.
    let startTime: Date
    let endTime: Date
    let room: String?
}
```

### 7.2 Local Models

#### 7.2.1 User Preferences
```swift
struct UserPreferences: Codable {
    let defaultColors: [String]
    let timeFormat: TimeFormat // 12/24 hour
    let firstDayOfWeek: DayOfWeek
    let notifications: NotificationSettings
}
```

#### 7.2.2 Export Settings
```swift
struct ExportSettings: Codable {
    let includeLocation: Bool
    let includeDescription: Bool
    let reminderMinutes: Int
    let calendarName: String?
}
```

---

## 8. API Integration

### 8.1 Backend Endpoints (Existing)

#### 8.1.1 Authentication
- `POST /api/schedulr/google-auth/login` - Google OAuth login
- `GET /api/schedulr/google-auth/me` - Get current user
- `POST /api/schedulr/google-auth/logout` - Logout

#### 8.1.2 Schedules Management
- `GET /api/schedulr/user/get-data` - Fetch user schedules
- `POST /api/schedulr/user/save-schedule` - Create schedule
- `GET /api/schedulr/user/get-schedule?scheduleId={id}` - Get specific schedule
- `PUT /api/schedulr/user/update-schedule?scheduleId={id}` - Update schedule
- `DELETE /api/schedulr/user/delete-schedule?scheduleId={id}` - Delete schedule

#### 8.1.3 User Feedback
- `POST /api/schedulr/user/feedback` - Submit user feedback

### 8.2 Network Layer Implementation

#### 8.2.1 API Service
```swift
protocol APIServiceProtocol {
    func fetchSchedules() async throws -> [Schedule]
    func createSchedule(_ schedule: Schedule) async throws -> Schedule
    func updateSchedule(_ schedule: Schedule) async throws -> Schedule
    func deleteSchedule(id: String) async throws
    func authenticate(with token: String) async throws -> User
}
```

#### 8.2.2 Error Handling
- Network connectivity checking
- Retry mechanisms for failed requests
- User-friendly error messages
- Offline mode graceful degradation

---

## 9. Security & Privacy

### 9.1 Data Protection

#### 9.1.1 Authentication Security
- Google OAuth 2.0 implementation
- Secure token storage in Keychain
- Token refresh handling
- Biometric authentication for app access (optional)

#### 9.1.2 Data Encryption
- HTTPS for all network communications
- Local data encryption with Core Data
- Sensitive data protection
- Secure credential storage

### 9.2 Privacy Compliance

#### 9.2.1 Data Collection
- Minimal data collection principle
- Clear privacy policy presentation
- User consent for data usage
- GDPR/CCPA compliance

#### 9.2.2 User Rights
- Data deletion capabilities
- Export user data functionality
- Account deactivation options
- Clear data usage transparency

### 9.3 App Store Requirements

#### 9.3.1 Privacy Labels
- Account information collection
- Contact information usage
- Usage data collection
- No tracking across apps/websites

---

## 10. Performance Requirements

### 10.1 App Performance

#### 10.1.1 Launch Times
- Cold launch: < 3 seconds
- Warm launch: < 1 second
- Memory usage: < 50MB baseline
- CPU usage optimization

#### 10.1.2 Network Performance
- API response caching
- Image optimization
- Offline-first approach
- Background sync efficiency

### 10.2 User Experience Performance

#### 10.2.1 Responsiveness
- UI interactions: < 100ms response
- Screen transitions: 60fps
- Smooth scrolling in all views
- No ANR (Application Not Responding) events

#### 10.2.2 Battery Optimization
- Efficient background processing
- Location services optimization
- Network request batching
- CPU-intensive task optimization

---

## 11. Platform-Specific Features

### 11.1 iOS Integration

#### 11.1.1 System Calendar
```swift
// EventKit integration for direct calendar import
func exportToCalendar(_ schedule: Schedule) {
    let eventStore = EKEventStore()
    // Request calendar access
    // Create recurring events
    // Add to user's calendar
}
```

#### 11.1.2 Shortcuts & Siri
- Create custom intents for schedule actions
- Voice command support for common tasks
- Quick action shortcuts on home screen

#### 11.1.3 Share Sheet
- Custom share activities
- Schedule sharing via various apps
- ICS file sharing integration

### 11.2 iOS UI Components

#### 11.2.1 Native Controls
- UIDatePicker for date/time selection
- UIColorPickerViewController for color selection
- UIContextMenuConfiguration for context menus
- UISearchController for schedule search

#### 11.2.2 Modern iOS Features
- SwiftUI integration
- iOS 18+ design patterns
- Dynamic Type support
- VoiceOver accessibility

---

## 12. Release Strategy

### 12.1 Development Phases

#### 12.1.1 Phase 1: MVP (2-3 months)
- Core schedule creation functionality
- Basic timetable preview
- ICS export capability
- Google authentication
- Basic dashboard

#### 12.1.2 Phase 2: Enhanced Features (1-2 months)
- Native calendar integration
- Advanced editing features
- Widget support
- Improved UI/UX polish

#### 12.1.3 Phase 3: Advanced Features (1-2 months)
- Apple Watch support
- Siri shortcuts
- Schedule sharing
- Advanced analytics

### 12.2 Testing Strategy

#### 12.2.1 Testing Phases
- **Unit Testing**: Core logic and models
- **Integration Testing**: API and Core Data
- **UI Testing**: User flow automation
- **Beta Testing**: TestFlight distribution

#### 12.2.2 Quality Assurance
- Device compatibility testing (iPhone models)
- iOS version compatibility
- Accessibility testing
- Performance profiling

### 12.3 App Store Submission

#### 12.3.1 Preparation
- App Store screenshots and metadata
- Privacy policy updates
- App review guidelines compliance
- Localization (initial: English)

#### 12.3.2 Launch Plan
- Soft launch to limited regions
- Performance monitoring
- User feedback collection
- Iterative improvements

---

## 13. Success Metrics

### 13.1 Adoption Metrics
- App Store downloads
- Daily/Monthly active users
- User retention rates (Day 1, 7, 30)
- Session length and frequency

### 13.2 Engagement Metrics
- Schedules created per user
- Calendar exports per session
- Feature usage analytics
- User feedback ratings

### 13.3 Technical Metrics
- App crash rate (< 0.1%)
- API response times
- Offline usage patterns
- Performance benchmarks

### 13.4 Business Metrics
- User acquisition cost
- User lifetime value
- App Store rating (target: 4.5+)
- Support ticket volume

---

## 14. Risk Assessment & Mitigation

### 14.1 Technical Risks
- **API Compatibility**: Maintain backward compatibility
- **iOS Updates**: Stay current with OS changes
- **Performance Issues**: Regular performance auditing
- **Data Sync Conflicts**: Robust conflict resolution

### 14.2 Business Risks
- **Competition**: Unique value proposition focus
- **User Adoption**: Comprehensive marketing strategy
- **Platform Changes**: Diversified feature set
- **Feedback Management**: Proactive user support

---

## 15. Conclusion

The Schedulr iOS app represents a strategic expansion of the successful web platform into the mobile ecosystem. By leveraging iOS-specific features while maintaining the core value proposition of effortless schedule-to-calendar conversion, the app is positioned to capture significant market share in the academic scheduling space.

The phased development approach ensures rapid time-to-market while allowing for iterative improvements based on user feedback. The technical architecture provides scalability for future enhancements, and the focus on user experience ensures high adoption and retention rates.

Success will be measured through user engagement, technical performance, and business metrics, with continuous iteration based on data-driven insights and user feedback.

---

## 16. Appendix

### 16.1 Web Platform Analysis Summary
- **Current Version**: v1.50
- **Tech Stack**: Angular, TypeScript, TailwindCSS
- **Authentication**: Google OAuth
- **Features**: Multi-step wizard, timetable preview, ICS export, cloud sync
- **User Base**: Active engagement with feedback system

### 16.2 Competitive Analysis References
- Apple Calendar (native scheduling)
- Google Calendar (cross-platform sync)
- Academic planning apps (specialized features)
- Calendar export tools (format compatibility)

### 16.3 Technical Documentation
- API documentation references
- Design system specifications
- User testing protocols
- Performance benchmarking standards

---

*This PRD serves as the comprehensive guide for developing the Schedulr iOS application, ensuring alignment with the existing web platform while optimizing for mobile-specific user needs and iOS capabilities.*
