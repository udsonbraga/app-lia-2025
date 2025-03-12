
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Trash2, UserCircle } from "lucide-react";

interface AvatarSectionProps {
  avatarUrl: string | null;
  userName: string;
  setAvatarUrl: (url: string | null) => void;
}

export const AvatarSection = ({ avatarUrl, userName, setAvatarUrl }: AvatarSectionProps) => {
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      localStorage.setItem("avatarUrl", imageUrl);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem("avatarUrl");
  };

  return (
    <>
      <div className="relative mb-2">
        <Avatar className="h-20 w-20 ring-4 ring-gray-100">
          <AvatarImage src={avatarUrl || ""} alt="Avatar" />
          <AvatarFallback>
            {userName ? userName.charAt(0).toUpperCase() : <UserCircle className="h-20 w-20 text-gray-700" />}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {userName && (
        <div className="text-lg font-medium mb-2">{userName}</div>
      )}
      
      <div className="flex gap-2 mb-4">
        <label htmlFor="avatar-input" className="cursor-pointer flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-gray-700">
          <Upload className="h-3 w-3" />
          Alterar foto
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatar-input"
          />
        </label>
        
        {avatarUrl && (
          <button 
            onClick={handleRemoveAvatar}
            className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-gray-700"
          >
            <Trash2 className="h-3 w-3" />
            Remover
          </button>
        )}
      </div>
    </>
  );
};
