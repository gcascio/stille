export const Logo = ({
  size = 48,
}: { size?: number; }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="9" height="9" rx="4.5" fill="black"/>
    <rect y="19.5" width="9" height="28.5" fill="black"/>
    <rect x="19.5" width="9" height="48" fill="black"/>
    <rect x="39" width="9" height="48" fill="black"/>
  </svg>
)
