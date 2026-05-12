import React from 'react';

export const Button = ({ children, className = "", variant = "primary", size = "md", ...props }: any) => {
  const base = "font-medium transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  let sizeClass = "px-6 py-2.5 rounded-xl";
  if (size === "sm") sizeClass = "px-4 py-1.5 text-sm rounded-lg";
  if (size === "lg") sizeClass = "px-8 py-3 text-lg rounded-2xl";
  
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    secondary: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    outline: "border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
    ghost: "text-gray-500 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button className={`${base} ${sizeClass} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", onClick, ...props }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ label, value, onChange, labelClassName = "text-sm font-semibold text-gray-700", className = "", wrapperClassName = "", ...props }: any) => (
  <div className={`space-y-1.5 ${wrapperClassName}`}>
    {label && <label className={labelClassName}>{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

export const Select = ({ label, value, onChange, options, placeholder, labelClassName = "text-sm font-semibold text-gray-700", className = "", wrapperClassName = "", ...props }: any) => (
  <div className={`space-y-1.5 ${wrapperClassName}`}>
    {label && <label className={labelClassName}>{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white ${className}`}
      {...props}
    >
      <option value="">{placeholder || "Select an option"}</option>
      {options.map((opt: any) => (
        <option key={opt.id || opt} value={opt.id || opt}>{opt.name || opt}</option>
      ))}
    </select>
  </div>
);
