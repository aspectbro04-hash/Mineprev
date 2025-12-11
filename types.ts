
export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
}

export enum AnimationType {
  IDLE = 'idle',
  WALK = 'walk',
  RUN = 'run',
  FLY = 'fly'
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Only for verification mock
}

export interface Comment {
  id: string;
  galleryItemId: string;
  userId: string;
  username: string;
  text: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface UserSubmission {
  id: string;
  userId: string;
  username: string;
  title: string;
  imageUrl: string;
  stars: number; // 0 to 100
  date: string;
  status: 'pending' | 'rated';
}

export interface RewardRequest {
  id: string;
  userId: string;
  username: string;
  message: string;
  date: string;
  status: 'pending' | 'completed';
}

// Global definition for the external library loaded via script tag
declare global {
  interface Window {
    skinview3d: any;
  }
}
