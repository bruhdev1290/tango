import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ActionSheetController, ModalController } from '@ionic/angular/standalone';
import { UserStoryService } from '../../services/user-story.service';
import { UserStory, UserStoryStatus } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backlog',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Backlog</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="presentFilterActionSheet()">
            <ion-icon slot="icon-only" name="filter-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="createUserStory()">
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
        <ion-item *ngFor="let i of [1,2,3,4,5]">
          <ion-skeleton-text animated style="width: 100%; height: 60px;"></ion-skeleton-text>
        </ion-item>
      </div>

      <div *ngIf="!isLoading && userStories.length === 0" class="empty-state">
        <ion-icon name="list-outline"></ion-icon>
        <h3>No User Stories</h3>
        <p>This backlog is empty. Create your first user story to get started.</p>
        <ion-button (click)="createUserStory()">
          <ion-icon name="add-outline" slot="start"></ion-icon>
          Add User Story
        </ion-button>
      </div>

      <ion-accordion-group *ngIf="!isLoading && userStories.length > 0" [multiple]="true" [value]="['open']">
        <ion-accordion value="open">
          <ion-item slot="header" color="light">
            <ion-label>Open User Stories</ion-label>
            <ion-badge slot="end" color="primary">{{ openUserStories.length }}</ion-badge>
          </ion-item>
          
          <ion-list slot="content">
            <ion-item-sliding *ngFor="let story of openUserStories">
              <ion-item (click)="openUserStory(story)" button detail>
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
                  <p *ngIf="story.assigned_to_extra_info">
                    <ion-icon name="person-outline"></ion-icon>
                    {{ story.assigned_to_extra_info.full_name_display }}
                  </p>
                </ion-label>
                <div slot="end" class="story-meta">
                  <ion-icon
                    *ngIf="story.is_watcher"
                    name="eye"
                    color="primary"
                  ></ion-icon>
                </div>
              </ion-item>
              
              <ion-item-options side="end">
                <ion-item-option color="primary" (click)="editUserStory(story)">
                  <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                </ion-item-option>
                <ion-item-option color="danger" (click)="deleteUserStory(story)">
                  <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </ion-list>
        </ion-accordion>

        <ion-accordion value="closed">
          <ion-item slot="header" color="light">
            <ion-label>Closed User Stories</ion-label>
            <ion-badge slot="end" color="success">{{ closedUserStories.length }}</ion-badge>
          </ion-item>
          
          <ion-list slot="content">
            <ion-item *ngFor="let story of closedUserStories" (click)="openUserStory(story)" button detail>
              <div slot="start" class="story-points completed">
                {{ story.total_points || '?' }}
              </div>
              <ion-label>
                <div class="story-header">
                  <span class="story-ref">#{{ story.ref }}</span>
                  <ion-badge color="success">
                    {{ story.status_extra_info.name }}
                  </ion-badge>
                </div>
                <h2 class="completed-text">{{ story.subject }}</h2>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  `,
  styles: [`
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

    .story-points.completed {
      background: var(--ion-color-success);
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

    .completed-text {
      text-decoration: line-through;
      color: var(--ion-color-medium);
    }

    .story-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ion-badge {
      font-size: 10px;
      padding: 4px 8px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})
export class BacklogPage implements OnInit {
  userStories: UserStory[] = [];
  isLoading = true;
  projectId?: number;
  selectedStatus?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStoryService: UserStoryService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['project'] ? +params['project'] : undefined;
      this.loadUserStories();
    });
  }

  loadUserStories() {
    this.isLoading = true;
    const filter: any = {};
    if (this.projectId) {
      filter.project = this.projectId;
    }
    if (this.selectedStatus) {
      filter.status = this.selectedStatus;
    }

    this.userStoryService.getUserStories(filter).subscribe({
      next: (stories) => {
        this.userStories = stories;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  refresh(event: any) {
    this.loadUserStories();
    event.target.complete();
  }

  get openUserStories(): UserStory[] {
    return this.userStories.filter(s => !s.is_closed);
  }

  get closedUserStories(): UserStory[] {
    return this.userStories.filter(s => s.is_closed);
  }

  openUserStory(story: UserStory) {
    this.router.navigate(['/user-stories', story.id]);
  }

  createUserStory() {
    // Open create modal
  }

  editUserStory(story: UserStory) {
    // Open edit modal
  }

  async deleteUserStory(story: UserStory) {
    // Show confirmation and delete
  }

  async presentFilterActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter By',
      buttons: [
        {
          text: 'All User Stories',
          handler: () => {
            this.selectedStatus = undefined;
            this.loadUserStories();
          }
        },
        {
          text: 'New',
          handler: () => {
            // Filter by new status
          }
        },
        {
          text: 'In Progress',
          handler: () => {
            // Filter by in progress status
          }
        },
        {
          text: 'Done',
          handler: () => {
            // Filter by done status
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
