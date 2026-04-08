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
  IonNote,
  IonChip,
  ActionSheetController,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { UserStoryService } from '../../services/user-story.service';
import { UserStory } from '../../models';

@Component({
  selector: 'app-user-story-detail',
  template: `
    <ion-header *ngIf="userStory">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="'/tabs/backlog'"></ion-back-button>
        </ion-buttons>
        <ion-title>User Story #{{ userStory.ref }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="toggleWatch()">
            <ion-icon [name]="userStory.is_watcher ? 'eye-off' : 'eye'"></ion-icon>
          </ion-button>
          <ion-button (click)="presentActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="userStory">
      <ion-card>
        <ion-card-header>
          <div class="story-header">
            <ion-badge [style.--background]="userStory.status_extra_info.color">
              {{ userStory.status_extra_info.name }}
            </ion-badge>
            <div class="story-meta">
              <span class="points-badge" *ngIf="userStory.total_points">
                {{ userStory.total_points }} pts
              </span>
            </div>
          </div>
          <ion-card-title>{{ userStory.subject }}</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <div class="assignee-section" *ngIf="userStory.assigned_to_extra_info">
            <ion-item lines="none">
              <ion-avatar slot="start">
                <img [src]="'https://www.gravatar.com/avatar/' + userStory.assigned_to_extra_info.gravatar_id + '?d=identicon'">
              </ion-avatar>
              <ion-label>
                <h3>Assigned to</h3>
                <p>{{ userStory.assigned_to_extra_info.full_name_display }}</p>
              </ion-label>
            </ion-item>
          </div>

          <div class="description" *ngIf="userStory.description_html" [innerHTML]="userStory.description_html">
          </div>
          <div class="description" *ngIf="!userStory.description_html && userStory.description">
            <p>{{ userStory.description }}</p>
          </div>
          <div class="no-description" *ngIf="!userStory.description">
            <p>No description provided</p>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list>
        <ion-list-header>
          <ion-label>Details</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-icon name="folder-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Project</h3>
            <p>{{ userStory.project_name }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="userStory.milestone_name">
          <ion-icon name="flag-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Sprint</h3>
            <p>{{ userStory.milestone_name }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="person-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Created by</h3>
            <p>{{ userStory.owner_extra_info.full_name_display }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="userStory.due_date">
          <ion-icon name="calendar-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Due Date</h3>
            <p>{{ userStory.due_date | date }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="time-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Created</h3>
            <p>{{ userStory.created_date | date:'medium' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list *ngIf="userStory.tags && userStory.tags.length > 0">
        <ion-list-header>
          <ion-label>Tags</ion-label>
        </ion-list-header>
        <ion-item lines="none">
          <ion-chip *ngFor="let tag of userStory.tags" [color]="getTagColor(tag)">
            {{ tag }}
          </ion-chip>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Stats</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-icon name="eye-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>Watchers</ion-label>
          <ion-note slot="end">{{ userStory.total_watchers }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-icon name="trending-up-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>Votes</ion-label>
          <ion-note slot="end">{{ userStory.total_voters }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .story-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .points-badge {
      background: var(--ion-color-primary);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .assignee-section {
      margin-bottom: 16px;
    }

    .assignee-section ion-item {
      --background: var(--ion-color-light);
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
  imports: [
    CommonModule,
    RouterModule,
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
    IonNote,
    IonChip
  ]
})
export class UserStoryDetailPage implements OnInit {
  userStory: UserStory | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStoryService: UserStoryService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const storyId = this.route.snapshot.paramMap.get('id');
    if (storyId) {
      this.loadUserStory(+storyId);
    }
  }

  loadUserStory(storyId: number) {
    this.userStoryService.getUserStory(storyId).subscribe({
      next: (story) => {
        this.userStory = story;
      }
    });
  }

  getTagColor(tag: string): string {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  toggleWatch() {
    if (!this.userStory) return;
    
    if (this.userStory.is_watcher) {
      this.userStoryService.unwatch(this.userStory.id).subscribe(() => {
        if (this.userStory) {
          this.userStory.is_watcher = false;
          this.userStory.total_watchers--;
        }
      });
    } else {
      this.userStoryService.watch(this.userStory.id).subscribe(() => {
        if (this.userStory) {
          this.userStory.is_watcher = true;
          this.userStory.total_watchers++;
        }
      });
    }
  }

  async presentActionSheet() {
    if (!this.userStory) return;

    const buttons: any[] = [
      {
        text: 'Edit User Story',
        icon: 'create-outline',
        handler: () => this.editStory()
      },
      {
        text: this.userStory.is_voter ? 'Remove Vote' : 'Add Vote',
        icon: this.userStory.is_voter ? 'arrow-down-outline' : 'arrow-up-outline',
        handler: () => this.toggleVote()
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }
    ];

    const actionSheet = await this.actionSheetController.create({
      header: 'User Story Options',
      buttons
    });
    await actionSheet.present();
  }

  editStory() {
    // Open edit modal
  }

  toggleVote() {
    if (!this.userStory) return;

    if (this.userStory.is_voter) {
      this.userStoryService.downvote(this.userStory.id).subscribe(() => {
        if (this.userStory) {
          this.userStory.is_voter = false;
          this.userStory.total_voters--;
        }
      });
    } else {
      this.userStoryService.upvote(this.userStory.id).subscribe(() => {
        if (this.userStory) {
          this.userStory.is_voter = true;
          this.userStory.total_voters++;
        }
      });
    }
  }
}
