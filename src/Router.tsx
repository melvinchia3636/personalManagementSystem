/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useContext, useMemo } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './modules/Dashboard'
import Auth from './auth'
import MainApplication from './MainApplication'
import { AuthContext } from './providers/AuthProvider'
import TodoList from './modules/TodoList'
import Calendar from './modules/Calendar'
import ProjectsM from './modules/ProjectsM'
import Kanban from './modules/ProjectsM/components/Kanban'
import NotFound from './components/general/NotFound'
import IdeaBox from './modules/IdeaBox'
import Ideas from './modules/IdeaBox/components/Ideas'
import CodeTime from './modules/CodeTime'
import PomodoroTimer from './modules/PomodoroTimer'
import Flashcards from './modules/Flashcards'
import CardSet from './modules/Flashcards/components/CardSet'
import ReferenceBooks from './modules/ReferenceBooks'
import Changelog from './modules/Changelog'
import Notes from './modules/Notes'
import NotesCategory from './modules/Notes/Workspace'
import NotesSubject from './modules/Notes/Subject'
import Personalization from './modules/Personalization'
import ServerStatus from './modules/ServerStatus'
import Spotify from './modules/Spotify'
import Modules from './modules/Modules'
import { titleToPath } from './components/Sidebar/components/SidebarItem'
import ProjectsK from './modules/ProjectsK'
import Project from './modules/ProjectsK/components/Project'
import Photos from './modules/Photos'

interface IRoutesItem {
  name: string
  icon: string
  routes: React.ReactElement[]
  subsection?: string[][]
  togglable: boolean
}
interface IRoutes {
  title: string
  items: IRoutesItem[]
}

export const ROUTES: IRoutes[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: 'tabler:dashboard',
        routes: [
          <Route key="dashboard" path="dashboard" element={<Dashboard />} />
        ],
        togglable: false
      }
    ]
  },
  {
    title: 'Productivity',
    items: [
      {
        name: 'Projects (M)',
        icon: 'tabler:clipboard',
        routes: [
          <Route key="projects-m" path="projects-m" element={<ProjectsM />} />,
          <Route
            key="projects-m-id"
            path="projects-m/:id"
            element={<Kanban />}
          />
        ],
        togglable: true
      },
      {
        name: 'Projects (K)',
        icon: 'tabler:clipboard',
        routes: [
          <Route key="projects-k" path="projects-k" element={<ProjectsK />} />,
          <Route
            key="projects-k-id"
            path="projects-k/:id"
            element={<Project />}
          />
        ],
        togglable: true
      },
      {
        name: 'Idea Box',
        icon: 'tabler:bulb',
        routes: [
          <Route key="idea-box" path="idea-box" element={<IdeaBox />} />,
          <Route key="idea-box-id" path="idea-box/:id" element={<Ideas />} />
        ],
        togglable: true
      },
      {
        name: 'Todo List',
        icon: 'tabler:list-check',
        routes: [
          <Route key="todo-list" path="todo-list" element={<TodoList />} />
        ],
        togglable: true
      },
      {
        name: 'Calendar',
        icon: 'tabler:calendar',
        routes: [
          <Route key="calendar" path="calendar" element={<Calendar />} />
        ],
        togglable: true
      },
      {
        name: 'Spotify',
        icon: 'tabler:brand-spotify',
        routes: [<Route key="spotify" path="spotify" element={<Spotify />} />],
        togglable: true
      },
      {
        name: 'Code Time',
        icon: 'tabler:code',
        routes: [
          <Route key="code-time" path="code-time" element={<CodeTime />} />
        ],
        togglable: true
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        name: 'Photos',
        icon: 'tabler:camera',
        routes: [<Route key="photos" path="photos" element={<Photos />} />],
        togglable: true
      }
    ]
  },
  {
    title: 'Study',
    items: [
      {
        name: 'Pomodoro Timer',
        icon: 'tabler:clock-bolt',
        routes: [
          <Route
            key="pomodoro-timer"
            path="pomodoro-timer"
            element={<PomodoroTimer />}
          />
        ],
        togglable: true
      },
      {
        name: 'Flashcards',
        icon: 'tabler:cards',
        routes: [
          <Route key="flashcards" path="flashcards" element={<Flashcards />} />,
          <Route
            key="flashcards-id"
            path="flashcards/:id"
            element={<CardSet />}
          />
        ],
        togglable: true
      },
      {
        name: 'Notes',
        icon: 'tabler:notebook',
        routes: [
          <Route key="notes" path="notes" element={<Notes />} />,
          <Route
            key="notes-workspace"
            path="notes/:workspace"
            element={<NotesCategory />}
          />,
          <Route
            key="notes-subject"
            path="notes/:workspace/:subject/*"
            element={<NotesSubject />}
          />
        ],
        togglable: true
      },
      {
        name: 'Reference Books',
        icon: 'tabler:books',
        routes: [
          <Route
            key="reference-books"
            path="reference-books"
            element={<ReferenceBooks />}
          />
        ],
        togglable: true
      }
    ]
  },
  {
    title: 'Finance',
    items: [
      {
        name: 'Wallet',
        icon: 'tabler:currency-dollar',
        subsection: [
          ['Balance', 'tabler:wallet'],
          ['Transactions', 'tabler:arrows-exchange'],
          ['Budgets', 'tabler:coin'],
          ['Reports', 'tabler:chart-bar']
        ],
        routes: [],
        togglable: true
      },
      {
        name: 'Wish List',
        icon: 'tabler:heart',
        routes: [],
        togglable: true
      }
    ]
  },
  {
    title: 'Confidential',
    items: [
      {
        name: 'Contacts',
        icon: 'tabler:users',
        routes: [],
        togglable: true
      },
      {
        name: 'Passwords',
        icon: 'tabler:key',
        routes: [],
        togglable: true
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Personalization',
        icon: 'tabler:palette',
        routes: [
          <Route
            key="personalization"
            path="personalization"
            element={<Personalization />}
          />
        ],
        togglable: false
      },
      {
        name: 'Modules',
        icon: 'tabler:plug',
        routes: [<Route key="modules" path="modules" element={<Modules />} />],
        togglable: false
      },
      {
        name: 'Data Backup',
        icon: 'tabler:database',
        routes: [
          <Route key="data-backup" path="data-backup" element={<></>} />
        ],
        togglable: false
      },
      {
        name: 'Server Status',
        icon: 'tabler:server',
        routes: [
          <Route
            key="server-status"
            path="server-status"
            element={<ServerStatus />}
          />
        ],
        togglable: false
      }
    ]
  },
  {
    title: '',
    items: [
      {
        name: 'Change Log',
        icon: 'tabler:file-text',
        routes: [
          <Route key="change-log" path="change-log" element={<Changelog />} />
        ],
        togglable: false
      }
    ]
  }
]

function AppRouter(): React.JSX.Element {
  const { auth, authLoading, userData } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  useMemo(() => {
    if (!authLoading) {
      if (!auth && location.pathname !== '/auth') {
        navigate('/auth?redirect=' + location.pathname + location.search)
      } else if (auth) {
        if (location.pathname === '/auth') {
          if (location.search) {
            const redirect = new URLSearchParams(location.search).get(
              'redirect'
            )
            if (redirect) {
              navigate(redirect)
            } else {
              navigate('/dashboard')
            }
          }
        } else if (location.pathname === '/') {
          navigate('/dashboard')
        }
      }
    }
  }, [auth, location, authLoading])

  return (
    <Routes>
      <Route path="/" element={<MainApplication />}>
        {userData ? (
          ROUTES.flatMap(e => e.items)
            .filter(
              item =>
                !item.togglable ||
                userData.enabledModules.includes(titleToPath(item.name))
            )
            .map(item => item.routes)
        ) : (
          <Route path="*" element={<NotFound />} />
        )}
      </Route>
      <Route path="auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
