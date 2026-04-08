import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  folderOutline,
  listOutline,
  checkmarkCircleOutline,
  warningOutline,
  bookOutline,
  flagOutline,
  personOutline,
  settingsOutline,
  logOutOutline,
  addOutline,
  searchOutline,
  filterOutline,
  ellipsisVerticalOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
  trashOutline,
  closeOutline,
  checkmarkOutline,
  timeOutline,
  calendarOutline,
  flagOutline as flag,
  pricetagOutline,
  eyeOutline,
  eyeOffOutline,
  heartOutline,
  heartDislikeOutline,
  arrowUpOutline,
  arrowDownOutline,
  linkOutline,
  attachOutline,
  chatbubbleOutline,
  notificationsOutline,
  menuOutline,
  refreshOutline,
  cloudOfflineOutline,
  helpCircleOutline,
  informationCircleOutline,
  bugOutline,
  flashOutline,
  trendingUpOutline,
  peopleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterModule]
})
export class AppComponent {
  constructor() {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      'home-outline': homeOutline,
      'folder-outline': folderOutline,
      'list-outline': listOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'warning-outline': warningOutline,
      'book-outline': bookOutline,
      'flag-outline': flagOutline,
      'person-outline': personOutline,
      'settings-outline': settingsOutline,
      'log-out-outline': logOutOutline,
      'add-outline': addOutline,
      'search-outline': searchOutline,
      'filter-outline': filterOutline,
      'ellipsis-vertical-outline': ellipsisVerticalOutline,
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'close-outline': closeOutline,
      'checkmark-outline': checkmarkOutline,
      'time-outline': timeOutline,
      'calendar-outline': calendarOutline,
      'pricetag-outline': pricetagOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'heart-outline': heartOutline,
      'heart-dislike-outline': heartDislikeOutline,
      'arrow-up-outline': arrowUpOutline,
      'arrow-down-outline': arrowDownOutline,
      'link-outline': linkOutline,
      'attach-outline': attachOutline,
      'chatbubble-outline': chatbubbleOutline,
      'notifications-outline': notificationsOutline,
      'menu-outline': menuOutline,
      'refresh-outline': refreshOutline,
      'cloud-offline-outline': cloudOfflineOutline,
      'help-circle-outline': helpCircleOutline,
      'information-circle-outline': informationCircleOutline,
      'bug-outline': bugOutline,
      'flash-outline': flashOutline,
      'trending-up-outline': trendingUpOutline,
      'people-outline': peopleOutline
    });
  }
}
