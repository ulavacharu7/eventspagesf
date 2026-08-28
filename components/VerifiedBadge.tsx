import React from 'react';

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  className = "w-3.5 h-3.5",
  size
}) => {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} inline-block shrink-0 align-middle`}
      style={sizeStyle}
      aria-label="Verified Host"
    >
      {/* Scalloped badge background */}
      <path
        d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32431C18.7614 4.26928 19.7307 5.23859 19.6757 6.41551L19.6049 7.92902C19.5771 8.52387 19.8158 9.10023 20.2561 9.50106L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50106 20.2561C9.10023 19.8158 8.52387 19.5771 7.92902 19.6049L6.41551 19.6757C5.23859 19.7307 4.26928 18.7614 4.32431 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50106C4.18418 9.10023 4.42288 8.52387 4.39508 7.92902L4.32431 6.41551C4.26928 5.23859 5.23859 4.26928 6.41551 4.32431L7.92902 4.39508C8.52387 4.42288 9.10023 4.18418 9.50106 3.74391L10.5213 2.62368Z"
        fill="#3897F0"
      />
      {/* Checkmark */}
      <path
        d="M8.5 12.2L10.8 14.5L16 9.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VerifiedBadge;
