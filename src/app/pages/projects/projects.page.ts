import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, RefresherCustomEvent, LoadingController, ActionSheetController } from '@ionic/angular/standalone';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models';
import { addIcons } from 'ionicons';
import { addOutline, searchOutline, ellipsisVerticalOutline, heartOutline, heartDislikeOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-projects',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>My Projects</ion-title>
        <ion-buttons slot="primary">
          <ion-button (click)="showSearch()">
            <ion-icon slot="icon-only" name="search-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="presentActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      
      <ion-toolbar *ngIf="isSearching" color="primary">
        <ion-searchbar
          showCancelButton="always"
          (ionInput)="search($event)"
          (ionCancel)="cancelSearch()"
          placeholder="Search projects..."
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="isLoading" class="ion-padding">
        <ion-card *ngFor="let i of [1,2,3]">
          <ion-card-header>
            <ion-skeleton-text animated style="width: 60%; height: 24px;"></ion-skeleton-text>
          </ion-card-header>
          <ion-card-content>
            <ion-skeleton-text animated style="width: 80%; height: 16px;"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 40%; height: 16px;"></ion-skeleton-text>
          </ion-card-content>
        </ion-card>
      </div>

      <div *ngIf="!isLoading && projects.length === 0" class="empty-state">
        <ion-icon name="folder-open-outline"></ion-icon>
        <h3>No Projects Yet</h3>
        <p>You don't have any projects. Create your first project to get started.</p>
        <ion-button (click)="createProject()">
          <ion-icon name="add-outline" slot="start"></ion-icon>
          Create Project
        </ion-button>
      </div>

      <ion-list *ngIf="!isLoading && projects.length > 0" lines="none">
        <ion-card
          *ngFor="let project of projects"
          class="project-card"
          (click)="openProject(project)"
        >
          <ion-card-header>
            <div class="project-header">
              <ion-avatar *ngIf="project.logo_small_url">
                <img [src]="project.logo_small_url" [alt]="project.name">
              </ion-avatar>
              <div class="project-title" [class.no-logo]="!project.logo_small_url">
                <ion-card-title>{{ project.name }}</ion-card-title>
                <ion-card-subtitle>{{ project.owner.full_name_display }}</ion-card-subtitle>
              </div>
              <ion-badge [color]="project.is_private ? 'medium' : 'success'">
                {{ project.is_private ? 'Private' : 'Public' }}
              </ion-badge>
            </div>
          </ion-card-header>
          
          <ion-card-content>
            <p *ngIf="project.description" class="description">
              {{ project.description | slice:0:100 }}{{ project.description.length > 100 ? '...' : '' }}
            </p>
            
            <div class="project-stats">
              <div class="stat">
                <ion-icon name="people-outline" color="medium"></ion-icon>
                <span>{{ project.total_memberships }}</span>
              </div>
              <div class="stat">
                <ion-icon name="heart-outline" color="medium"></ion-icon>
                <span>{{ project.total_fans }}</span>
              </div>
              <div class="stat">
                <ion-icon name="flash-outline" color="medium"></ion-icon>
                <span>{{ project.total_activity_last_week }}</span>
              </div>
            </div>

            <div class="project-actions" (click)="$event.stopPropagation()">
              <ion-button
                fill="clear"
                size="small"
                (click)="toggleLike(project, $event)"
              >
                <ion-icon
                  [name]="project.is_fan ? 'heart' : 'heart-outline'"
                  [color]="project.is_fan ? 'danger' : 'medium'"
                ></ion-icon>
              </ion-button>
              <ion-button
                fill="clear"
                size="small"
                (click)="toggleWatch(project, $event)"
              >
                <ion-icon
                  [name]="project.is_watcher ? 'eye-off' : 'eye'"
                  color="medium"
                ></ion-icon>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <ion-infinite-scroll (ionInfinite)="loadMore($event)">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>

    <ion-fab slot="fixed" vertical="bottom" horizontal="end" style="bottom: 70px;">
      <ion-fab-button (click)="createProject()">
        <ion-icon name="add-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [`
    .project-card {
      margin: 12px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .project-card:active {
      transform: scale(0.98);
    }

    .project-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .project-title {
      flex: 1;
    }

    .project-title.no-logo {
      margin-left: 0;
    }

    .description {
      color: var(--ion-color-medium);
      margin-bottom: 12px;
    }

    .project-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 8px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--ion-color-medium);
      font-size: 14px;
    }

    .project-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--ion-color-light);
      padding-top: 8px;
      margin-top: 8px;
    }

    ion-avatar {
      width: 48px;
      height: 48px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ProjectsPage implements OnInit {
  projects: Project[] = [];
  isLoading = true;
  isSearching = false;
  currentPage = 1;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({
      'add-outline': addOutline,
      'search-outline': searchOutline,
      'ellipsis-vertical-outline': ellipsisVerticalOutline,
      'heart-outline': heartOutline,
      'heart': heartDislikeOutline,
      'eye-outline': eyeOutline,
      'eye-off': eyeOffOutline
    });
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(event?: any) {
    this.isLoading = true;
    this.projectService.getProjects({ page: this.currentPage }).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
      error: () => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  refresh(event: RefresherCustomEvent) {
    this.currentPage = 1;
    this.loadProjects(event);
  }

  loadMore(event: any) {
    this.currentPage++;
    this.projectService.getProjects({ page: this.currentPage }).subscribe({
      next: (projects) => {
        this.projects.push(...projects);
        event.target.complete();
        if (projects.length === 0) {
          event.target.disabled = true;
        }
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  openProject(project: Project) {
    this.router.navigate(['/tabs/projects', project.id]);
  }

  async createProject() {
    // Navigate to project creation page
  }

  showSearch() {
    this.isSearching = true;
  }

  cancelSearch() {
    this.isSearching = false;
    this.loadProjects();
  }

  search(event: any) {
    const query = event.target.value;
    if (query && query.length > 2) {
      this.projectService.searchProjects(query).subscribe({
        next: (projects) => {
          this.projects = projects;
        }
      });
    } else if (!query) {
      this.loadProjects();
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Projects',
      buttons: [
        {
          text: 'Create Project',
          icon: 'add-outline',
          handler: () => this.createProject()
        },
        {
          text: 'Discover Projects',
          icon: 'compass-outline',
          handler: () => {
            // Navigate to discover
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

  toggleLike(project: Project, event: Event) {
    event.stopPropagation();
    if (project.is_fan) {
      this.projectService.unlikeProject(project.id).subscribe(() => {
        project.is_fan = false;
        project.total_fans--;
      });
    } else {
      this.projectService.likeProject(project.id).subscribe(() => {
        project.is_fan = true;
        project.total_fans++;
      });
    }
  }

  toggleWatch(project: Project, event: Event) {
    event.stopPropagation();
    if (project.is_watcher) {
      this.projectService.unwatchProject(project.id).subscribe(() => {
        project.is_watcher = false;
        project.total_watchers--;
      });
    } else {
      this.projectService.watchProject(project.id).subscribe(() => {
        project.is_watcher = true;
        project.total_watchers++;
      });
    }
  }
}
