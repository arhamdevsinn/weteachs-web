"use client";

import React from 'react';
import ExpertDialog from '@/src/components/profile/ExpertProfile';
import StudentDialog from '../profile/StudentProfile';
import { useAuth } from '@/src/hooks/useAuth';
import { db } from '@/src/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const SelectedCategory = () => {
  const { profile, userId } = useAuth();
  const [roleStatus, setRoleStatus] = React.useState({
    isTeacher: Boolean(profile?.isTeacher),
    isStudent: Boolean(profile?.isStudent),
  });

  React.useEffect(() => {
    setRoleStatus({
      isTeacher: Boolean(profile?.isTeacher),
      isStudent: Boolean(profile?.isStudent),
    });
  }, [profile?.isTeacher, profile?.isStudent]);

  React.useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, 'LimboUserMode', userId), (snapshot) => {
      const data = snapshot.data();
      setRoleStatus({
        isTeacher: Boolean(data?.isTeacher),
        isStudent: Boolean(data?.isStudent),
      });
    });

    return unsubscribe;
  }, [userId]);

  const isTeacher = roleStatus.isTeacher;
  const isStudent = roleStatus.isStudent;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">
        Are you here to <span className="text-green-800">Earn</span> or <span className="text-green-800">Learn?</span>
      </h1>

      {/* Expert Card */}
      {!isStudent && (
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full mb-8 border border-gray-300">
          <p className="text-gray-700 text-center mb-6">
            From the convenience of your home! Earn through sharing your knowledge, expertise, or
            skills by chatting & video calling Students! Answer questions, Share advice, Mentor, Tutor,
            Assist, Guide!
          </p>
          <div className="flex justify-center">
            <ExpertDialog/>
          </div>
        </div>
      )}

      {/* Student Card */}
      {!isTeacher && (
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full border border-gray-300">
          <p className="text-gray-700 text-center mb-6">
            Stuck on a problem? Need help now!? You can hire one of our professionals from each
            category to get exactly the help you need for quick short sessions.
          </p>
          <div className="flex justify-center">
            <StudentDialog/>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedCategory;
