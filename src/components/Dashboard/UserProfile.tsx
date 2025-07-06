// components/UserProfile.tsx
import React from "react";
import { Edit3 } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const avatar = user?.avatar || user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full">
          <span className="text-lg font-bold text-white">{avatar}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2">
        <Edit3 className="w-4 h-4" />
        Editar Perfil
      </button>
    </div>
  );
};

export default UserProfile;