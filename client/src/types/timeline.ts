export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  productive?: boolean;
  defaultUrgent?: boolean;
  defaultImportant?: boolean;
}

export interface TimeBlock {
  id: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  activityName: string;
  categoryId: string;
  isUrgent: boolean;
  isImportant: boolean;
}
