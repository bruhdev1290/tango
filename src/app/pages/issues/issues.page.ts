import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ActionSheetController } from '@ionic/angular/standalone';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models';

@Component({
  selector: 'app-issues',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Issues</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="presentFilterActionSheet()">
            <ion-icon slot="icon-only" name="filter-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="createIssue()">
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

      <div *ngIf="!isLoading && issues.length === 0" class="empty-state">
        <ion-icon name="bug-outline"></ion-icon>
        <h3>No Issues</h3>
        <p>No issues found. Create your first issue to track bugs, questions, or enhancements.</p>
        <ion-button (click)="createIssue()">
          <ion-icon name="add-outline" slot="start"></ion-icon>
          Add Issue
        </ion-button>
      </div>

      <ion-list *ngIf="!isLoading && issues.length > 0">
        <ion-item-sliding *ngFor="let issue of issues">
          <ion-item (click)="openIssue(issue)" button detail>
            <div slot="start" class="issue-type">
              <ion-icon
                [name]="getIssueTypeIcon(issue.type_extra_info?.name)"
                [color]="getIssueTypeColor(issue.type_extra_info?.name)"
              ></ion-icon>
            </div>
            <ion-label>
              <div class="issue-header">
                <span class="issue-ref">#{{ issue.ref }}</span>
                <ion-badge [style.--background]="issue.status_extra_info?.color">
                  {{ issue.status_extra_info?.name }}
                </ion-badge>
                <ion-badge
                  *ngIf="issue.priority_extra_info"
                  [style.--background]="issue.priority_extra_info.color"
                  style="margin-left: 4px;"
                >
                  {{ issue.priority_extra_info.name }}
                </ion-badge>
              </div>
              <h2>{{ issue.subject }}</h2>
              <p>
                <ion-icon name="person-outline"></ion-icon>
                {{ issue.assigned_to_extra_info?.full_name_display || 'Unassigned' }}
                <span class="separator">•</span>
                <ion-icon name="chatbubble-outline"></ion-icon>
                {{ issue.total_watchers }}
              </p>
            </ion-label>
          </ion-item>
          
          <ion-item-options side="end">
            <ion-item-option color="primary" (click)="editIssue(issue)">
              <ion-icon slot="icon-only" name="create-outline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" (click)="deleteIssue(issue)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>

    <ion-fab slot="fixed" vertical="bottom" horizontal="end" style="bottom: 70px;">
      <ion-fab-button (click)="createIssue()">
        <ion-icon name="add-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [`
    .issue-type {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--ion-color-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .issue-type ion-icon {
      font-size: 24px;
    }

    .issue-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .issue-ref {
      font-size: 12px;
      color: var(--ion-color-medium);
    }

    ion-badge {
      font-size: 10px;
      padding: 4px 8px;
    }

    .separator {
      margin: 0 8px;
      color: var(--ion-color-medium);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class IssuesPage implements OnInit {
  issues: Issue[] = [];
  isLoading = true;
  projectId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['project'] ? +params['project'] : undefined;
      this.loadIssues();
    });
  }

  loadIssues() {
    this.isLoading = true;
    const filter: any = {};
    if (this.projectId) {
      filter.project = this.projectId;
    }

    this.issueService.getIssues(filter).subscribe({
      next: (issues) => {
        this.issues = issues;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  refresh(event: any) {
    this.loadIssues();
    event.target.complete();
  }

  getIssueTypeIcon(typeName?: string): string {
    switch (typeName?.toLowerCase()) {
      case 'bug': return 'bug-outline';
      case 'question': return 'help-circle-outline';
      case 'enhancement': return 'flash-outline';
      default: return 'warning-outline';
    }
  }

  getIssueTypeColor(typeName?: string): string {
    switch (typeName?.toLowerCase()) {
      case 'bug': return 'danger';
      case 'question': return 'tertiary';
      case 'enhancement': return 'success';
      default: return 'warning';
    }
  }

  openIssue(issue: Issue) {
    this.router.navigate(['/issues', issue.id]);
  }

  createIssue() {
    // Open create modal
  }

  editIssue(issue: Issue) {
    // Open edit modal
  }

  async deleteIssue(issue: Issue) {
    // Show confirmation and delete
  }

  async presentFilterActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter Issues',
      buttons: [
        {
          text: 'All Issues',
          handler: () => this.loadIssues()
        },
        {
          text: 'Bugs Only',
          handler: () => {
            // Filter bugs
          }
        },
        {
          text: 'Open Issues',
          handler: () => {
            // Filter open
          }
        },
        {
          text: 'My Issues',
          handler: () => {
            // Filter assigned to me
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
