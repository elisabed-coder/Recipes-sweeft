import { Component } from '@angular/core';
import { ImageService } from '../../../Services/image.service';
import { ImageSnippet } from '../../../Models/ImageSnipper';

@Component({
  selector: 'app-upload-images',
  imports: [],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.scss',
})
export class UploadImagesComponent {
  selectedFile!: ImageSnippet;

  constructor(private imageService: ImageService) {}

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }
}
