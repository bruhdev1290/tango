import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ActionSheetController, LoadingController } from '@ionic/angular/standalone';
import { ProjectService } from '../../services/project.service';
import { ProjectDetail, Milestone } from '../../models';
import { MilestoneService } from '../../services/milestone.service';

@Component({
  selector: 'app-project-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/projects"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ project?.name || 'Project' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="presentActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="project">
      <ion-card>
        <ion-card-header>
          <div class="project-header">
            <ion-avatar *ngIf="project.logo_small_url">
              <img [src]="project.logo_small_url" [alt]="project.name">
            </ion-avatar>
            <div>
              <ion-card-title>{{ project.name }}</ion-card-title>
              <ion-card-subtitle>{{ project.owner.full_name_display }}</ion-card-subtitle>
            </div>
          </div>
        </ion-card-header>
        
        <ion-card-content>
          <p *ngIf="project.description">{{ project.description }}</p>
          
          <div class="project-modules">
            <ion-chip *ngIf="project.is_backlog_activated" color="primary">
              <ion-icon name="list-outline"></ion-icon>
              <ion-label>Backlog</ion-label>
            </ion-chip>
            <ion-chip *ngIf="project.is_kanban_activated" color="success">
              <ion-icon name="checkmark-circle-outline"></ion-icon>
              <ion-label>Kanban</ion-label>
            </ion-chip>
            <ion-chip *ngIf="project.is_issues_activated" color="warning">
              <ion-icon name="warning-outline"></ion-icon>
              <ion-label>Issues</ion-label>
            </ion-chip>
            <ion-chip *ngIf="project.is_wiki_activated" color="tertiary">
              <ion-icon name="book-outline"></ion-icon>
              <ion-label>Wiki</ion-label>
            </ion-chip>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list>
        <ion-list-header>
          <ion-label>Menu</ion-label>
        </ion-list-header>

        <ion-item (click)="navigateTo('backlog')" *ngIf="project.is_backlog_activated" button>
          <ion-icon name="list-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>Backlog</h2>
            <p>User stories and sprints</p>
          </ion-label>
          <ion-badge slot="end" color="primary">{{ project.total_story_points || 0 }} pts</ion-badge>
        </ion-item>

        <ion-item (click)="navigateTo('kanban')" *ngIf="project.is_kanban_activated" button>
          <ion-icon name="checkmark-circle-outline" slot="start" color="success"></ion-icon>
          <ion-label>
            <h2>Kanban Board</h2>
            <p>Visual task management</p>
          </ion-label>
        </ion-item>

        <ion-item (click)="navigateTo('issues')" *ngIf="project.is_issues_activated" button>
          <ion-icon name="warning-outline" slot="start" color="warning"></ion-icon>
          <ion-label>
            <h2>Issues</h2>
            <p>Bugs, questions and enhancements</p>
          </ion-label>
        </ion-item>

        <ion-item (click)="navigateTo('wiki')" *ngIf="project.is_wiki_activated" button>
          <ion-icon name="book-outline" slot="start" color="tertiary"></ion-icon>
          <ion-label>
            <h2>Wiki</h2>
            <p>Project documentation</p>
          </ion-label>
        </ion-item>

        <ion-item (click)="showMembers()" button>
          <ion-icon name="people-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>
            <h2>Members</h2>
            <p>{{ project.total_memberships }} team members</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list *ngIf="milestones.length > 0">
        <ion-list-header>
          <ion-label>Sprints / Milestones</ion-label>
        </ion-list-header>

        <ion-item *ngFor="let milestone of milestones" (click)="openMilestone(milestone)" button>
          <ion-icon name="flag-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>{{ milestone.name }}</h2>
            <p>{{ milestone.estimated_start | date }} - {{ milestone.estimated_finish | date }}</p>
          </ion-label>
          <ion-badge slot="end" [color]="milestone.closed ? 'success' : 'primary'">
            {{ milestone.closed ? 'Closed' : 'Open' }}
          </ion-badge>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Project Stats</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-label>Total Activity</ion-label>
          <ion-note slot="end">{{ project.total_activity }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-label>Story Points</ion-label>
          <ion-note slot="end">{{ project.total_story_points || 0 }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-label>Milestones</ion-label>
          <ion-note slot="end">{{ project.total_milestones }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-label>Watchers</ion-label>
          <ion-note slot="end">{{ project.total_watchers }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-content *ngIf="!project && !isLoading">
      <div class="empty-state">
        <ion-icon name="cloud-offline-outline"></ion-icon>
        <h3>Project Not Found</h3>
        <p>The project you're looking for doesn't exist or you don't have access to it.</p>
        <ion-button routerLink="/tabs/projects">Go Back</ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .project-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .project-modules {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    ion-avatar {
      width: 64px;
      height: 64px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ProjectDetailPage implements OnInit {
  project: ProjectDetail | null = null;
  milestones: Milestone[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private milestoneService: MilestoneService,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(+projectId);
      this.loadMilestones(+projectId);
    }
  }

  async loadProject(projectId: number) {
    const loading = await this.loadingController.create({
      message: 'Loading project...'
    });
    await loading.present();

    this.projectService.getProject(projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
        loading.dismiss();
      },
      error: () => {
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }

  loadMilestones(projectId: number) {
    this.milestoneService.getMilestones(projectId).subscribe({
      next: (milestones) => {
        this.milestones = milestones;
      }
    });
  }

  navigateTo(section: string) {
    if (this.project) {
      this.router.navigate([`/tabs/${section}`], {
        queryParams: { project: this.project.id }
      });
    }
  }

  openMilestone(milestone: Milestone) {
    this.router.navigate(['/milestones', milestone.id]);
  }

  showMembers() {
    // Navigate to members page
  }

  async presentActionSheet() {
    const buttons: any[] = [
      {
        text: 'Project Settings',
        icon: 'settings-outline',
        handler: () => {
          // Navigate to settings
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }
    ];

    if (this.project?.i_am_owner) {
      buttons.unshift({
        text: 'Delete Project',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => this.deleteProject()
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Project Options',
      buttons
    });
    await actionSheet.present();
  }

  async deleteProject() {
    // Show confirmation and delete project
  }
}
