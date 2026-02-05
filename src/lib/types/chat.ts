export interface UserRefData {
  uid: string;
  display_name?: string;
  photo_url?: string;
  isTeacher?: boolean;
  isStudent?: boolean;
  [key: string]: any;
}

export type ConversationType = "paid" | "free";

export interface Conversation {
  id: string;
  users?: any[];
  userNames?: string[];
  last_message?: string;
  last_message_time?: any;
  is_expert_online?: boolean;
  is_student_online?: boolean;
  type: ConversationType;
  otherParticipant?: UserRefData;
  limborefData?: UserRefData;
  studentRefData?: UserRefData;
  [key: string]: any;
}

export interface Message {
  id: string;
  text?: string;
  timestamp?: any;
  senderName?: string;
  sharedImage?: string;
  from: {
    uid: string;
    display_name?: string;
    photo_url?: string;
  };
}
