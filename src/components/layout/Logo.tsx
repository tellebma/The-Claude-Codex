interface LogoProps {
  size?: "sm" | "md";
}

export function Logo({ size = "md" }: LogoProps) {
  const dimension = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <div
      className={`${dimension} relative flex items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        aria-hidden="true"
      >
        {/* Chevron bracket: > _ representing a terminal prompt */}
        <path
          d="M8 10L15 16L8 22"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 22H24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
