"use client";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeMap = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };

export default function StarRating({ rating, max = 5, size = "sm", interactive = false, onRate }: StarRatingProps) {
  const starSize = sizeMap[size];

  const starSvg = (star: number) => (
    <svg
      className={`${starSize} transition-colors ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300"}`}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            {starSvg(star)}
          </button>
        ) : (
          <span key={star}>{starSvg(star)}</span>
        )
      )}
    </div>
  );
}
