import React from "react";

const LoadingSpinner: React.FC<{}> = () => {
  return (
    <div className="loadingSpinner flex flex-col items-center justify-center py-16 gap-3">
      <svg
        className="animate-spin size-8 text-blue-600 dark:text-blue-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx={12}
          cy={12}
          r={10}
          stroke="currentColor"
          strokeWidth={4}
        />
        <circle
          className="opacity-75"
          cx={12}
          cy={12}
          r={10}
          stroke="currentColor"
          strokeWidth={2}
        />
        <path
          className="opacity-75"
          fill="currenColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 animate-pulse tracking-wide">
        Fetching...
      </p>
    </div>
  );
};

export default LoadingSpinner;
