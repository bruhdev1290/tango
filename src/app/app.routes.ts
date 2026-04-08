import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [noAuthGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    canActivate: [noAuthGuard]
  },
  {
    path: 'server-management',
    loadComponent: () => import('./pages/server-management/server-management.page').then(m => m.ServerManagementPage),
    canActivate: [noAuthGuard]
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects.page').then(m => m.ProjectsPage)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./pages/project-detail/project-detail.page').then(m => m.ProjectDetailPage)
      },
      {
        path: 'backlog',
        loadComponent: () => import('./pages/backlog/backlog.page').then(m => m.BacklogPage)
      },
      {
        path: 'kanban',
        loadComponent: () => import('./pages/kanban/kanban.page').then(m => m.KanbanPage)
      },
      {
        path: 'issues',
        loadComponent: () => import('./pages/issues/issues.page').then(m => m.IssuesPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'user-stories/:id',
    loadComponent: () => import('./pages/user-story-detail/user-story-detail.page').then(m => m.UserStoryDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./pages/task-detail/task-detail.page').then(m => m.TaskDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'issues/:id',
    loadComponent: () => import('./pages/issue-detail/issue-detail.page').then(m => m.IssueDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'milestones/:id',
    loadComponent: () => import('./pages/milestone-detail/milestone-detail.page').then(m => m.MilestoneDetailPage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
