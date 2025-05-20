
export interface DiaryAttachment {
  name: string;
  url?: string;
}

export interface DiaryEntry {
  id: string;
  text: string;
  title?: string;
  date: Date;
  mood?: string;
  attachments: DiaryAttachment[];
  location: string | null;
  createdAt: Date;
  tags: string[];
}
