# WeTeachs Hire to Complete Job Flow

This document describes the end-to-end production flow from hiring an expert to final job completion and payout.

## 1. Flow Goals

1. Student must pay before a paid chat can be used.
2. Payment is collected by the WeTeachs business Stripe account first.
3. Payment is held by the platform after checkout.
4. Student review releases payout to the expert.
5. Expert can mark job complete only after payout is released.
6. No auto-complete without explicit actions.
7. Refund/payment problems are handled via support report tickets.

## 2. Actors

1. Student
2. Expert (Teacher)
3. WeTeachs Platform (Business account)
4. Support/Admin team

## 3. High-Level Lifecycle

1. Student hires expert.
2. Expert accepts request.
3. System creates paid chat record with chat locked.
4. Student pays via Stripe Checkout.
5. Chat unlocks after payment is confirmed.
6. Student and expert discuss and do the work.
7. Student submits review and marks student-side completion.
8. Platform transfers payout to expert Stripe connected account.
9. Expert marks final completion.

## 4. Current Enforced Business Rules

1. Paid chat is locked when chat_paid_for = false.
2. Student can see and click Pay to Chat.
3. Expert cannot unlock chat and cannot pay on student behalf.
4. Student can submit review only after payment.
5. Expert completion requires payout already released.
6. Student review triggers payout transfer.
7. Refund/payment disputes go through support ticket/report flow.

## 5. Detailed Step-by-Step Flow

### Step A: Student hires expert

1. Student creates/starts hire flow from job preview.
2. Expert accepts the request.
3. Chat document is created in chats collection with paid_chat = true and chat_paid_for = false.
4. This means the chat is created but remains locked for messaging.

Expected chat fields at this point:

1. paid_chat: true
2. chat_paid_for: false
3. completed: false
4. Reviewed: false
5. student_ref, teacher_ref, job_ref set

### Step B: Chat lock state

When a paid chat is selected:

1. If chat_paid_for is false, the UI blocks:
   - text input
   - media upload
   - message send
2. Student sees Pay to Chat button.
3. Student and expert both see Report Payment/Refund Issue support entry point.

### Step C: Student clicks Pay to Chat

1. System reads chat and job amount.
2. System creates or reuses a transactions record linked to chat.
3. System creates Stripe Checkout session via /api/stripe/sessions.
4. Important: Session is created without forcing transfer_data destination.
5. Result: funds are captured by WeTeachs business Stripe account (platform-held).
6. Student is redirected to Stripe checkout URL.

### Step D: Payment success

1. On successful payment confirmation, chat_paid_for should be true.
2. Chat unlocks and both sides can message normally.
3. Work conversation proceeds.

Note:

1. Use Stripe webhook confirmation as source of truth for paid status in production.
2. Do not rely only on redirect success URL for payment trust.

### Step E: Student work completion + review (releases payout)

1. Student opens review dialog.
2. Student provides:
   - star rating
   - review text
   - category
3. System stores review in Reviews collection.
4. Chat updates:
   - Reviewed: true
   - student_completed: true
   - review_text, review_rating, review_category, reviewed_time
5. Payout is released to the expert when the review is submitted.

### Step F: Expert final completion (after payout)

1. Expert clicks Job Completed.
2. System validates:
   - chat exists
   - chat_paid_for = true
   - payout already released to expert
3. System updates:
   - chats.completed: true
   - chats.expert_completed: true

## 6. Support, Refund, and Issue Handling

### Required behavior

1. If student pays and disappears, do not auto-complete.
2. If student pays and disappears, do not auto-release.
3. Expert must submit support request to complete/release review manually.
4. If expert delays response, student can open refund/cancel support request.
5. If chat cannot start after payment (technical misunderstanding issue), student can open support request.
6. Abuse/fraud signals should be reported and reviewed manually.

### Support ticket/report data schema

Collection: reports

1. message_ref (string)
2. open (boolean)
3. report_message (string)
4. reporte_image (string)
5. reporter_uploaded_ss (string)
6. time_when_reported (timestamp)
7. who_received_report (reference: LimboUserMode/{uid})
8. who_sent_report (reference: LimboUserMode/{uid})

## 7. State Machine (Simplified)

1. Hired
2. Accepted
3. ChatCreatedLocked
4. PaymentPending
5. PaidChatUnlocked
6. InProgress
7. StudentReviewed
8. PayoutReleased
9. ExpertCompleted
10. Closed

Failure/exception branches:

1. PaymentCancelled
2. PaymentFailed
3. RefundRequested
4. SupportReview
5. FraudInvestigation

## 8. Sequence (Text)

1. Student -> Platform: Hire expert
2. Expert -> Platform: Accept hire
3. Platform -> DB: Create paid chat (chat_paid_for=false)
4. Student -> Platform: Click Pay to Chat
5. Platform -> Stripe: Create checkout session (platform-held funds)
6. Student -> Stripe: Complete payment
7. Platform/Stripe -> DB: Mark chat_paid_for=true
8. Student <-> Expert: Chat and complete work
9. Student -> Platform: Submit review (student_completed=true)
10. Platform -> Stripe: Transfer payout to expert connected account
11. Platform -> DB: Mark payout released
12. Expert -> Platform: Mark completed

## 9. What Is Explicitly Not Allowed

1. No automatic job completion when student is inactive.
2. No automatic payout release when student is inactive.
3. No payout directly to expert at payment capture time.

## 10. Operational Recommendations

1. Add Stripe webhook handlers for checkout.session.completed and payment_intent.succeeded.
2. Add payout idempotency key strategy for transfers.
3. Add admin queue for support reports (payment/refund/fraud categories).
4. Add audit log per chat for payment and completion transitions.
5. Add role-based controls so only student can pay and only expert can finalize completion.

## 11. Acceptance Checklist

1. Paid chat locked before payment.
2. Pay to Chat visible to student.
3. Messaging disabled for unpaid paid-chat.
4. Support/report button visible for payment/refund issues.
5. Student review releases payout.
6. Expert completion is blocked until payout is released.
7. Duplicate payout is blocked.
8. No auto-complete behavior.
9. Platform-held funds model active for checkout.
