"use client";
import router from "next/dist/shared/lib/router/router";
import React from "react";
import { useRouter } from "next/navigation";
const team = [
  {
    name: "Isaiah Joseph",
    role: "CEO of WeTeachs. Will get everyone's photos asap!",
    image: "/isaiah.png",
    socials: [
      { type: "twitter", label: "@Hobofasho", url: "https://twitter.com/Hobofasho" },
      { type: "email", label: "weteachchat@gmail.com", url: "mailto:weteachchat@gmail.com" },
    ],
  },
  {
    name: "Jarrod Blair",
    role: "Hello,\nI'm Jarrod the lead promoter of WeTeachs & Founder of KOTJ.",
    image: "/jarrod.png",
    socials: [
      { type: "twitter", label: "@kotjxboogz", url: "https://twitter.com/kotjxboogz" },
    ],
  },
  {
    name: "Arham Sawar",
    role: "App Developer",
    image: "/arham.png",
    socials: [],
  },
];

const TeamWeTeachs = () => {
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-lg font-semibold tracking-wide text-gray-700 mb-6 uppercase">
        Team
      </h2>
      <div className="border-t border-gray-300 mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {team.map((member, idx) => (
        <div key={idx} className="flex flex-col items-center text-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-64 h-64 object-cover rounded-md mb-4 border border-gray-200"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
          <p className="text-gray-700 mb-3 whitespace-pre-line">{member.role}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {member.socials.map((s, i) =>
              s.type === "email" ? (
                <a
                  key={i}
                  href={s.url}
                  className="text-primary underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ) : (
                <a
                  key={i}
                  href={s.url}
                  className="text-gray-700 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              )
            )}
          </div>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-300 mb-8" />
    <div className="flex justify-center">
      <button
        className="bg-primary text-white px-10 py-3 rounded-full font-medium text-lg shadow hover:bg-green-900 transition"
        onClick={() => router.push('/contact')}

      >
        Contact Us!
      </button>
    </div>
  </section>
);
}

export default TeamWeTeachs;