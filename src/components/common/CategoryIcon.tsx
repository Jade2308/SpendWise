import React from 'react';
import {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  Users,
  Gift,
  MoreHorizontal,
  Coffee,
  Plane,
  Smartphone,
  Banknote,
  CreditCard,
  Landmark,
  Wallet,
  Tag,
  CircleDollarSign,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  Users,
  Gift,
  MoreHorizontal,
  Coffee,
  Plane,
  Smartphone,
  Banknote,
  CreditCard,
  Landmark,
  Wallet,
  Tag,
  CircleDollarSign,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = '',
  size = 18,
  color,
}) => {
  const IconComponent = ICON_MAP[name] || Tag;
  return <IconComponent size={size} className={className} style={{ color }} />;
};
