import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonProgressBar,
  IonItem,
  IonIcon,
  IonLabel,
  IonBadge,
  IonList,
  IonListHeader
} from '@ionic/angular/standalone';
import { MilestoneService } from '../../services/milestone.service';
import { UserStoryService } from '../../services/user-story.service';
import { Milestone, UserStory } from '../../models';

@Component({
  selector: 'app-milestone-detail',
  template: `
    <ion-header *ngIf="milestone">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ milestone.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="milestone">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Sprint Details</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="sprint-stats">
            <div class="stat-item">
              <div class="stat-value">{{ milestone.user_stories_counts?.total || 0 }}</div>
              <div class="stat-label">User Stories</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ milestone.user_stories_counts?.closed || 0 }}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ milestone.total_points || 0 }}</div>
              <div class="stat-label">Total Points</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ milestone.closed_points || 0 }}</div>
              <div class="stat-label">Completed Points</div>
            </div>
          </div>

          <ion-progress-bar
            [value]="getProgress()"
            [color]="getProgressColor()"
            class="sprint-progress"
          ></ion-progress-bar>

          <div class="sprint-dates">
            <ion-item lines="none">
              <ion-icon name="calendar-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Start Date</h3>
                <p>{{ milestone.estimated_start | date }}</p>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-icon name="flag-outline" slot="start" color="danger"></ion-icon>
              <ion-label>
                <h3>End Date</h3>
                <p>{{ milestone.estimated_finish | date }}</p>
              </ion-label>
            </ion-item>
          </div>

          <ion-badge [color]="milestone.closed ? 'success' : 'primary'" class="status-badge">
            {{ milestone.closed ? 'Closed' : 'Open' }}
          </ion-badge>
        </ion-card-content>
      </ion-card>

      <ion-list *ngIf="userStories.length > 0">
        <ion-list-header>
          <ion-label>User Stories</ion-label>
        </ion-list-header>

        <ion-item *ngFor="let story of userStories" (click)="openUserStory(story)" button detail>
          <div slot="start" class="story-points" [class.no-points]="!story.total_points">
            {{ story.total_points || '?' }}
          </div>
          <ion-label>
            <div class="story-header">
              <span class="story-ref">#{{ story.ref }}</span>
              <ion-badge [style.--background]="story.status_extra_info.color">
                {{ story.status_extra_info.name }}
              </ion-badge>
            </div>
            <h2>{{ story.subject }}</h2>
          </ion-label>
          <ion-icon
            slot="end"
            [name]="story.is_closed ? 'checkmark-circle' : 'ellipse-outline'"
            [color]="story.is_closed ? 'success' : 'medium'"
          ></ion-icon>
        </ion-item>
      </ion-list>

      <div *ngIf="userStories.length === 0 && !isLoading" class="empty-state">
        <ion-icon name="list-outline"></ion-icon>
        <h3>No User Stories</h3>
        <p>This sprint has no user stories yet.</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .sprint-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 12px;
      background: var(--ion-color-light);
      border-radius: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }

    .stat-label {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin-top: 4px;
    }

    .sprint-progress {
      margin: 16px 0;
      height: 8px;
      border-radius: 4px;
    }

    .sprint-dates {
      margin-top: 16px;
    }

    .status-badge {
      margin-top: 16px;
      padding: 8px 16px;
      font-size: 14px;
    }

    .story-points {
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--ion-color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .story-points.no-points {
      background: var(--ion-color-medium);
    }

    .story-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .story-ref {
      font-size: 12px;
      color: var(--ion-color-medium);
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
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonProgressBar,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    IonList,
    IonListHeader
  ]
})
export class MilestoneDetailPage implements OnInit {
  milestone: Milestone | null = null;
  userStories: UserStory[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private milestoneService: MilestoneService,
    private userStoryService: UserStoryService
  ) {}

  ngOnInit() {
    const milestoneId = this.route.snapshot.paramMap.get('id');
    if (milestoneId) {
      this.loadMilestone(+milestoneId);
      this.loadUserStories(+milestoneId);
    }
  }

  loadMilestone(milestoneId: number) {
    this.milestoneService.getMilestone(milestoneId).subscribe({
      next: (milestone) => {
        this.milestone = milestone;
      }
    });
  }

  loadUserStories(milestoneId: number) {
    this.isLoading = true;
    this.userStoryService.getUserStories({ milestone: milestoneId }).subscribe({
      next: (stories) => {
        this.userStories = stories;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getProgress(): number {
    if (!this.milestone?.user_stories_counts) return 0;
    const { total, closed } = this.milestone.user_stories_counts;
    if (total === 0) return 0;
    return closed / total;
  }

  getProgressColor(): string {
    const progress = this.getProgress();
    if (progress >= 1) return 'success';
    if (progress >= 0.5) return 'warning';
    return 'primary';
  }

  openUserStory(story: UserStory) {
    this.router.navigate(['/user-stories', story.id]);
  }
}
