# WeTeach Chat Feature - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Chat Types](#chat-types)
4. [Database Schema](#database-schema)
5. [Features](#features)
6. [Implementation Details](#implementation-details)
7. [Push Notifications](#push-notifications)
8. [Video & Voice Calls](#video--voice-calls)
9. [Security](#security)
10. [File Structure](#file-structure)
11. [Dependencies](#dependencies)
12. [Setup & Configuration](#setup--configuration)
13. [Usage Guide](#usage-guide)
14. [Troubleshooting](#troubleshooting)

---

## Overview

The WeTeach application features a comprehensive real-time chat system built with Flutter and Firebase. The chat system facilitates communication between students and experts/teachers through multiple chat types, supporting text messages, images, videos, voice/video calls, and real-time presence indicators.

### Key Capabilities
- **Real-time messaging** using Firebase Firestore
- **Two chat modes**: Free chat and Paid chat
- **Rich media support**: Text, images, and videos
- **Message actions**: Reply, edit, delete
- **Online presence tracking** for both users
- **Push notifications** for new messages
- **Video/voice calling** integration with Agora
- **Job creation** from free chat
- **Payment integration** via Stripe for paid chats
- **Message history** and persistence

---

## Architecture

### Technology Stack
- **Frontend**: Flutter (Dart)
- **Backend**: Firebase (Firestore, Cloud Functions, Firebase Storage)
- **Real-time Communication**: Firebase Firestore real-time listeners
- **Video/Voice**: Agora RTC Engine & RTM SDK
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **File Storage**: Firebase Storage
- **Payments**: Stripe

### High-Level Flow
```
User A (Student) ←→ Firebase Firestore ←→ User B (Expert/Teacher)
                         ↓
                  Cloud Functions
                         ↓
              Push Notifications (FCM)
                         ↓
                    Agora SDK
                    (Voice/Video)
```

---

## Chat Types

### 1. Free Chat (`free_chat_new`)
**Purpose**: Initial consultation and discussion between students and experts.

**Features**:
- Free text communication
- Image and video sharing
- Ability to start a paid job from chat
- Reply to messages
- Message editing
- Delete messages
- Online status indicators
- Last seen timestamps

**File Location**: `/lib/messaging/free_chat_new/`

**Widget**: `FreeChatNewWidget`

**Use Case**: Students can chat with experts for free to discuss their needs before committing to a paid session.

### 2. Paid Chat (`paidchat_new`)
**Purpose**: Paid sessions where students receive dedicated help from experts.

**Features**:
- All free chat features
- Job-linked conversations
- Payment validation
- Session completion tracking
- Review system integration
- Job amount tracking
- Stream chat capability

**File Location**: `/lib/messaging/paidchat_new/`

**Widget**: `PaidchatNewWidget`

**Parameters**:
- `userProfileName`: Name of the other user
- `chatRef`: Firebase reference to chat document
- `userProfil`: Profile image URL
- `jobref`: Reference to associated job (paid chat only)

---



   <div className="ml-4 flex-shrink-0">
                                <span className={`text-xl ${showUpArrow ? 'text-red-500' : 'text-green-500'}`} title={showUpArrow ? 'Error (up)' : 'Normal (down)'}>
                                  {showUpArrow ? '↗' : '↘'}
                                </span>
                              </div>

## Database Schema

### Chats Collection (`chats`)

**Document Structure**:
```dart
{
  // User Information
  "users": List<DocumentReference>,           // [student_ref, teacher_ref]
  "userNames": List<String>,                  // [student_name, teacher_name]
  "student_ref": DocumentReference,
  "teacher_ref": DocumentReference,
  "limboref": DocumentReference,              // Primary user limbo reference
  "limboref2": DocumentReference,             // Secondary user limbo reference
  
  // Message Tracking
  "last_message": String,
  "last_message_time": DateTime,
  "last_message_sent_by": DocumentReference,
  "last_message_seen_by": List<DocumentReference>,
  "modified_time": DateTime,
  "seen": bool,
  
  // Chat Type & Status
  "home_chat": bool,                          // Is this a home/free chat
  "paid_chat": bool,                          // Is this a paid chat
  "stream_chat": bool,                        // Supports streaming
  "chat_name": String,
  "completed": bool,                          // Chat session completed
  "Reviewed": bool,                           // Chat has been reviewed
  "chat_paid_for": bool,                      // Payment confirmed
  
  // Job & Payment References
  "job_ref": DocumentReference,               // Associated job
  "jobRefered": DocumentReference,            // Job reference tracking
  "Free_chat_job_creation": bool,             // Job created from free chat
  "teacherStripeID": String,                  // Teacher's Stripe account
  "studentStripeID": String,                  // Student's Stripe account
  
  // Call Integration
  "callRef": DocumentReference,               // Reference to video call
  
  // Reply Message Feature
  "reply_message_set": bool,
  "Student_Reply_true": bool,
  "Expert_reply_true": bool,
  
  // Online Status Tracking
  "expert_last_seen": DateTime,
  "student_last_seen": DateTime,
  "is_expert_online": bool,
  "is_student_online": bool,
  
  // Legacy Fields
  "user_a": DocumentReference,
  "user_b": DocumentReference
}
```

**Subcollection**: `chat_messages`

### Chat Messages Subcollection (`chats/{chatId}/chat_messages`)

**Document Structure**:
```dart
{
  // Timestamps
  "created_at": DateTime,
  "modified_at": DateTime,
  
  // Message Content
  "message_text": String,
  "shared_image": String,                     // Firebase Storage URL
  "shared_video": String,                     // Firebase Storage URL
  
  // Sender Information
  "sent_by": DocumentReference,
  "nameofsender": String,
  
  // Message Type
  "home_messages": bool,                      // Free chat message
  "paid_messages": bool,                      // Paid chat message
  
  // Reply Feature
  "reply_message_reference": DocumentReference // Reference to replied message
}
```

### Related Collections

#### Stream Chat Record (`stream_chat`)
Used for video streaming sessions.

#### Steam Chat Page Record (`steam_chat_page`)
UI representation of streaming chat pages.

---

## Features

### 1. Real-Time Messaging

**Implementation**: Firebase Firestore real-time listeners using `StreamBuilder`.

**Code Example**:
```dart
StreamBuilder<ChatsRecord>(
  stream: ChatsRecord.getDocument(widget.chatRef!),
  builder: (context, snapshot) {
    final chatRecord = snapshot.data!;
    // Build UI
  }
)
```

### 2. Online Presence Tracking

**Mechanism**: Updates user online status on:
- Page initialization
- Page disposal
- App lifecycle changes (foreground/background)

**Implementation**: 
- Custom action `chatStatusHandler` monitors app lifecycle
- Updates `is_expert_online`/`is_student_online` fields
- Tracks `expert_last_seen`/`student_last_seen` timestamps

**Code Flow**:
```dart
// On page load
SchedulerBinding.instance.addPostFrameCallback((_) async {
  FFAppState().IsChatScreen = true;
  
  if (isTeacher) {
    await chatRef.update({
      'expert_last_seen': getCurrentTimestamp,
      'is_expert_online': true,
    });
  } else {
    await chatRef.update({
      'student_last_seen': getCurrentTimestamp,
      'is_student_online': true,
    });
  }
  
  await actions.chatStatusHandler(context, chatRef);
});
```

### 3. Message Reply Feature

**Functionality**: Users can reply to specific messages, creating a conversation thread.

**UI Components**:
- Reply preview bubble showing original message
- Cancel reply button
- Visual indication of replied-to message

**State Management**:
- `messageToEdit`: Stores reference to message being replied to
- `replyMessageSet`: Boolean flag in chat document
- `reply_message_reference`: Link to original message in message document

### 4. Media Sharing

#### Image Sharing
- **Upload**: Uses Firebase Storage
- **Display**: `CachedNetworkImage` for efficient loading
- **Preview**: Full-screen image viewer (`image_preview` component)

#### Video Sharing
- **Upload**: Firebase Storage with size validation
- **Playback**: `Chewie` video player
- **Thumbnail**: Generated and cached

**Upload Flow**:
```dart
final selectedMedia = await selectMediaWithSourceBottomSheet(
  context: context,
  allowPhoto: true,
  allowVideo: true,
);

if (selectedMedia != null) {
  final downloadUrls = await Future.wait(
    selectedMedia.map(
      (m) async => await uploadData(m.storagePath, m.bytes),
    ),
  );
  
  // Create message with media URL
}
```

### 5. Message Actions

#### Edit Message
- Available for own messages
- Updates `modified_at` timestamp
- Shows "edited" indicator

#### Delete Message
- Soft delete or hard delete options
- Confirms with user before deletion
- Updates last message if deleted message was most recent

#### Long Press Menu
- Shows contextual menu with available actions
- Different options for free chat vs paid chat
- Components: `message_menu_freechat`, `message_menu_paidchat`

### 6. Job Creation from Free Chat

**Flow**:
1. Expert offers to start a paid job during free chat
2. Expert specifies job details and pricing
3. System creates job document linked to chat
4. Student receives notification
5. Student accepts and makes payment
6. Chat converts to paid chat mode

**Component**: `StartJobFromFreeChatWidget`

### 7. Chat Upload Feature

**Purpose**: Send files and media to chat.

**Location**: `/lib/messaging/chatupload_new/`

**Supported Types**:
- Images (JPEG, PNG, GIF)
- Videos (MP4, MOV)
- Documents (PDF) - if implemented

### 8. Delete Chat

**Component**: `DeleteChatNNewWidget`

**Functionality**:
- Deletes entire chat document
- Option to delete all messages
- Confirmation dialog
- Updates user's chat list

---

## Push Notifications

### Configuration

**Files**:
- `/lib/backend/push_notifications/push_notifications_handler.dart`
- `/lib/backend/push_notifications/push_notifications_util.dart`

### Notification Types

1. **New Message Notification**
   - Triggered when message is sent
   - Contains message preview
   - Deep links to chat screen

2. **Job Offer Notification**
   - Sent when expert creates job from free chat
   - Links to job acceptance screen

3. **Call Notification**
   - Incoming call alerts
   - Handled by `IncomingCallBoxWidget`

### FCM Token Management

**Process**:
1. Request notification permissions
2. Generate FCM token
3. Store in Firestore user document
4. Update on token refresh
5. Cloud function handles delivery

**Code**:
```dart
void triggerPushNotification({
  required String? notificationTitle,
  required String? notificationText,
  String? notificationImageUrl,
  required List<DocumentReference> userRefs,
  required String initialPageName,
  Map<String, String>? parameterData,
}) {
  makeCloudCall('sendPushNotification', {
    'title': notificationTitle,
    'body': notificationText,
    'imageUrl': notificationImageUrl,
    'userRefs': userRefs.map((ref) => ref.path).toList(),
    'initialPageName': initialPageName,
    'parameterData': parameterData,
  });
}
```

---

## Video & Voice Calls

### Agora Integration

**SDK Packages**:
- `agora_rtc_engine`: Real-time video/audio
- `agora_uikit`: Pre-built UI components
- `Agora-Flutter-RTM-SDK`: Real-time messaging

**Location**: `/packages/`

### Call Flow

1. **Initiate Call**
   - User taps call button in chat
   - Creates call document in Firestore
   - Generates Agora channel name

2. **Receive Call**
   - Push notification sent to recipient
   - `IncomingCallBoxWidget` shows call UI
   - Accept/Decline options

3. **During Call**
   - `CallScreenWidget` or `VideoCallPageWidget`
   - Mute/unmute controls
   - Camera toggle
   - End call button

4. **End Call**
   - Updates call duration
   - Saves to call logs
   - Returns to chat

### Components

- **`incoming_call_box`**: Incoming call notification UI
- **`call_screen`**: Main call interface
- **`video_call_page`**: Video call screen
- **`calls_beta_page`**: Call management page
- **`call_logs_screen`**: Call history

### Agora Configuration

**App ID**: Stored in environment variables (`environment_values.dart`)

**Channel Management**:
```dart
class AgoraManager {
  late RtcEngine agoraEngine;
  
  Future<void> initAgora() async {
    agoraEngine = createAgoraRtcEngine();
    await agoraEngine.initialize(RtcEngineContext(
      appId: agoraAppId,
    ));
  }
  
  Future<void> joinChannel(String channelName, String token) async {
    await agoraEngine.joinChannel(
      token: token,
      channelId: channelName,
      uid: 0,
      options: ChannelMediaOptions(),
    );
  }
}
```

---

## Security

### Firestore Security Rules

**Location**: `/firebase/firestore.rules`

**Chat Rules**:
```javascript
match /chats/{document} {
  allow create: if true;
  allow read: if true;
  allow write: if true;
  allow delete: if true;
}
```

**Note**: Current rules are permissive for development. **Production rules should be**:

```javascript
match /chats/{chatId} {
  // Only chat participants can read
  allow read: if request.auth != null && 
    request.auth.uid in resource.data.users;
  
  // Only chat participants can write
  allow write: if request.auth != null && 
    request.auth.uid in resource.data.users;
  
  // Message subcollection
  match /chat_messages/{messageId} {
    allow read: if request.auth != null;
    allow create: if request.auth != null;
    allow update: if request.auth != null && 
      request.auth.uid == resource.data.sent_by;
    allow delete: if request.auth != null && 
      request.auth.uid == resource.data.sent_by;
  }
}
```

### Authentication

**Provider**: Firebase Authentication

**Supported Methods**:
- Email/Password
- Google Sign-In (`google_sign_in_android`)
- Apple Sign-In (`sign_in_with_apple`)

**Auth State Management**:
```dart
// Current user reference
currentUserReference

// Check if user is teacher
currentUserDocument?.isTeacher

// User display name
currentUserDisplayName

// User photo
currentUserPhoto
```

### Data Validation

**Client-Side**:
- Message length limits
- File size restrictions
- Media type validation

**Server-Side** (Cloud Functions):
- Input sanitization
- Rate limiting
- Abuse detection

---

## File Structure

```
lib/
├── messaging/
│   ├── free_chat_new/
│   │   ├── free_chat_new_widget.dart          # Free chat UI
│   │   └── free_chat_new_model.dart           # Free chat state
│   │
│   ├── paidchat_new/
│   │   ├── paidchat_new_widget.dart           # Paid chat UI
│   │   └── paidchat_new_model.dart            # Paid chat state
│   │
│   ├── chatupload_new/                         # Media upload component
│   ├── delete_chat_n_new/                      # Delete chat dialog
│   ├── delete_message_new/                     # Delete message dialog
│   ├── image_preview/                          # Full-screen image viewer
│   ├── messages_new/                           # Message list component
│   ├── message_menu_freechat/                  # Free chat message menu
│   ├── message_menu_paidchat/                  # Paid chat message menu
│   └── startpaidchat/                          # Start paid chat dialog
│
├── video_calls/
│   ├── call_screen/                            # Main call interface
│   ├── callpage/                               # Call page wrapper
│   ├── video_call_page/                        # Video call UI
│   ├── incoming_call_box/                      # Incoming call notification
│   ├── calls_beta_page/                        # Call management
│   ├── call_logs_screen/                       # Call history
│   └── startpaidstream/                        # Start paid stream
│
├── backend/
│   ├── schema/
│   │   ├── chats_record.dart                   # Chat document schema
│   │   ├── chat_messages_record.dart           # Message document schema
│   │   ├── stream_chat_record.dart             # Stream chat schema
│   │   └── steam_chat_page_record.dart         # Steam chat page schema
│   │
│   ├── push_notifications/
│   │   ├── push_notifications_handler.dart     # FCM handler
│   │   └── push_notifications_util.dart        # Notification utilities
│   │
│   └── firebase_storage/
│       └── storage.dart                         # Firebase Storage operations
│
├── custom_code/
│   └── actions/
│       ├── chat_status_handler.dart             # Online status tracking
│       └── index.dart                           # Custom actions export
│
└── expert/
    ├── start_job_from_free_chat/                # Job creation from chat
    └── expert_start_paid_chat/                  # Expert start paid chat
```

---

## Dependencies

### Core Dependencies (from `pubspec.yaml`)

```yaml
# Firebase
cloud_firestore: 5.6.9                   # Real-time database
firebase_auth: 5.6.0                     # Authentication
firebase_storage: 12.4.7                 # File storage
firebase_messaging: 15.2.7               # Push notifications
firebase_core: 3.14.0                    # Firebase core

# Agora (Video/Audio)
agora_rtc_engine: (local package)        # Real-time communication
agora_uikit: (local package)             # UI components

# UI Components
auto_size_text: 3.0.0                    # Responsive text
cached_network_image: 3.4.1              # Image caching
chewie: 1.11.3                           # Video player
font_awesome_flutter: 10.7.0             # Icons

# Media Handling
file_picker: 10.1.9                      # File selection
image_picker: (via dependencies)         # Image/video picker

# Utilities
easy_debounce: 2.0.1                     # Input debouncing
provider: (Flutter default)              # State management
```

### Custom Packages

Located in `/packages/`:
- `Agora-Flutter-RTM-SDK-1.5.9-NewUI/`: Real-time messaging SDK
- `Agora-Flutter-SDK-main/`: Main Agora SDK
- `VideoUIKit-Flutter-main/`: Agora video UI kit

---

## Setup & Configuration

### 1. Firebase Setup

#### Initialize Firebase Project
```bash
firebase login
firebase init firestore
firebase init storage
firebase init functions
```

#### Configure Firebase in Flutter
**File**: `lib/firebase_options.dart` (auto-generated)

```dart
// Already configured via FlutterFlow
static const FirebaseOptions android = FirebaseOptions(
  apiKey: 'YOUR_API_KEY',
  appId: 'YOUR_APP_ID',
  messagingSenderId: 'YOUR_SENDER_ID',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
);
```

### 2. Agora Setup

#### Get Agora App ID
1. Sign up at [Agora.io](https://www.agora.io/)
2. Create a project
3. Get App ID from dashboard
4. Enable RTM (Real-Time Messaging)

#### Configure in App
**File**: `lib/environment_values.dart`

```dart
const String agoraAppId = 'YOUR_AGORA_APP_ID';
```

### 3. Stripe Setup (for Paid Chats)

#### Get Stripe Keys
1. Sign up at [Stripe](https://stripe.com/)
2. Get publishable and secret keys
3. Configure webhook endpoints

#### Configure in App
```dart
// In environment_values.dart
const String stripePublishableKey = 'pk_test_...';
const String stripeSecretKey = 'sk_test_...'; // Use Cloud Functions
```

### 4. Push Notification Setup

#### Android Configuration
**File**: `android/app/google-services.json`
- Download from Firebase Console
- Place in `android/app/`

#### iOS Configuration
**File**: `ios/Runner/GoogleService-Info.plist`
- Download from Firebase Console
- Place in `ios/Runner/`

#### Enable Cloud Messaging
```bash
firebase functions:config:set fcm.serverkey="YOUR_SERVER_KEY"
```

### 5. Storage Rules

**File**: `firebase/storage.rules`

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat_images/{allPaths=**} {
      allow read;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    match /chat_videos/{allPaths=**} {
      allow read;
      allow write: if request.auth != null
        && request.resource.size < 50 * 1024 * 1024; // 50MB limit
    }
  }
}
```

Deploy:
```bash
firebase deploy --only storage
```

### 6. Cloud Functions

**Location**: `firebase/functions/`

Deploy:
```bash
cd firebase/functions
npm install
firebase deploy --only functions
```

### 7. Build and Run

```bash
# Get dependencies
flutter pub get

# Run on device
flutter run

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

---

## Usage Guide

### For Developers

#### Creating a New Chat

```dart
// Create chat document
final chatRef = await ChatsRecord.collection.add(
  createChatsRecordData(
    studentRef: studentDocRef,
    teacherRef: teacherDocRef,
    chatName: 'Chat with ${teacherName}',
    homeChat: true,  // or false for paid chat
    paidChat: false, // or true for paid chat
    created_time: getCurrentTimestamp,
  ),
);

// Navigate to chat
context.pushNamed(
  'FreeChatNew',
  queryParameters: {
    'userProfileName': teacherName,
    'chatRef': chatRef.id,
    'userProfil': teacherPhotoUrl,
  },
);
```

#### Sending a Message

```dart
await ChatMessagesRecord.createDoc(chatRef).set(
  createChatMessagesRecordData(
    messageText: messageText,
    sentBy: currentUserReference,
    nameofsender: currentUserDisplayName,
    createdAt: getCurrentTimestamp,
    homeMessages: isHomeChat,
    paidMessages: isPaidChat,
  ),
);

// Update last message in chat
await chatRef.update(
  createChatsRecordData(
    lastMessage: messageText,
    lastMessageTime: getCurrentTimestamp,
    lastMessageSentBy: currentUserReference,
  ),
);

// Send push notification
triggerPushNotification(
  notificationTitle: currentUserDisplayName,
  notificationText: messageText,
  userRefs: [otherUserRef],
  initialPageName: 'FreeChatNew',
  parameterData: {'chatRef': chatRef.id},
);
```

#### Uploading Media

```dart
// Pick image/video
final selectedMedia = await selectMediaWithSourceBottomSheet(
  context: context,
  allowPhoto: true,
  allowVideo: true,
);

if (selectedMedia != null && selectedMedia.isNotEmpty) {
  // Upload to Firebase Storage
  final downloadUrl = await uploadData(
    selectedMedia.first.storagePath,
    selectedMedia.first.bytes,
  );
  
  // Create message with media
  await ChatMessagesRecord.createDoc(chatRef).set(
    createChatMessagesRecordData(
      sharedImage: downloadUrl,  // or sharedVideo
      sentBy: currentUserReference,
      createdAt: getCurrentTimestamp,
    ),
  );
}
```

### For Users

#### Starting a Free Chat
1. Browse expert profiles
2. Tap "Message" or "Chat" button
3. Type message and send
4. Chat appears in "Messages" tab

#### Converting to Paid Chat
1. In free chat, expert taps "Start Job"
2. Expert sets job details and price
3. Student receives notification
4. Student reviews and accepts job
5. Student makes payment via Stripe
6. Chat converts to paid mode

#### Making a Video Call
1. Open any chat (free or paid)
2. Tap phone icon for voice call
3. Tap video icon for video call
4. Wait for other user to accept
5. Call connects via Agora

#### Replying to a Message
1. Long-press on message
2. Select "Reply" from menu
3. Type your reply
4. Original message shows above input
5. Send reply

#### Deleting a Message
1. Long-press on your message
2. Select "Delete" from menu
3. Confirm deletion
4. Message removed from chat

---

## Troubleshooting

### Common Issues

#### 1. Messages Not Appearing in Real-Time

**Symptoms**: Messages sent but not showing immediately

**Solutions**:
- Check Firestore rules allow read access
- Verify StreamBuilder is properly configured
- Check internet connection
- Ensure chat reference is correct

```dart
// Verify chat reference
print('Chat Ref: ${widget.chatRef.path}');

// Check Firestore connection
FirebaseFirestore.instance.settings = Settings(
  persistenceEnabled: true,
);
```

#### 2. Push Notifications Not Working

**Symptoms**: No notifications received

**Solutions**:
- Verify FCM token is saved: `FirebaseMessaging.instance.getToken()`
- Check notification permissions: iOS needs explicit permission
- Verify `google-services.json` / `GoogleService-Info.plist` are present
- Test with Firebase Console test message
- Check Cloud Function logs for errors

```dart
// Request permissions (iOS)
await FirebaseMessaging.instance.requestPermission(
  alert: true,
  badge: true,
  sound: true,
);

// Get token
String? token = await FirebaseMessaging.instance.getToken();
print('FCM Token: $token');
```

#### 3. Images/Videos Not Uploading

**Symptoms**: Upload fails or hangs

**Solutions**:
- Check file size limits (5MB images, 50MB videos)
- Verify Firebase Storage rules
- Ensure proper permissions in AndroidManifest.xml / Info.plist
- Check internet connectivity

```dart
// Log upload progress
final ref = FirebaseStorage.instance.ref().child(path);
UploadTask uploadTask = ref.putFile(file);

uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
  print('Progress: ${snapshot.bytesTransferred}/${snapshot.totalBytes}');
});
```

#### 4. Video Call Not Connecting

**Symptoms**: Call initiated but doesn't connect

**Solutions**:
- Verify Agora App ID is correct
- Check token generation (if using token authentication)
- Ensure camera/microphone permissions granted
- Check network firewall settings
- Verify Agora SDK initialization

```dart
// Initialize Agora properly
await agoraEngine.initialize(RtcEngineContext(
  appId: agoraAppId,
));

await agoraEngine.enableVideo();
await agoraEngine.enableAudio();
```

#### 5. Online Status Not Updating

**Symptoms**: User shows offline when online

**Solutions**:
- Verify `chatStatusHandler` is called
- Check `FFAppState().IsChatScreen` is set correctly
- Ensure app lifecycle observer is registered
- Verify Firestore write permissions

```dart
// Debug online status
print('Is Chat Screen: ${FFAppState().IsChatScreen}');
print('Is Expert Online: ${chatRecord.isExpertOnline}');
print('Expert Last Seen: ${chatRecord.expertLastSeen}');
```

#### 6. Reply Feature Not Working

**Symptoms**: Can't reply to messages

**Solutions**:
- Check `replyMessageReference` field exists in Firestore
- Verify reply UI state management
- Ensure message document reference is valid

```dart
// Debug reply reference
print('Reply to: ${_model.messageToEdit?.path}');
print('Reply set: ${chatRecord.replyMessageSet}');
```

### Debug Mode

Enable debug logging:

```dart
// In main.dart
void main() {
  debugPrint('App started in debug mode');
  
  // Enable Firestore logging
  FirebaseFirestore.instance.setLoggingEnabled(true);
  
  runApp(MyApp());
}
```

### Performance Optimization

#### 1. Limit Message Query
```dart
// Only load recent messages
QueryBuilder<ChatMessagesRecord>(
  query: ChatMessagesRecord.collection(chatRef)
    .orderBy('created_at', descending: true)
    .limit(50),  // Limit to 50 messages
)
```

#### 2. Use Pagination
```dart
// Load more messages on scroll
DocumentSnapshot? lastDocument;

Future<void> loadMoreMessages() async {
  Query query = ChatMessagesRecord.collection(chatRef)
    .orderBy('created_at', descending: true)
    .limit(20);
  
  if (lastDocument != null) {
    query = query.startAfterDocument(lastDocument);
  }
  
  final snapshot = await query.get();
  lastDocument = snapshot.docs.last;
}
```

#### 3. Cache Images
```dart
// Already using cached_network_image
CachedNetworkImage(
  imageUrl: imageUrl,
  cacheManager: CacheManager(
    Config(
      'chatImageCache',
      stalePeriod: Duration(days: 7),
      maxNrOfCacheObjects: 100,
    ),
  ),
)
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `permission-denied` | Firestore rules reject operation | Check security rules |
| `unauthenticated` | User not logged in | Re-authenticate user |
| `unavailable` | Firestore temporarily unavailable | Retry with exponential backoff |
| `cancelled` | Operation cancelled by user | Handle gracefully |
| `storage/unauthorized` | Storage rules reject upload | Check storage rules |
| `agora/invalid-app-id` | Wrong Agora App ID | Verify App ID in config |

---

## Best Practices

### Code

1. **Always dispose controllers**
```dart
@override
void dispose() {
  _model.dispose();
  super.dispose();
}
```

2. **Use null-safety**
```dart
final message = chatRecord.lastMessage ?? 'No messages yet';
```

3. **Handle async operations**
```dart
try {
  await sendMessage();
} catch (e) {
  showSnackbar(context, 'Failed to send message: $e');
}
```

### UI/UX

1. **Show loading states**
2. **Provide error messages**
3. **Confirm destructive actions** (delete, leave chat)
4. **Use optimistic UI updates** where appropriate
5. **Implement retry mechanisms**

### Security

1. **Validate all inputs**
2. **Sanitize user content**
3. **Use Cloud Functions for sensitive operations**
4. **Never expose API keys in client code**
5. **Implement rate limiting**
6. **Use Firestore security rules**

### Performance

1. **Implement pagination for large message lists**
2. **Use indexes for complex queries**
3. **Cache images and media**
4. **Minimize Firestore reads**
5. **Debounce user inputs**

---

## Future Enhancements

### Planned Features

1. **Message Search**: Full-text search within chats
2. **Voice Messages**: Record and send audio messages
3. **Message Reactions**: React to messages with emojis
4. **Chat Folders**: Organize chats into categories
5. **Scheduled Messages**: Send messages at specific times
6. **Chat Export**: Export chat history as PDF/TXT
7. **End-to-End Encryption**: Secure private conversations
8. **Typing Indicators**: Show when other user is typing
9. **Read Receipts**: Enhanced read/unread tracking
10. **Group Chats**: Support for multiple participants
11. **Message Forwarding**: Forward messages to other chats
12. **Chat Themes**: Customizable chat appearance
13. **Auto-Translation**: Translate messages in real-time
14. **Rich Text Formatting**: Bold, italic, code blocks
15. **Message Pinning**: Pin important messages

---

## Support & Resources

### Documentation
- [FlutterFlow Documentation](https://docs.flutterflow.io/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Agora Documentation](https://docs.agora.io/)
- [Flutter Documentation](https://flutter.dev/docs)

### Community
- Firebase Support: [Firebase Support](https://firebase.google.com/support)
- Agora Forum: [Agora Community](https://www.agora.io/en/community/)
- Flutter Community: [Flutter Community](https://flutter.dev/community)

### Contact
For project-specific questions:
- Check existing issues in project repository
- Contact development team

---

## License

This chat feature is part of the WeTeach application. All rights reserved.

---

## Changelog

### Version 2.2.2 (Current)
- Enhanced online presence tracking
- Improved push notification delivery
- Added message reply feature
- Video call integration
- Bug fixes and performance improvements

### Version 2.1.0
- Paid chat support
- Job creation from free chat
- Stripe payment integration
- Message editing and deletion

### Version 2.0.0
- Complete chat system rewrite
- Firebase Firestore integration
- Real-time messaging
- Media sharing (images/videos)
- Push notifications

### Version 1.0.0
- Initial chat implementation
- Basic text messaging
- User authentication

---

**Last Updated**: January 22, 2026  
**Document Version**: 1.0  
**Maintained By**: WeTeach Development Team
