import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  FileText,
  AlertCircle,
  Menu,
  Activity,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenMore }) => {
  const { userRole } = useAuth();

  const studentItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'room', label: 'My Room', icon: Home },
    { id: 'leaves', label: 'Leaves', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
  ];

  const wardenItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'health_score', label: 'Health', icon: Activity },
    { id: 'heatmap', label: 'Heatmap', icon: ShieldAlert },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
  ];

  const items = userRole === 'warden' ? wardenItems : studentItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-2 py-1">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenMore}
          className="flex flex-col items-center py-1.5 px-3 text-gray-500 hover:text-gray-800 rounded-lg text-[10px] font-medium"
        >
          <Menu className="w-5 h-5 mb-0.5 text-gray-400" />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
};
