# Holidaze

**Holidaze** is a modern web application for booking venues, built for the Project Exam 2026. Users can browse, search, and book venues, while registered venue managers can create, update, and manage their venues.

---

## URLs

- **Gantt Chart:** [View Gantt Chart](https://drive.google.com/file/d/1OQfTSSYc37NOJK1fTiiDgjrZhfHvMUuV/view?usp=drive_link)
- **Design Prototype:** [View Prototype](https://xd.adobe.com/view/c4d965bd-40f4-4c26-85b5-cb031719e70e-918a/)
- **Style Guide:** [View Style Guide](https://github.com/OH2021/Project-Exam-Holidaze/blob/main/STYLE_GUIDE.md)
- **Kanban Board:** [View Kanban Board](https://github.com/users/OH2021/projects/3)
- **Repository:** [GitHub Repository](https://github.com/OH2021/Project-Exam-Holidaze.git)
- **Hosted Demo:** [View Live Site](https://pe2holidaze2026.netlify.app/)

---

## Features

### For All Users

- Browse available venues with images, descriptions, prices, and max guests.
- Search for specific venues by name.
- View venue details with booking calendar and availability.
- Book a venue for multiple days.
- View personal bookings.

### For Registered Venue Managers

- Register as a venue manager (pending approval from API).
- Create new venues with title, description, media gallery, price, and max guests.
- Update or delete venues they manage.
- View bookings for their venues.

### Authentication

- Register and login with email and password.
- Update user avatar.
- Venue manager privileges are verified via the Holidaze API.

---

## Technologies Used

- **Frontend:** React.js, React Router, Tailwind CSS
- **API:** [Holidaze API v2](https://docs.noroff.dev/docs/v2)
- **Hosting:** Netlify
- **Other Libraries:** react-calendar, fetch for API requests

---

## Project Structure

```
src/
├── components/
│ ├── Header.js
│ ├── Footer.js
│ ├── AvatarUpdate.js
│ └── VenueList.js
├── context/
│ └── AuthContext.js
├── pages/
│ ├── Home.js
│ ├── Venues.js
│ ├── VenueDetail.js
│ ├── Profile.js
│ ├── MyBookings.js
│ ├── Register.js
│ ├── Login.js
│ ├── CreateVenue.js
│ ├── EditVenue.js
└── App.js
```

## Installation

1. Clone the repository:

```bash

git clone https://github.com/OH2021/Project-Exam-Holidaze.git

```

Navigate to the project folder:

```bash
cd Project-Exam-Holidaze

```

Install dependencies:

```bash
npm install
```

Usage

Start the development server:

```bash
npm start
```

The app will run at http://localhost:3000
. From here you can:

Browse venues and search by name.

Register as a user or venue manager.

Update your avatar.

Book venues for multiple days.

If a venue manager, create, update, delete venues, and view bookings.
