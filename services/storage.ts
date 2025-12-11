
import { GalleryItem, User, Comment, ChatMessage, UserSubmission, RewardRequest } from '../types';

const STORAGE_KEY = 'mineprev_gallery_data_v2'; 
const STORAGE_KEY_USERS = 'mineprev_users';
const STORAGE_KEY_COMMENTS = 'mineprev_comments';
const STORAGE_KEY_CHAT = 'mineprev_chat_messages';
const STORAGE_KEY_SUBMISSIONS = 'mineprev_user_submissions';
const STORAGE_KEY_REWARDS = 'mineprev_reward_requests';
const STORAGE_KEY_PRIVATE_MESSAGES = 'mineprev_private_messages';

// Empty initial data to start fresh
const INITIAL_DATA: GalleryItem[] = [];

// --- UTILS ---

// Helper to save safely to localStorage and handle quota errors
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      alert("DIQQAT: Brauzer xotirasi to'lib qoldi! Yangi ma'lumot saqlanmadi. Iltimos, eski rasmlarni galereyadan o'chiring.");
    } else {
      console.error("Storage error:", e);
    }
    return false;
  }
};

// Image Compression Utility
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG/WebP
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (error) => reject(error);
  });
};

// --- GALLERY ---

export const getGalleryItems = (): GalleryItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveToStorage(STORAGE_KEY, INITIAL_DATA);
    return INITIAL_DATA;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing gallery data", e);
    return [];
  }
};

export const addGalleryItem = (item: GalleryItem): void => {
  const items = getGalleryItems();
  const newItems = [item, ...items];
  saveToStorage(STORAGE_KEY, newItems);
};

export const deleteGalleryItem = (id: string): void => {
  const items = getGalleryItems();
  const newItems = items.filter(item => item.id !== id);
  saveToStorage(STORAGE_KEY, newItems);
};

// --- USERS ---

export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (user: User): User | null => {
  const users = getUsers();
  // Check if email already exists
  if (users.find(u => u.email === user.email)) {
    return null; 
  }
  users.push(user);
  
  const success = saveToStorage(STORAGE_KEY_USERS, users);
  return success ? user : null;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// --- COMMENTS ---

export const getComments = (galleryId: string): Comment[] => {
  const data = localStorage.getItem(STORAGE_KEY_COMMENTS);
  const comments: Comment[] = data ? JSON.parse(data) : [];
  return comments
    .filter(c => c.galleryItemId === galleryId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addComment = (comment: Comment): void => {
  const data = localStorage.getItem(STORAGE_KEY_COMMENTS);
  const comments: Comment[] = data ? JSON.parse(data) : [];
  comments.push(comment);
  saveToStorage(STORAGE_KEY_COMMENTS, comments);
};

// --- GLOBAL CHAT ---

export const getChatMessages = (): ChatMessage[] => {
  const data = localStorage.getItem(STORAGE_KEY_CHAT);
  return data ? JSON.parse(data) : [];
};

export const addChatMessage = (message: ChatMessage): void => {
  const messages = getChatMessages();
  // Keep only last 50 messages to save space
  const newMessages = [...messages, message].slice(-50);
  saveToStorage(STORAGE_KEY_CHAT, newMessages);
};

// --- PRIVATE CHAT (LICHKA) ---

const getAllPrivateMessages = (): Record<string, ChatMessage[]> => {
  const data = localStorage.getItem(STORAGE_KEY_PRIVATE_MESSAGES);
  return data ? JSON.parse(data) : {};
};

export const getPrivateMessages = (userId: string): ChatMessage[] => {
  const allData = getAllPrivateMessages();
  return allData[userId] || [];
};

export const sendPrivateMessage = (conversationId: string, message: ChatMessage): void => {
  const allData = getAllPrivateMessages();
  if (!allData[conversationId]) {
    allData[conversationId] = [];
  }
  allData[conversationId].push(message);
  
  // Limit per conversation to save space
  if (allData[conversationId].length > 50) {
    allData[conversationId] = allData[conversationId].slice(-50);
  }
  
  saveToStorage(STORAGE_KEY_PRIVATE_MESSAGES, allData);
};

export const getActiveConversations = (): {userId: string, username: string, lastMessage: string}[] => {
  const allData = getAllPrivateMessages();
  const users = getUsers();
  
  return Object.keys(allData).map(userId => {
    const userMessages = allData[userId];
    const lastMsg = userMessages[userMessages.length - 1];
    const userObj = users.find(u => u.id === userId);
    const username = userObj ? userObj.username : 'Noma\'lum';
    
    return {
      userId,
      username,
      lastMessage: lastMsg ? lastMsg.text : ''
    };
  });
};


// --- CONTEST / USER SUBMISSIONS ---

export const getUserSubmissions = (): UserSubmission[] => {
  const data = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
  return data ? JSON.parse(data) : [];
};

export const addUserSubmission = (submission: UserSubmission): void => {
  const items = getUserSubmissions();
  const newItems = [submission, ...items];
  saveToStorage(STORAGE_KEY_SUBMISSIONS, newItems);
};

export const updateUserSubmissionStars = (id: string, stars: number): void => {
  const items = getUserSubmissions();
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index].stars = stars;
    items[index].status = 'rated';
    saveToStorage(STORAGE_KEY_SUBMISSIONS, items);
  }
};

export const deleteUserSubmission = (id: string): void => {
  const items = getUserSubmissions();
  const newItems = items.filter(i => i.id !== id);
  saveToStorage(STORAGE_KEY_SUBMISSIONS, newItems);
};

export const getUserTotalStars = (userId: string): number => {
  const items = getUserSubmissions();
  return items
    .filter(i => i.userId === userId)
    .reduce((acc, curr) => acc + (curr.stars || 0), 0);
};

// --- REWARDS ---

export const getRewardRequests = (): RewardRequest[] => {
  const data = localStorage.getItem(STORAGE_KEY_REWARDS);
  return data ? JSON.parse(data) : [];
};

export const addRewardRequest = (request: RewardRequest): void => {
  const items = getRewardRequests();
  const newItems = [request, ...items];
  saveToStorage(STORAGE_KEY_REWARDS, newItems);
};

export const completeRewardRequest = (id: string): void => {
  const items = getRewardRequests();
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index].status = 'completed';
    saveToStorage(STORAGE_KEY_REWARDS, items);
  }
};
