import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="projects">
          <ion-icon name="folder-outline"></ion-icon>
          <ion-label>Projects</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="backlog">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Backlog</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="kanban">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
          <ion-label>Kanban</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="issues">
          <ion-icon name="warning-outline"></ion-icon>
          <ion-label>Issues</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class TabsPage {}
