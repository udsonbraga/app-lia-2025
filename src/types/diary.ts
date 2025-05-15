
export interface DiaryAttachment {
  name: string;
  url?: string;
}

export interface DiaryEntry {
  id: string;
  text: string;
  attachments: DiaryAttachment[];
  location: string;
  createdAt: Date;
}
