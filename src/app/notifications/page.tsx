import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Home,
  MessageCircle,
  PlusCircle,
  Search,
} from "lucide-react";

type NotificationItem = {
  id: number;
  avatar: string;
  title: string;
  status?: string;
  details?: string;
  timeAgo: string;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    avatar: "/logo.png",
    title: "WeTeachsStu has received your job",
    status: "Accepted",
    details: "15min $15.00",
    timeAgo: "a day ago",
  },
  {
    id: 2,
    avatar: "/sample.png",
    title: "Bhumika Commented on your Post!",
    timeAgo: "5 months ago",
  },
  {
    id: 3,
    avatar: "/sample.png",
    title: "Coachnelly Commented on your Post!",
    timeAgo: "5 months ago",
  },
  {
    id: 4,
    avatar: "/sample.png",
    title: "Coachnelly Commented on your Post!",
    timeAgo: "5 months ago",
  },
  {
    id: 5,
    avatar: "/sample.png",
    title: "Coachnelly Commented on your Post!",
    timeAgo: "5 months ago",
  },
  {
    id: 6,
    avatar: "/logo.png",
    title: "WeTeachsStu Liked your post",
    timeAgo: "6 months ago",
  },
  {
    id: 7,
    avatar: "/logo.png",
    title: "WeTeachsStu Liked your post",
    timeAgo: "6 months ago",
  },
  {
    id: 8,
    avatar: "/pro.png",
    title: "Yggh Commented on your Post!",
    timeAgo: "6 months ago",
  },
  {
    id: 9,
    avatar: "/profile.png",
    title: "Azan Commented on your Post!",
    timeAgo: "6 months ago",
  },
  {
    id: 10,
    avatar: "/logo.png",
    title: "WeTeachsStu has received your job",
    status: "Accepted",
    details: "30min $24.00",
    timeAgo: "7 months ago",
  },
  {
    id: 11,
    avatar: "/logo.png",
    title: "WeTeachsStu has received your job",
    status: "Open",
    details: "45min $36.00",
    timeAgo: "7 months ago",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-[#ececec]">
      <header className="sticky top-0 z-10 bg-[#1f6f3f] px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <h1 className="text-4xl font-semibold tracking-wide text-white/90 sm:text-5xl">
            Notifications
          </h1>

          <button
            type="button"
            aria-label="Notification alerts"
            className="relative rounded-full p-2 text-black/95"
          >
            <Bell className="h-8 w-8" />
            <span className="absolute -right-2 -top-2 inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#f25a6d] px-2 text-base font-semibold text-white">
              14
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4 py-4 pb-28">
        {notifications.map((item) => (
          <article
            key={item.id}
            className="rounded-[10px] border-2 border-[#2f7b4f] bg-[#f5f5f5] px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-[70px] w-[70px] shrink-0 overflow-hidden rounded-full bg-[#dfdfdf]">
                <Image
                  src={item.avatar}
                  alt={item.title}
                  width={70}
                  height={70}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="line-clamp-2 text-[1.95rem] font-semibold leading-[1.1] text-black sm:text-2xl">
                  {item.title}
                </p>

                {item.status ? (
                  <p className="mt-1 text-[1.6rem] text-black/90 sm:text-xl">
                    <span
                      className={item.status === "Accepted" ? "font-semibold text-[#24aa4b]" : "font-semibold text-black"}
                    >
                      {item.status}
                    </span>{" "}
                    {item.details} {item.timeAgo}
                  </p>
                ) : (
                  <p className="mt-1 text-[1.6rem] text-black/85 sm:text-xl">{item.timeAgo}</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/10 bg-[#ececec] px-2 py-2">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center justify-center py-1 text-black">
            <Home className="h-6 w-6" />
            <span className="text-sm">Home</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center justify-center py-1 text-black">
            <Search className="h-6 w-6" />
            <span className="text-sm">Search</span>
          </Link>
          <Link href="/upload" className="flex flex-col items-center justify-center py-1 text-black">
            <PlusCircle className="h-7 w-7" />
            <span className="text-sm">Create</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center justify-center py-1 text-black">
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm">Message</span>
          </Link>
          <Link
            href="/notifications"
            className="flex flex-col items-center justify-center py-1 text-[#a28c4f]"
          >
            <Bell className="h-6 w-6" />
            <span className="text-sm">Alert</span>
          </Link>
        </div>
      </nav> */}
    </div>
  );
};

export default Page;