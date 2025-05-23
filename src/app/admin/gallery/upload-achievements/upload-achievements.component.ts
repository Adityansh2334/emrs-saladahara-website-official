import { Component, Input, OnInit } from '@angular/core';
import {
  faUpload,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { AchievementService, Achievement } from '../../services/achievement.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { GeneralGalleryImageUploaderComponent } from '../../shared/general-gallery-image-uploader/general-gallery-image-uploader.component';
import { AchievementViewerComponent } from '../../shared/achievement-viewer/achievement-viewer.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { dataURLtoFile } from '../../../utils/file-utils';

const MAX_ACHIEVEMENTS = 20;

@Component({
  selector: 'app-achievement-upload',
  templateUrl: './upload-achievements.component.html',
  standalone: true,
  styleUrls: ['./upload-achievements.component.scss'],
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass,
    FaIconComponent,
    GeneralGalleryImageUploaderComponent,
    AchievementViewerComponent
  ]
})
export class AchievementUploadComponent implements OnInit {
  @Input() sectionType: 'general' | 'sports' | 'science' = 'general';

  achievements: {
    title: string;
    description: string;
    imageFile?: string;
    fileObject?: File;
    section: 'general' | 'sports' | 'science';
  }[] = [{ title: '', description: '', section: this.sectionType }];

  existingAchievements: Achievement[] = [];
  showDeleteConfirm = false;
  selectedAchievementId: number | null = null;
  editingAchievement: Achievement | null = null;

  faUpload = faUpload;
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;

  showNotification = false;
  isSuccess = true;
  notificationMessage = '';
  notificationTitle = '';
  notificationIcon = this.faCheckCircle;
  oldImageUrl = '';
  isLoading = false;
  isDeleting = false;
  isLoadingMap: { [index: number]: boolean } = {};

  constructor(
    private achievementService: AchievementService
  ) {}

  get activeService(): AchievementService {
    switch (this.sectionType) {
      default: return this.achievementService;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadAchievements();
  }

  async loadAchievements() {
    this.isLoading = true;
    this.existingAchievements = await this.activeService.fetchAchievements(this.sectionType).then( achievements => {
      this.isLoading = false;
      return achievements;
    });
  }

  onImageSelected(files: File[], index: number) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.achievements[index].imageFile = reader.result as string;
      this.achievements[index].fileObject = file;
    };
    reader.readAsDataURL(file);
  }

  async onSubmit(index: number) {
    if (this.existingAchievements.length >= MAX_ACHIEVEMENTS) {
      this.showError(`Maximum ${MAX_ACHIEVEMENTS} achievements allowed. Please delete some before adding new ones.`, "Limit Reached ❌");
      return;
    }
    const entry = this.achievements[index];
    if (!entry.fileObject || !entry.title.trim() || !entry.description.trim()) {
      this.showError('Image, title, and description are required.', 'Validation Error');
      return;
    }

    try {
      this.isLoadingMap[index] = true;
      await firstValueFrom(
        this.activeService.saveAchievementWithImage(entry.fileObject, {
          section: this.sectionType,
          title: entry.title,
          description: entry.description
        })
      );

      this.showSuccess('Achievement uploaded successfully.', 'Upload Success ✅');
      this.achievements[index] = { title: '', description: '' , section: this.sectionType};
      await this.loadAchievements();
      this.isLoadingMap[index] = false;
    } catch (error: any) {
      this.showError(error.message || 'Upload failed.', 'Upload Failed ❌');
      this.isLoadingMap[index] = false;
    }
  }

  // Notification methods
  showSuccess(message: string, title: string) {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.isSuccess = true;
    this.notificationIcon = this.faCheckCircle;
    this.showNotification = true;
  }

  showError(message: string, title: string) {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.isSuccess = false;
    this.notificationIcon = this.faExclamationCircle;
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }

  onDelete(event:{id: number, image: string}) {
    this.selectedAchievementId = event.id;
    this.showDeleteConfirm = true;
    this.oldImageUrl = event.image;
  }

  async confirmDelete() {
    if (this.selectedAchievementId !== null) {
      this.isDeleting = true;
      try {
        await firstValueFrom(this.activeService.deleteAchievement(this.selectedAchievementId, this.oldImageUrl, this.sectionType));
        this.showSuccess('Achievement deleted successfully.', 'Delete Success');
        this.isDeleting = false;
        await this.loadAchievements();
      } catch (error: any) {
        this.showError(error.message || 'Failed to delete achievement.', 'Delete Error');
      }
    }
    this.showDeleteConfirm = false;
    this.selectedAchievementId = null;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.selectedAchievementId = null;
  }

  onSaveEdit(achievement: Achievement) {
    if (!achievement?.title.trim() || !achievement?.description.trim()) {
      this.showError("Title and description are required.", "Validation Error");
      return;
    }
    try {
      const isNewImage = achievement.coverImage?.startsWith("data:image");
      if (isNewImage) {
        const fileObject = dataURLtoFile(achievement.coverImage);
        if (achievement.id) {
          this.activeService.deleteAchievement(achievement.id,'', achievement.section).subscribe();
        }
        achievement.id = undefined;
        this.activeService.saveAchievementWithImage(fileObject, achievement).subscribe({
          next: () => {
            this.showSuccess('Achievement updated successfully.', 'Update Success ✅');
            this.loadAchievements().then(() => this.cancelEdit());
          },
          error: () => this.showError('Failed to update achievement.', 'Update Failed ❌')
        });
      } else {
        this.activeService.updateAchievement(achievement).subscribe({
          next: () => {
            this.showSuccess('Achievement updated successfully.', 'Update Success ✅');
            this.loadAchievements();
            this.cancelEdit();
          },
          error: () => this.showError('Failed to update achievement.', 'Update Failed ❌')
        });
      }
    } catch (error: any) {
      this.showError(error.message || 'An error occurred while saving the achievement.', 'Error');
    }
  }

  cancelEdit() {
    this.editingAchievement = null;
  }
}
