import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const AddIconIcon: React.FC<IconProps> = ({ className, width = 24, height = 24 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M20.376 13h2.023c.066-.49.101-.991.101-1.5 0-6.075-4.925-11-11-11s-11 4.925-11 11 4.925 11 11 11c.509 0 1.01-.035 1.5-.101v-2.023A9 9 0 1 1 20.376 13Z"
      fill="currentColor"
    />
    <path
      d="M14.5 8a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Zm-6 0a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Z"
      fill="currentColor"
    />
  </svg>
);

export const AddCoverIcon: React.FC<IconProps> = ({ className, width = 16, height = 16 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 16 16" fill="none">
    <path
      d="M6.76 11.993l-2.85-.007a.2.2 0 01-.142-.341l2.755-2.756a.267.267 0 01.378 0l1.27 1.272 3.373-3.372a.267.267 0 01.455.189V11.8a.2.2 0 01-.2.2H6.815a.203.203 0 01-.056-.008zm-4.095 2.674c-.733 0-1.333-.6-1.333-1.333V2.667c0-.733.6-1.333 1.333-1.333h10.667c.733 0 1.333.6 1.333 1.333v10.667c0 .733-.6 1.333-1.333 1.333H2.665z"
      fill="currentColor"
    />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="m17.57 7.244-.006-.006.37-.37a1 1 0 0 0 .001-1.412l-3.434-3.453-.002-.002a1 1 0 0 0-1.414 0l-.705.706.01.01L2 13.186V17a1 1 0 0 0 1 1h3.814L17.57 7.244Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className, width = 16, height = 16 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 16 16" fill="none">
    <path
      d="M7.712 11.351L3.34 5.9a.45.45 0 010-.538.278.278 0 01.215-.112h8.89c.168 0 .305.17.305.381a.432.432 0 01-.09.269l-4.372 5.451c-.159.199-.417.199-.576 0z"
      fill="#2B2F36"
    />
  </svg>
);

export const TextIcon: React.FC<IconProps> = ({ className, width = 24, height = 24 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M2 3a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V4h-7v16h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3V4H4v3a1 1 0 1 1-2 0V3Z"
      fill="currentColor"
    />
  </svg>
);

export const DragDotsIcon: React.FC<IconProps> = ({ className, width = 24, height = 24 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M8.25 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm0 7.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm1.75 5.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM14.753 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM16.5 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm-1.747 9a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
      fill="currentColor"
    />
  </svg>
);

export const AddColumnIcon: React.FC<IconProps> = ({ className, width = 22, height = 24 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 22 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.153 20.721A10.999 10.999 0 0022 11c0-6.075-4.925-11-11-11S0 4.925 0 11c0 4.213 2.369 7.873 5.847 9.721L11 24l5.153-3.279z"
      fill="#3370FF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.45 6a.2.2 0 00-.2.2v4.05H6.2a.2.2 0 00-.2.2v1.1c0 .11.09.2.2.2h4.05v4.05c0 .11.09.2.2.2h1.1a.2.2 0 00.2-.2v-4.05h4.05a.2.2 0 00.2-.2v-1.1a.2.2 0 00-.2-.2h-4.05V6.2a.2.2 0 00-.2-.2h-1.1z"
      fill="#fff"
    />
  </svg>
);