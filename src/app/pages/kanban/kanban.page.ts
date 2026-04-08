import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/standalone';
import { TaskService } from '../../services/task.service';
import { Task, Status } from '../../models';

@Component({
  selector: 'app-kanban',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Kanban Board</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="createTask()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="isLoading" class="ion-padding">
        <ion-skeleton-text animated style="width: 100%; height: 400px;"></ion-skeleton-text>
      </div>

      <div *ngIf="!isLoading && tasks.length === 0" class="empty-state">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <h3>No Tasks</h3>
        <p>Your Kanban board is empty. Add tasks to start tracking work.</p>
        <ion-button (click)="createTask()">
          <ion-icon name="add-outline" slot="start"></ion-icon>
          Add Task
        </ion-button>
      </div>

      <div *ngIf="!isLoading && tasks.length > 0" class="kanban-board">
        <ion-card *ngFor="let column of columns" class="kanban-column">
          <ion-card-header [style.background]="column.color + '20'">
            <ion-card-title>
              {{ column.name }}
              <ion-badge color="medium">{{ getTasksByStatus(column.id).length }}</ion-badge>
            </ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <div
              *ngFor="let task of getTasksByStatus(column.id)"
              class="kanban-card"
              (click)="openTask(task)"
            >
              <div class="task-header">
                <span class="task-ref">#{{ task.ref }}</span>
                <div class="task-badges">
                  <ion-icon
                    *ngIf="task.is_blocked"
                    name="warning"
                    color="danger"
                  ></ion-icon>
                  <ion-icon
                    *ngIf="task.is_iocaine"
                    name="skull"
                    color="dark"
                  ></ion-icon>
                </div>
              </div>
              <p class="task-subject">{{ task.subject }}</p>
              <div class="task-footer">
                <ion-avatar *ngIf="task.assigned_to_extra_info" class="assignee-avatar">
                  <img [src]="'https://www.gravatar.com/avatar/' + task.assigned_to_extra_info.gravatar_id + '?d=identicon'" [alt]="task.assigned_to_extra_info.full_name_display">
                </ion-avatar>
                <div *ngIf="!task.assigned_to_extra_info" class="unassigned">
                  <ion-icon name="person-outline" color="medium"></ion-icon>
                </div>
                <div class="task-meta">
                  <ion-icon
                    *ngIf="task.due_date"
                    name="calendar-outline"
                    [color]="getDueDateColor(task)"
                  ></ion-icon>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .kanban-board {
      display: flex;
      gap: 16px;
      padding: 16px;
      overflow-x: auto;
      min-height: 100%;
    }

    .kanban-column {
      min-width: 300px;
      max-width: 300px;
      flex-shrink: 0;
    }

    .kanban-column ion-card-header {
      padding: 12px 16px;
    }

    .kanban-column ion-card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }

    .kanban-column ion-card-content {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kanban-card {
      background: var(--ion-color-light);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid var(--ion-color-light-shade);
    }

    .kanban-card:active {
      transform: scale(0.98);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .task-ref {
      font-size: 12px;
      color: var(--ion-color-medium);
    }

    .task-badges {
      display: flex;
      gap: 4px;
    }

    .task-subject {
      margin: 0 0 12px;
      font-size: 14px;
      line-height: 1.4;
      color: var(--ion-color-dark);
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .assignee-avatar {
      width: 28px;
      height: 28px;
    }

    .unassigned {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--ion-color-light-shade);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .unassigned ion-icon {
      font-size: 14px;
    }

    .task-meta {
      display: flex;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .kanban-board {
        flex-direction: column;
        align-items: stretch;
      }

      .kanban-column {
        min-width: 100%;
        max-width: 100%;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class KanbanPage implements OnInit {
  tasks: Task[] = [];
  columns: Status[] = [];
  isLoading = true;
  projectId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['project'] ? +params['project'] : undefined;
      this.loadTasks();
    });
  }

  loadTasks() {
    this.isLoading = true;
    const filter: any = {};
    if (this.projectId) {
      filter.project = this.projectId;
    }

    this.taskService.getTasks(filter).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.extractColumns(tasks);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  extractColumns(tasks: Task[]) {
    const statusMap = new Map<number, Status>();
    tasks.forEach(task => {
      if (task.status_extra_info && !statusMap.has(task.status)) {
        statusMap.set(task.status, task.status_extra_info);
      }
    });
    this.columns = Array.from(statusMap.values()).sort((a, b) => a.order - b.order);
  }

  getTasksByStatus(statusId: number): Task[] {
    return this.tasks.filter(t => t.status === statusId);
  }

  getDueDateColor(task: Task): string {
    if (!task.due_date) return 'medium';
    const due = new Date(task.due_date);
    const now = new Date();
    if (due < now) return 'danger';
    const daysDiff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 3) return 'warning';
    return 'success';
  }

  refresh(event: any) {
    this.loadTasks();
    event.target.complete();
  }

  openTask(task: Task) {
    this.router.navigate(['/tasks', task.id]);
  }

  createTask() {
    // Open create modal
  }
}
