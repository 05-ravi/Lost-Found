import { 
  Smartphone, FileText, Watch, Book, 
  Shirt, Key, Wallet, HelpCircle, Laptop,
  Headphones, CreditCard, Briefcase
} from 'lucide-react';

export const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || '';

  const iconMap = {
    electronics: Smartphone,
    phone: Smartphone,
    laptop: Laptop,
    headphones: Headphones,
    documents: FileText,
    id: CreditCard,
    card: CreditCard,
    accessories: Watch,
    watch: Watch,
    books: Book,
    notebook: Book,
    clothing: Shirt,
    keys: Key,
    wallets: Wallet,
    wallet: Wallet,
    other: HelpCircle,
  };

  const IconComponent = iconMap[cat] || HelpCircle;
  return IconComponent;
};

export const categories = [
  { name: 'Electronics', icon: Smartphone, color: '#F0F4FF' },
  { name: 'Documents', icon: FileText, color: '#FDF2F2' },
  { name: 'Accessories', icon: Watch, color: '#F5F3FF' },
  { name: 'Books', icon: Book, color: '#ECFDF5' },
  { name: 'Clothing', icon: Shirt, color: '#FFFBEB' },
  { name: 'Keys', icon: Key, color: '#FFF7ED' },
  { name: 'Wallets', icon: Wallet, color: '#F0FDFA' },
  { name: 'Other', icon: HelpCircle, color: '#F9FAFB' },
];
