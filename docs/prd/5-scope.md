# 5. Scope
## In-Scope (High-Level Features):

### User Authentication:
 Secure login, registration, and session management via Supabase Auth.

### Task Management (CRUD): 
Creation, viewing, editing, and deletion of tasks with attributes like title, notes, completion status, and position.

### Recurring Task Logic:

Defining tasks to repeat on specific days_of_week (Mon-Sun).
Setting repeat_frequency (e.g., every 2 days).
Specifying repeat_period (Daily, Weekly, Monthly, Yearly).
Algorithm to determine tasks due on a given day.
### Checklist Item Management: 

Adding, editing, completing, and reordering sub-items within a task.
### Task Completion Tracking: 

Recording task_completion_history to calculate success percentages.
### Health and Happiness Tracking:

Healt and happiness values are for gamification calculated from user activities.

### Navigation:
Intuitive navigation using Expo Router with drawer and tab structures.

### UI/UX:
Responsive design using React Native Elements, adhering to defined fonts and color schemes.
### Data Synchronization:
Robust client-server data synchronization with Supabase, initially implementing foundational offline-first capabilities using Legend-State for enhanced user experience and data availability.


### Comprehensive Data Analytics:
While success percentage is in scope, advanced reporting beyond this is not.

### Not Cross-Platform: 
Primary focus is Android initially. Web compabilities are considered for future plans.

### Advanced Sharing/Collaboration:

Tasks are currently user-specific.

### Integrations:
No third-party API integrations (e.g., calendar, health apps).

### Realtime Updates:
Active realtime subscription for  data is not a requirement for task display in this phase.
### Deep Offline-First Capabilities:

Foundational offline-first capabilities via Legend-State are now in scope, advanced features such as complex conflict resolution strategies are considered for future.
