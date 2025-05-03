
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";

interface IconInputProps {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}

const IconInput = ({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}: IconInputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 ${className}`}
        type={type}
      />
    </div>
  );
};

export default IconInput;
