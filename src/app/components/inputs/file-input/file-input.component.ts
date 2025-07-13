import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-file-input',
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent {
  @Input() accept: string = '';
  @Input() multiple: boolean = true;
  @Output() filesChange = new EventEmitter<File[]>();

  files: File[] = [];
  imagePreviews: string[] = [];
  dragOver = false;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  private addFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    if (!this.multiple) {
      this.files = [newFiles[0]];
      this.imagePreviews = [];
    } else {
      this.files = [...this.files, ...newFiles];
    }
    this.generatePreviews();
    this.filesChange.emit(this.files);
  }

  removeFile(index: number) {
    if (index >= 0 && index < this.files.length) {
      this.files.splice(index, 1);
      this.imagePreviews.splice(index, 1);
      this.filesChange.emit(this.files); // Emit updated list
    }
  }

  // private generatePreviews() {
  //     this.imagePreviews = [];
  //     for (const file of this.files) {
  //         const reader = new FileReader();
  //         reader.onload = (e: any) => {
  //             this.imagePreviews.push(e.target.result);
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // }

  private generatePreviews() {
    // If not multiple, previews array should match files array (max 1)
    if (!this.multiple) {
      this.imagePreviews = []; // Clear first
      if (this.files.length > 0) {
        this.readAndAddPreview(this.files[0]);
      }
    } else {
      // For multiple, ensure previews match files
      this.imagePreviews = []; // Clear and rebuild
      this.files.forEach(file => this.readAndAddPreview(file));
    }
  }

  private readAndAddPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}
