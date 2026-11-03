import Image from "next/image";

import type { Advertisement } from "@/types/ad";

type AdSize = "sm" | "md" | "lg";

interface AdProps {
  ad: Advertisement;
  size?: AdSize;
}

const imageHeights: Record<AdSize, string> = {
  sm: "h-24",
  md: "h-36",
  lg: "h-48",
};

const Ad = ({ ad, size = "md" }: AdProps) => {
  return (
    <article className="rounded-lg bg-white p-4 text-sm shadow-md">

      {/* HEADER */}
      <div className="flex items-center justify-between font-medium text-gray-500">
        <span>Sponsored Ads</span>
      </div>

      {/* CONTENT */}
      <div
        className={`mt-4 flex flex-col ${
          size === "sm" ? "gap-2" : "gap-4"
        }`}
      >

        {/* IMAGE */}
        <div
          className={`relative w-full overflow-hidden rounded-lg ${imageHeights[size]}`}
        >
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover"
          />
        </div>

        {/* ADVERTISER */}
        <div className="flex items-center gap-3">
          {ad.advertiser_logo_url && (
            <Image
              src={ad.advertiser_logo_url}
              alt={`${ad.advertiser_name} logo`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          )}

          <span className="font-medium text-purple-600">
            {ad.advertiser_name}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-gray-800">
          {ad.title}
        </h3>

        {/* DESCRIPTION */}
        {ad.description && (
          <p
            className={`text-gray-600 ${
              size === "sm" ? "text-xs" : "text-sm"
            }`}
          >
            {ad.description}
          </p>
        )}

        {/* ACTION */}
        <a
          href={ad.target_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="rounded-lg bg-purple-100 p-2 text-center text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200"
        >
          Learn more
        </a>
      </div>
    </article>
  );
};

export default Ad;