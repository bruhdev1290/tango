import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ActionSheetController } from '@ionic/angular/standalone';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models';

@Component({
  selector: 'app-issue-detail',
  template: `
    <ion-header *ngIf="issue">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="'/tabs/issues'"></ion-back-button>
        </ion-buttons>
        <ion-title>Issue #{{ issue.ref }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="toggleWatch()">
            <ion-icon [name]="issue.is_watcher ? 'eye-off' : 'eye'"></ion-icon>
          </ion-button>
          <ion-button (click)="toggleVote()">
            <ion-icon [name]="issue.is_voter ? 'arrow-down' : 'arrow-up'" [color]="issue.is_voter ? 'danger' : 'success'"></ion-icon>
          </ion-button>
          <ion-button (click)="presentActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="issue">
      <ion-card>
        <ion-card-header>
          <div class="issue-header">
            <ion-badge [style.--background]="issue.type_extra_info?.color">
              {{ issue.type_extra_info?.name }}
            </ion-badge>
            <ion-badge [style.--background]="issue.status_extra_info?.color">
              {{ issue.status_extra_info?.name }}
            </ion-badge>
            <div class="issue-badges">
              <ion-icon *ngIf="issue.is_blocked" name="warning" color="danger"></ion-icon>
            </div>
          </div>
          <ion-card-title>{{ issue.subject }}</ion-card-title>
          <div class="issue-meta">
            <ion-badge [style.--background]="issue.priority_extra_info?.color">
              {{ issue.priority_extra_info?.name }}
            </ion-badge>
            <ion-badge [style.--background]="issue.severity_extra_info?.color">
              {{ issue.severity_extra_info?.name }}
            </ion-badge>
          </div>
        </ion-card-header>
        
        <ion-card-content>
          <div class="assignee-section" *ngIf="issue.assigned_to_extra_info">
            <ion-item lines="none">
              <ion-avatar slot="start">
                <img [src]="'https://www.gravatar.com/avatar/' + issue.assigned_to_extra_info.gravatar_id + '?d=identicon'">
              </ion-avatar>
              <ion-label>
                <h3>Assigned to</h3>
                <p>{{ issue.assigned_to_extra_info.full_name_display }}</p>
              </ion-label>
            </ion-item>
          </div>

          <div class="blocked-note" *ngIf="issue.is_blocked && issue.blocked_note">
            <ion-item lines="none" color="danger">
              <ion-icon name="warning" slot="start"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h3>Blocked</h3>
                <p>{{ issue.blocked_note }}</p>
              </ion-label>
            </ion-item>
          </div>

          <div class="description" *ngIf="issue.description_html" [innerHTML]="issue.description_html"></div>
          <div class="description" *ngIf="!issue.description_html && issue.description">
            <p>{{ issue.description }}</p>
          </div>
          <div class="no-description" *ngIf="!issue.description">
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
            <p>{{ issue.project_name }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="issue.milestone_name">
          <ion-icon name="flag-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Sprint</h3>
            <p>{{ issue.milestone_name }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon name="person-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Created by</h3>
            <p>{{ issue.owner_extra_info?.full_name_display }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="issue.due_date">
          <ion-icon name="calendar-outline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h3>Due Date</h3>
            <p>{{ issue.due_date | date }}</p>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="issue.finished_date">
          <ion-icon name="checkmark-circle-outline" slot="start" color="success"></ion-icon>
          <ion-label>
            <h3>Resolved</h3>
            <p>{{ issue.finished_date | date:'medium' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Stats</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-icon name="eye-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>Watchers</ion-label>
          <ion-note slot="end">{{ issue.total_watchers }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-icon name="trending-up-outline" slot="start" color="secondary"></ion-icon>
          <ion-label>Votes</ion-label>
          <ion-note slot="end">{{ issue.total_voters }}</ion-note>
        </ion-item>
      </ion-list>

      <ion-list *ngIf="issue.tags && issue.tags.length > 0">
        <ion-list-header>
          <ion-label>Tags</ion-label>
        </ion-list-header>
        <ion-item lines="none">
          <ion-chip *ngFor="let tag of issue.tags" color="primary">
            {{ tag }}
          </ion-chip>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .issue-header {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .issue-badges {
      margin-left: auto;
    }

    .issue-badges ion-icon {
      font-size: 20px;
    }

    .issue-meta {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
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
  imports: [CommonModule, IonicModule, RouterModule]
})
export class IssueDetailPage implements OnInit {
  issue: Issue | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    const issueId = this.route.snapshot.paramMap.get('id');
    if (issueId) {
      this.loadIssue(+issueId);
    }
  }

  loadIssue(issueId: number) {
    this.issueService.getIssue(issueId).subscribe({
      next: (issue) => {
        this.issue = issue;
      }
    });
  }

  toggleWatch() {
    if (!this.issue) return;
    
    if (this.issue.is_watcher) {
      this.issueService.unwatch(this.issue.id).subscribe(() => {
        if (this.issue) {
          this.issue.is_watcher = false;
          this.issue.total_watchers--;
        }
      });
    } else {
      this.issueService.watch(this.issue.id).subscribe(() => {
        if (this.issue) {
          this.issue.is_watcher = true;
          this.issue.total_watchers++;
        }
      });
    }
  }

  toggleVote() {
    if (!this.issue) return;

    if (this.issue.is_voter) {
      this.issueService.downvote(this.issue.id).subscribe(() => {
        if (this.issue) {
          this.issue.is_voter = false;
          this.issue.total_voters--;
        }
      });
    } else {
      this.issueService.upvote(this.issue.id).subscribe(() => {
        if (this.issue) {
          this.issue.is_voter = true;
          this.issue.total_voters++;
        }
      });
    }
  }

  async presentActionSheet() {
    if (!this.issue) return;

    const buttons: any[] = [
      {
        text: 'Edit Issue',
        icon: 'create-outline',
        handler: () => this.editIssue()
      }
    ];

    if (this.issue.is_blocked) {
      buttons.push({
        text: 'Unblock Issue',
        icon: 'checkmark-circle-outline',
        handler: () => this.toggleBlock()
      });
    } else {
      buttons.push({
        text: 'Block Issue',
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
      header: 'Issue Options',
      buttons
    });
    await actionSheet.present();
  }

  editIssue() {
    // Open edit modal
  }

  toggleBlock() {
    if (!this.issue) return;
    
    const isBlocked = !this.issue.is_blocked;
    const blockedNote = isBlocked ? 'Issue blocked' : '';
    
    this.issueService.updateIssue(this.issue.id, {
      is_blocked: isBlocked,
      blocked_note: blockedNote,
      version: this.issue.version
    }).subscribe(() => {
      if (this.issue) {
        this.issue.is_blocked = isBlocked;
        this.issue.blocked_note = blockedNote;
      }
    });
  }
}
