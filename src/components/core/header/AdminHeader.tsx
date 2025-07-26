import React from "react";

type AdminHeaderProps = {
  rightContent?: React.ReactNode;
};

export default function AdminHeader({ rightContent }: AdminHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
          <img
              src="/logo.svg"
              alt="Onething Logo"
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold text-gray-800">Onething</span>
          </div>
          {rightContent && (
            <div className="flex items-center space-x-4">
            {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 