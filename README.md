# Society & Event Fund Management System — Frontend

React frontend for a full-stack MERN application that manages societies, events, memberships, dues, and payments.

**🔗 Live App:** [fund-management-front-end.vercel.app](https://fund-management-front-end.vercel.app/)
**Backend Repo:** *(link your backend repo here)*

---

## What This App Does

Lets users create and join societies and events, track membership dues and payments, send and respond to invitations, self-request to join communities they've discovered, and stay updated through a unified notification feed — all with role-aware permissions (society admins, event admins, members, guests).

---

## Tech Stack

- **React** + **React Router**
- **TanStack Query (React Query)** — server state, caching, mutations, and cache invalidation
- **Tailwind CSS** with daisyUI-style design tokens (`base-100`, `primary`, `secondary`, etc.)
- **react-toastify** — toast notifications
- **Axios** — API client
- **Heroicons** — icon set

---

## Key Pages & Features

| Page | What it does |
|---|---|
| `Dashboard` | Overview of the user's personal events and societies, with stats (total collected, pending payments) |
| `Discover` | Browse societies and standalone events the user isn't part of; request to join, see pending status, cancel a request |
| `SocietyDetails` / `EventDetails` | Full member list, dues, payment history, admin controls |
| `MemberDetails` | One member's full payment history and dues breakdown |
| `AdminPanel` | Aggregated view of everything the user administers, with due-date summaries (overdue / due soon / upcoming) |
| `NotificationsPage` | Unified feed for invitations, join requests, event updates, and payments — with inline Accept/Reject and Approve/Reject actions |

---

## Notable UI Patterns

### Modal rendering via Portal
Every modal (`CreateEventForm`, `AddSocietyMemberModal`, `EditMemberModal`, `RecordPaymentModal`, etc.) renders through a shared `ModalPortal.jsx` using React's `createPortal`. This was a deliberate fix: any ancestor with `backdrop-blur-sm` creates a new CSS containing block, which breaks `position: fixed` on nested modals — they'd render inside the ancestor card instead of covering the full viewport. Portaling to `document.body` sidesteps this entirely.

### Dual invite/request notification actions
Notifications aren't just informational — `invitation_received` and `join_request_received` notifications render their own inline Accept/Reject or Approve/Reject buttons directly in the feed, using optimistic mutation state (`isPending`) to disable buttons and show loading text during the request.

### Client-side filtering, not re-fetching
The notifications feed fetches once and filters read/unread and by type entirely client-side — switching tabs doesn't trigger new network requests, since the full dataset is already cached by React Query.

### Consistent visual language
Rounded `2xl`/`3xl` cards, gradient headers (`from-primary to-secondary`), color-tiered due-date badges (red = overdue, orange = due soon, blue = approaching, gray = plenty of time), and avatar rings colored by role — applied consistently across `SocietyDetails`, `EventDetails`, `AdminPanel`, and `Discover`.

---

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── Discover.jsx
│   ├── EventDetails.jsx
│   ├── SocietyDetails.jsx
│   ├── Memberdetails.jsx
│   ├── AdminPanel.jsx
│   ├── NotificationsPage.jsx
│   └── auth/
├── components/
│   ├── events/          (MembersTab, RecordPaymentModal, EventGrid, EventFilters)
│   ├── societies/        (SocietyEventsTab, CreateSocietyEventForm, SocietyGrid)
│   ├── Addmin-Panel/     (CreateEventForm, CreateSocietyModal)
│   ├── Navbar/
│   ├── notifications/    (NotificationBell)
│   ├── layout/           (PageHeader, SectionHeader)
│   └── common/           (StatCard, ModalPortal)
├── lib/
│   └── axois.js          (configured Axios instance)
├── redux/
│   └── slices/           (auth, theme)
└── App.jsx
```

---

## Running Locally

```bash
git clone <this-repo>
npm install
```

Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

```bash
npm run dev
```

App runs on `http://localhost:5173` — requires the [backend](#) running locally or pointed at a deployed instance.

---

## Deployment

Deployed on **Vercel**: [fund-management-front-end.vercel.app](https://fund-management-front-end.vercel.app/)

---

## Author

Built by Abhijeet Goril.