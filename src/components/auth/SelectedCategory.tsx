import React from 'react';
import ExpertDialog from '@/src/components/profile/ExpertProfile';

const SelectedCategory = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">
        Are you here to <span className="text-green-800">Earn</span> or <span className="text-green-800">Learn?</span>
      </h1>

      {/* Expert Card */}
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

      {/* Student Card */}
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full border border-gray-300">
        <p className="text-gray-700 text-center mb-6">
          Stuck on a problem? Need help now!? You can hire one of our professionals from each
          category to get exactly the help you need for quick short sessions.
        </p>
        <div className="flex justify-center">
          <button className="bg-green-800 text-white font-medium px-8 py-2 rounded-full shadow-md hover:bg-green-700 transition">
            Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedCategory;
