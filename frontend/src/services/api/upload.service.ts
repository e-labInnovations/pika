// src/api/upload.service.ts
import api from './axios';

export type UploadType = 'avatar' | 'attachment';

export interface UploadResponse {
  id: string;
  url: string;
  type: UploadType;
  name: string;
  size: string;
}

class UploadService {
  /**
   * Upload an avatar image (person or account avatar)
   * @param file - Image file
   * @param entityType - Type of entity ('account', 'person', etc.)
   */
  uploadAvatar(file: File, entityType: 'account' | 'person' = 'account') {
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('file', file);

    return api.post<UploadResponse>('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Upload an attachment (e.g., transaction documents)
   * @param file - The file to upload (PDF, image, etc.)
   * @param entityType - The entity it belongs to ('transaction', etc.)
   * @param attachmentType - Document type like 'document', 'invoice', etc.
   */
  uploadAttachment(
    file: File,
    attachmentType: 'document' | 'image' = 'document',
    entityType: 'transaction' = 'transaction',
  ) {
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('attachmentType', attachmentType);
    formData.append('file', file);

    return api.post<UploadResponse>('/upload/attachment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const uploadService = new UploadService();
