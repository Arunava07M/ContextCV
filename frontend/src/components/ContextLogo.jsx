const ContextLogo = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background: Exact Tailwind blue-600 */}
      <circle cx="50" cy="50" r="50" fill="#2563eb" />
      
      {/* Left Data Stream (White) */}
      <path 
        d="M 50 30 L 25 70 L 50 55 Z" 
        fill="#ffffff" 
      />
      
      {/* Right Data Stream (White) */}
      <path 
        d="M 50 30 L 75 70 L 50 55 Z" 
        fill="#ffffff" 
      />
    </svg>
  );
};

export default ContextLogo;