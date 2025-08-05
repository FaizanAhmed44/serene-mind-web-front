import React from 'react';

export const CustomLoader: React.FC = () => {
  return (
    <div className="custom-loader">
      <svg
        width="60"
        height="60"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#184349", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#184349", stopOpacity: 0.7 }} />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeDasharray="90 150"
          strokeLinecap="round"
          className="arc"
        />
      </svg>
      <style>
        {`
          .custom-loader {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.75rem;
          }
          .custom-loader .arc {
            animation: spin 1.2s linear infinite;
            transform-origin: center;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
              stroke-dashoffset: 90;
            }
            100% {
              transform: rotate(360deg);
              stroke-dashoffset: -90;
            }
          }
          @media (min-width: 640px) {
            .custom-loader svg {
              width: 70px;
              height: 70px;
            }
          }
          @media (min-width: 1024px) {
            .custom-loader svg {
              width: 80px;
              height: 80px;
            }
          }
          .dark .custom-loader .arc {
            stroke: #4DA8B5;
          }
        `}
      </style>
    </div>
  );
};