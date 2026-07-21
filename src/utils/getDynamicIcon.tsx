'use client';

import {
  Layers,
  LayoutDashboard,
  LayoutGrid,
  CreditCard,
  ShoppingCart,
  User,
  ImageIcon,
  Search,
  CheckSquare,
  Settings,
  MessageSquare,
  Sparkles,
  Workflow,
  Folder,
  LucideIcon
} from 'lucide-react';

interface NodeIconProps {
  title?: string;
  type: 'root' | 'feature' | 'subfeature';
  className?: string;
}

export default function NodeIcon({ title = '', type, className = 'h-5 w-5' }: NodeIconProps) {
  const t = title.toLowerCase();

  let IconComponent: LucideIcon;

  // Keyword-based automatic dynamic icon selection
  if (t.includes('bayar') || t.includes('payment') || t.includes('checkout') || t.includes('transaksi') || t.includes('voucher') || t.includes('ongkir')) {
    IconComponent = CreditCard;
  } else if (t.includes('keranjang') || t.includes('cart') || t.includes('belanja') || t.includes('toko')) {
    IconComponent = ShoppingCart;
  } else if (t.includes('user') || t.includes('pengguna') || t.includes('auth') || t.includes('login') || t.includes('akun') || t.includes('profil')) {
    IconComponent = User;
  } else if (t.includes('galeri') || t.includes('gambar') || t.includes('foto') || t.includes('image') || t.includes('media')) {
    IconComponent = ImageIcon;
  } else if (t.includes('cari') || t.includes('search') || t.includes('filter')) {
    IconComponent = Search;
  } else if (t.includes('task') || t.includes('tugas') || t.includes('todo') || t.includes('checklist')) {
    IconComponent = CheckSquare;
  } else if (t.includes('setting') || t.includes('pengaturan') || t.includes('konfigurasi')) {
    IconComponent = Settings;
  } else if (t.includes('diskusi') || t.includes('chat') || t.includes('komentar') || t.includes('pesan')) {
    IconComponent = MessageSquare;
  } else if (t.includes('ai') || t.includes('mikir') || t.includes('smart') || t.includes('otomatis')) {
    IconComponent = Sparkles;
  } else if (t.includes('proyek') || t.includes('project') || t.includes('folder')) {
    IconComponent = Folder;
  } else if (t.includes('papan') || t.includes('diagram') || t.includes('flow') || t.includes('kanvas') || t.includes('layout')) {
    IconComponent = Workflow;
  } else {
    // Default fallback based on node type
    if (type === 'root') IconComponent = Layers;
    else if (type === 'feature') IconComponent = LayoutDashboard;
    else IconComponent = LayoutGrid;
  }

  return <IconComponent className={className} />;
}
