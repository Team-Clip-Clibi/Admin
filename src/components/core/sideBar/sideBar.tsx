"use client";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  id: string;
  label: string;
  path: string;
};

export const sidebarMenu = [
    { id: "application", label: "신청정보", path: "/application" },
    { id: "meeting", label: "모임관리", path: "/meeting" },
    { id: "information", label: "정보관리", path: "/information" },
  ];

const menuItems: MenuItem[] = sidebarMenu;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleMenuClick = (path: string) => {
    // 모든 탭 상태 초기화
    window.localStorage.removeItem('informationActiveTab');
    window.localStorage.removeItem('applicationActiveTab');
    window.localStorage.removeItem('meetingActiveTab');
    
    // 모든 탭 초기화 이벤트 발생
    window.dispatchEvent(new Event("resetInformationTab"));
    window.dispatchEvent(new Event("resetApplicationTab"));
    window.dispatchEvent(new Event("resetMeetingTab"));
    router.push(path);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">관리자 메뉴</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 text-purple-600 font-medium"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
