# PlanSeance 🗓️

**Find the time slots when everyone is free.**

PlanSeance is a mobile-first web application that helps a professor and a group of students schedule study sessions. Each person marks the hours they are busy on a weekly timetable, and the app instantly computes the common free slots and proposes a set of non-overlapping sessions.

[![CI](https://github.com/asmaguenaien/session-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/asmaguenaien/session-sync/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **Live Demo:** [Add your Vercel URL here](https://your-project.vercel.app)

> **Note:** The interface is in French. Data is kept in memory only, so refreshing the page resets the timetables.

## ✨ Features

- **Interactive Timetable** — Click or drag across a weekly grid (Monday to Saturday, 08:00–20:00) to mark busy hours. Works with mouse and touch.
- **Multiple Students** — Add, rename, and remove students, each with their own timetable.
- **Configurable Sessions** — Choose the number of sessions (1–20) and the duration of each (1–4 hours).
- **Common Free Slots** — Finds every start time when the professor and all students are available.
- **Non-overlapping Proposals** — Suggests the earliest sessions that do not overlap each other, and tells you when fewer sessions than requested are possible.
- **Guided Flow** — A three-step wizard: professor, students, results.
- **Tested Scheduling Logic** — The slot-finding algorithm is covered by unit tests.

## 🧠 How It Works

1. Every busy period is stored as a `{ day, startHour, endHour }` slot per person.
2. For each day and each possible start hour, the algorithm checks that the session window overlaps no busy slot of the professor or any student.
3. The resulting candidates are filtered to keep the earliest sessions that do not overlap each other.

The logic lives in [`src/lib/scheduling.ts`](./src/lib/scheduling.ts) and is independent of the UI.

## 🛠️ Tech Stack

| Category | Technologies |
| --- | --- |
| **Framework** | React 18, TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI |
| **Routing** | React Router |
| **Icons** | Lucide React |
| **Testing & Quality** | Vitest, ESLint, GitHub Actions |
| **Deployment** | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/asmaguenaien/session-sync.git
cd session-sync
npm install
npm run dev
```

Open the local URL displayed in your terminal.

### Production Build

```bash
npm run build
npm run preview
```

### Quality Checks

```bash
npm run lint
npm test
```

## 📁 Project Structure

```
src/
├── components/   # TimetableGrid, SessionConfigurator, AvailableSlots, ui/
├── lib/          # scheduling.ts (core algorithm), utils
├── pages/        # Pages (Index, NotFound)
├── hooks/        # Custom hooks
└── test/         # Unit tests
```

## 📸 Screenshots

Screenshots of the timetable grid and the results screen will be added here.

## 🗺️ Roadmap

- [ ] Save and share timetables with a link.
- [ ] Import availability from calendar files (ICS) or Google Calendar.
- [ ] Spread sessions across different days when possible.
- [ ] Export the proposed sessions to a calendar.
- [ ] Add English / French language switching.
- [ ] Add end-to-end tests for the main user flow.

## 👩‍💻 Author

**Asma Guenaien**
Software Development | Web Technologies

- GitHub: [@asmaguenaien](https://github.com/asmaguenaien)

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
