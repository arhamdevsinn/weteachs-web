import React from "react";
import Image from "next/image";
import Link from "next/link";

interface InfoCardProps {
  image: string;
  title: string;
  text: string;
  cta?: string;
  ctaHref?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  image,
  title,
  text,
  cta,
  ctaHref,
}) => {
  return (
    <article className="flex min-h-[360px] flex-col items-center justify-between rounded-[6px] border border-gray-700 bg-white px-5 pb-3 pt-8 text-center shadow-[14px_14px_20px_rgba(0,0,0,0.25)]">
      <div>
        <Image
          src={image}
          alt=""
          width={220}
          height={170}
          className="mx-auto h-[170px] w-[220px] object-contain"
        />
        <h3 className="mt-4 text-base font-black leading-tight text-black">
          {title}
        </h3>
        <p className="mx-auto mt-1 max-w-[260px] text-[15px] leading-tight text-gray-800">
          {text}
        </p>
      </div>
      {cta && (
        <a
          href={cta === "Ask Experts" ? "/categories" : "/teach"}
          className="mt-5 flex h-[54px] w-full items-center justify-center rounded-[6px] bg-primary text-[27px] font-black leading-none text-white transition hover:bg-green-900"
        >
          {cta}
        </a>
      )}
    </article>
  );
};

export default InfoCard;
