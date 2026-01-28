import type { DocumentReference, Timestamp } from "firebase/firestore";

export interface CallRecord {
  id: string;
  app_id?: string;
  call_declined?: boolean;
  call_ended?: boolean;
  call_when?: Timestamp | { seconds?: number } | string;
  channelname?: string;
  isVideo?: boolean;
  limbo_ref?: DocumentReference;
  limbo_ref2?: DocumentReference;
  ringing?: boolean;
  student_joined?: boolean;
  teacher_joined?: boolean;
  token_id?: string;
  users?: DocumentReference[];
  videoRequst?: boolean;
  [key: string]: any;
}

export default CallRecord;
