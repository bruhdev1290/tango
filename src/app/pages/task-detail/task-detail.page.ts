import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonItem,
  IonAvatar,
  IonLabel,
  IonList,
  IonListHeader,
  ActionSheetController
} from '@ionic/angular/standalone';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models';

@Component({
  selector: 'app-task-detail',
  template: `
    <ion-header *ngIf="task">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="'/tabs/kanban'"></ion-back-button>
        </ion-buttons>
        <ion-title>Task #{{ task.ref }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="toggleWatch()">
            <ion-icon [name]="task.is_watcher ? 'eye-off' : 'eye'"></ion-icon>
          </ion-button>
          <ion-button (click)="presentActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="task">
      <ion-card>
        <ion-card-header>
          <div class="task-header">
            <ion-badge [style.--background]="task.status_extra_info?.color">
              {{ task.status_extra_info?.name }}
            </ion-badge>
            <div class="task-badges">
              <ion-icon *ngIf="task.is_blocked" name="warning" color="danger"></ion-icon>
              <ion-icon *ngIf="task.is_iocaine" name="skull" color="dark"></ion-icon>
            </div>
          </div>
          <ion-card-title>{{ task.subject }}</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <div class="assignee-section" *ngIf="task.assigned_to_extra_info">
            <ion-item lines="none">
              <ion-avatar slot="start">
                <img [src]="'https://www.gravatar.com/avatar/' + task.assigned_to_extra_info.gravatar_id + '?d=identicon'">
              </ion-avatar>
              <ion-label>
                <h3>Assigned to</h3>
                <p>{{ task.assigned_to_extra_info.full_name_display }}</p>
              </ion-label>
            </ion-item>
          </div>

          <div class="blocked-note" *ngIf="task.is_blocked && task.blocked_note">
            <ion-item lines="none" color="danger">
              <ion-icon name="warning" slot="start"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h3>Blocked</h3>
                <p>{{ task.blocked_note }}</p>
              </ion-label>
            </ion-item>
          </div>

          <div class="description" *ngIf="task.description_html" [innerHTML]="task.description_html"></div>
          <div class="description" *ngIf="!task.description_html && task.description">
            <p>{{ task.description }}</p>
          </div>
          <div class="no-description" *ngIf="!task.description">
            <p>No description provided</p>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list>
        <ion-list-header>
          <ion-label>Details</ion-label>
        </ion-list-header>

        <ion-item *ngIf="task.user_story_extra_info">
          <ion-icon name="list-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>User Story</h3>
            <p>#{{ task.user_story_extra_info.ref }} - {{ task.user_story_extra_info.subject }}</p>
          </ion-label>
          <ion-button fill="clear" slot="end" (click)="openUserStory()">
            View
          </ion-button>
        </ion-item>

        <ion-item>
          <ion-icon name="folder-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Project</h3>
            <p>{{ task.project_name }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="person-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Created by</h3>
            <p>{{ task.owner_extra_info?.full_name_display }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="task.due_date">
          <ion-icon name="calendar-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Due Date</h3>
            <p>{{ task.due_date | date }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="task.finished_date">
          <ion-icon name="checkmark-circle-outline" slot="start" color="success"></ion-icon>
          <ion-label>
            <h3>Completed</h3>
            <p>{{ task.finished_date | date:'medium' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .task-badges {
      display: flex;
      gap: 8px;
    }

    .task-badges ion-icon {
      font-size: 20px;
    }

    .assignee-section {
      margin-bottom: 16px;
    }

    .assignee-section ion-item {
      --background: var(--ion-color-light);
      border-radius: 8px;
    }

    .blocked-note {
      margin-bottom: 16px;
    }

    .blocked-note ion-item {
      border-radius: 8px;
    }

    .description {
      line-height: 1.6;
    }

    .no-description {
      color: var(--ion-color-medium);
      font-style: italic;
    }

    ion-card-title {
      font-size: 20px;
      line-height: 1.4;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonItem, IonAvatar, IonLabel, IonList, IonListHeader]
})
export class TaskDetailPage implements OnInit {
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(+taskId);
    }
  }

  loadTask(taskId: number) {
    this.taskService.getTask(taskId).subscribe({
      next: (task) => {
        this.task = task;
      }
    });
  }

  openUserStory() {
    if (this.task?.user_story) {
      this.router.navigate(['/user-stories', this.task.user_story]);
    }
  }

  toggleWatch() {
    if (!this.task) return;
    
    if (this.task.is_watcher) {
      this.taskService.unwatch(this.task.id).subscribe(() => {
        if (this.task) {
          this.task.is_watcher = false;
          this.task.total_watchers--;
        }
      });
    } else {
      this.taskService.watch(this.task.id).subscribe(() => {
        if (this.task) {
          this.task.is_watcher = true;
          this.task.total_watchers++;
        }
      });
    }
  }

  async presentActionSheet() {
    if (!this.task) return;

    const buttons: any[] = [
      {
        text: 'Edit Task',
        icon: 'create-outline',
        handler: () => this.editTask()
      }
    ];

    if (this.task.is_blocked) {
      buttons.push({
        text: 'Unblock Task',
        icon: 'checkmark-circle-outline',
        handler: () => this.toggleBlock()
      });
    } else {
      buttons.push({
        text: 'Block Task',
        icon: 'warning-outline',
        handler: () => this.toggleBlock()
      });
    }

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Task Options',
      buttons
    });
    await actionSheet.present();
  }

  editTask() {
    // Open edit modal
  }

  toggleBlock() {
    if (!this.task) return;
    
    const isBlocked = !this.task.is_blocked;
    const blockedNote = isBlocked ? 'Task blocked' : '';
    
    this.taskService.updateTask(this.task.id, {
      is_blocked: isBlocked,
      blocked_note: blockedNote,
      version: this.task.version
    }).subscribe(() => {
      if (this.task) {
        this.task.is_blocked = isBlocked;
        this.task.blocked_note = blockedNote;
      }
    });
  }
}
