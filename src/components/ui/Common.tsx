import React from 'react';

export const Button = ({ children, variant = "primary", size = "md", className = "", ...props }: any) => {
  let sizeClass = "px-6 py-2.5 text-sm rounded-xl";
  if (size === "sm") sizeClass = "px-4 py-2 text-xs rounded-lg";
  if (size === "lg") sizeClass = "px-10 py-4 text-base rounded-2xl";
  
  const variants: any = {
    primary: "bg-[#ff6b00] text-white hover:bg-[#ff8533] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98]",
    secondary: "bg-white text-gray-900 border border-gray-100 hover:border-brand-orange hover:text-brand-orange shadow-sm",
    outline: "border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/30",
    ghost: "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };

  return (
    <button 
      className={`${sizeClass} ${variants[variant]} font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", onClick, ...props }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1' : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ label, value, onChange, labelClassName = "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1", className = "", wrapperClassName = "", ...props }: any) => (
  <div className={`flex flex-col ${wrapperClassName}`}>
    {label && <label className={labelClassName}>{label}{props.required && <span className="text-brand-orange ml-1">*</span>}</label>}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-brand-orange-light focus:ring-4 focus:ring-orange-50/50 outline-none transition-all placeholder:text-gray-200 text-gray-900 font-medium ${className}`}
      {...props}
    />
  </div>
);

type SelectOption = { id?: string; name?: string; value?: string; label?: string };

export const Select = ({
  label, value, onChange, options, placeholder, disabled,
  labelClassName = "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1",
  className = "", wrapperClassName = "", ...props
}: any) => (
  <div className={`flex flex-col ${wrapperClassName}`}>
    {label && <label className={labelClassName}>{label}{props.required && <span className="text-brand-orange ml-1">*</span>}</label>}
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-brand-orange-light focus:ring-4 focus:ring-orange-50/50 outline-none transition-all bg-white appearance-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {(options as SelectOption[]).map((opt) => {
          const val = opt.value ?? opt.id ?? String(opt);
          const lbl = opt.label ?? opt.name ?? String(opt);
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);
