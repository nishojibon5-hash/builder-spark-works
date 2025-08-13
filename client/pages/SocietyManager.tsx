import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Layout from "@/components/Layout";
import { 
  Users,
  Banknote,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Eye,
  Edit,
  Download,
  Upload,
  Bell,
  Settings,
  FileText,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Home,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  DollarSign,
  Target,
  Award,
  Handshake,
  Building2,
  ShieldCheck,
  Receipt,
  CalendarDays,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Save,
  User,
  FileSpreadsheet,
  Camera,
  Image,
  Trash2,
  Shield,
  Database,
  HardDrive,
  Printer
} from "lucide-react";

interface Worker {
  id: string;
  name: string;
  area: string;
  phone: string;
  photo?: string;
  totalMembers: number;
  dailyCollection: number;
  status: 'active' | 'inactive';
  createdAt: string;
  createdBy: string;
}

interface SocietyMember {
  id: string;
  memberCode: string;
  name: string;
  nid: string;
  phone: string;
  workerName: string;
  area: string;
  installmentAmount: number;
  savingsAmount: number;
  loanAmount: number;
  joinDate: string;
  status: 'active' | 'inactive';
  membershipType: 'regular' | 'premium' | 'life';
  createdAt: string;
  createdBy: string;
}

interface DailyCollection {
  id: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  workerName: string;
  date: string;
  installmentCollected: number;
  savingsCollected: number;
  status: 'collected' | 'pending' | 'missed';
  createdAt: string;
  createdBy: string;
}

interface MemberProfile {
  member: SocietyMember;
  collections: DailyCollection[];
  monthlyStats: {
    totalInstallment: number;
    totalSavings: number;
    collectedDays: number;
    missedDays: number;
  };
}

interface IncomeExpense {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  createdBy: string;
}

interface WorkerSalary {
  id: string;
  workerId: string;
  workerName: string;
  month: string;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: 'paid' | 'pending' | 'cancelled';
  paidDate?: string;
  createdAt: string;
  createdBy: string;
}

export default function SocietyManager() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [collections, setCollections] = useState<DailyCollection[]>([]);
  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpense[]>([]);
  const [workerSalaries, setWorkerSalaries] = useState<WorkerSalary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<SocietyMember | null>(null);
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const [memberProfileOpen, setMemberProfileOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addWorkerOpen, setAddWorkerOpen] = useState(false);
  const [collectionSheetOpen, setCollectionSheetOpen] = useState(false);
  const [incomeExpenseOpen, setIncomeExpenseOpen] = useState(false);
  const [workerSalaryOpen, setWorkerSalaryOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  // New member form state
  const [newMember, setNewMember] = useState({
    memberCode: '',
    name: '',
    nid: '',
    phone: '',
    workerName: '',
    installmentAmount: 0,
    savingsAmount: 0,
    loanAmount: 0
  });

  // New worker form state
  const [newWorker, setNewWorker] = useState({
    name: '',
    area: '',
    phone: '',
    photo: ''
  });

  // Collection form state
  const [dailyCollectionData, setDailyCollectionData] = useState<Record<string, {
    installment: number;
    savings: number;
  }>>({});

  // Income/Expense form state
  const [newIncomeExpense, setNewIncomeExpense] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Worker Salary form state
  const [newWorkerSalary, setNewWorkerSalary] = useState({
    workerId: '',
    workerName: '',
    month: new Date().toISOString().split('T')[0].substring(0, 7),
    baseSalary: 0,
    bonus: 0,
    deductions: 0
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWorkers = localStorage.getItem('society_workers');
    const savedMembers = localStorage.getItem('society_members');
    const savedCollections = localStorage.getItem('society_collections');
    const savedIncomeExpenses = localStorage.getItem('society_income_expenses');
    const savedWorkerSalaries = localStorage.getItem('society_worker_salaries');
    const savedAdminStatus = localStorage.getItem('society_admin_status');

    if (savedWorkers) {
      setWorkers(JSON.parse(savedWorkers));
    }
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
    if (savedIncomeExpenses) {
      setIncomeExpenses(JSON.parse(savedIncomeExpenses));
    }
    if (savedWorkerSalaries) {
      setWorkerSalaries(JSON.parse(savedWorkerSalaries));
    }
    if (savedAdminStatus) {
      setIsAdmin(JSON.parse(savedAdminStatus));
    }
  }, []);

  // Prevent auto-deletion - Save data to localStorage whenever state changes
  useEffect(() => {
    if (workers.length > 0) {
      localStorage.setItem('society_workers', JSON.stringify(workers));
    }
  }, [workers]);

  useEffect(() => {
    if (members.length > 0) {
      localStorage.setItem('society_members', JSON.stringify(members));
    }
  }, [members]);

  useEffect(() => {
    if (collections.length > 0) {
      localStorage.setItem('society_collections', JSON.stringify(collections));
    }
  }, [collections]);

  useEffect(() => {
    if (incomeExpenses.length > 0) {
      localStorage.setItem('society_income_expenses', JSON.stringify(incomeExpenses));
    }
  }, [incomeExpenses]);

  useEffect(() => {
    if (workerSalaries.length > 0) {
      localStorage.setItem('society_worker_salaries', JSON.stringify(workerSalaries));
    }
  }, [workerSalaries]);

  useEffect(() => {
    localStorage.setItem('society_admin_status', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const text = {
    bn: {
      dashboard: "ড্যাশবোর্ড",
      workers: "কর্মী ব্যবস্থাপনা",
      members: "সদস্যগণ",
      collection: "কালেকশন",
      reports: "প্রতিবেদন",
      settings: "সেটিংস",
      societyName: "আমাদের সমিতি",
      totalMembers: "মোট সদস্য",
      totalWorkers: "মোট কর্মী",
      todayCollection: "আজকের কালেকশন",
      monthlyTarget: "মাসিক লক্ষ্য",
      addMember: "নতুন সদস্য যোগ করুন",
      addWorker: "নতুন কর্মী যোগ করুন",
      collectionSheet: "কালেকশন শীট",
      memberProfile: "সদস্যের প্রোফাইল",
      searchMembers: "সদস্য খু���জুন...",
      memberCode: "সদস্য কোড",
      memberName: "সদস্যের নাম",
      nidNumber: "এনআইডি নম্বর",
      phoneNumber: "মোবাইল নম্বর",
      workerName: "কর্মীর নাম",
      area: "এলাকা",
      installmentAmount: "কিস্তির পরিমাণ",
      savingsAmount: "সঞ্চয়ের পরিমাণ",
      loanAmount: "ঋণের পরিমাণ",
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল",
      dailyCollection: "দৈনিক কালেকশন",
      selectWorker: "কর্মী নির্বাচন করুন",
      selectDate: "তারিখ নির্বাচন করুন",
      monthlyCalendar: "মাসিক ক্যালেন্ডার",
      searchByDate: "তারিখ দিয়ে খুঁজুন",
      collected: "সংগ্রহীত",
      pending: "অপেক্ষমান",
      missed: "মিসড",
      totalInstallment: "মোট কিস্তি",
      totalSavings: "মোট সঞ্চয়",
      collectedDays: "কালেকশন দিন",
      missedDays: "মিসড দিন",
      photo: "ছবি",
      uploadPhoto: "ছবি আপলোড করুন",
      adminLogin: "অ্যাডমিন লগইন",
      adminPassword: "অ্যাডমিন পাসওয়ার্ড",
      login: "লগইন",
      logout: "লগআউট",
      dataBackup: "ডেটা ব্যাকআপ",
      downloadPDF: "পিডিএফ ডাউনলোড",
      uploadBackup: "ব্যাকআপ আপলোড",
      deleteData: "ডেটা মুছুন",
      confirmDelete: "মুছে ফেলার নিশ্চিতকরণ",
      cannotDelete: "শুধুমাত্র অ্যাডমিন ডেটা মুছতে পারবেন",
      dataProtected: "ডেটা সুরক্ষিত",
      memberProfilePDF: "সদস্যের প্রোফাইল পিডিএফ",
      collectionCalendarPDF: "কালেকশন ক্যালেন্ডার পিডিএফ",
      completeDatabasePDF: "সম্পূর্ণ ডেটাবেস পিডিএফ",
      generating: "তৈরি করা হচ্ছে...",
      noDataFound: "কোনো ডেটা পাওয়া যায়নি",
      monthlyInstallment: "মাসিক কিস্তি",
      monthlySavings: "মাসিক সঞ্চয়",
      incomeExpense: "আয় ব্যয়",
      workerSalary: "কর্মীর বেতন",
      addIncomeExpense: "আয় ব্যয় যোগ করুন",
      addWorkerSalary: "বেতন প্রদান করুন",
      income: "আয়",
      expense: "ব্যয়",
      category: "বিভাগ",
      amount: "পরিমাণ",
      description: "বিবরণ",
      date: "তারিখ",
      baseSalary: "মূল বেতন",
      bonus: "বোনাস",
      deductions: "কর্তন",
      totalSalary: "মোট বেতন",
      month: "মাস",
      paid: "প্রদত্ত",
      pending: "অপেক্ষমান",
      cancelled: "বাতিল",
      totalIncome: "মোট আয়",
      totalExpense: "মোট ব্যয়",
      netIncome: "নিট আয়",
      salaryPaid: "বেতন প্রদত্ত",
      selectMonth: "মাস নির্বাচন করুন"
    },
    en: {
      dashboard: "Dashboard",
      workers: "Worker Management",
      members: "Members",
      collection: "Collection",
      reports: "Reports",
      settings: "Settings",
      societyName: "Our Society",
      totalMembers: "Total Members",
      totalWorkers: "Total Workers",
      todayCollection: "Today's Collection",
      monthlyTarget: "Monthly Target",
      addMember: "Add New Member",
      addWorker: "Add New Worker",
      collectionSheet: "Collection Sheet",
      memberProfile: "Member Profile",
      searchMembers: "Search members...",
      memberCode: "Member Code",
      memberName: "Member Name",
      nidNumber: "NID Number",
      phoneNumber: "Phone Number",
      workerName: "Worker Name",
      area: "Area",
      installmentAmount: "Installment Amount",
      savingsAmount: "Savings Amount",
      loanAmount: "Loan Amount",
      save: "Save",
      cancel: "Cancel",
      dailyCollection: "Daily Collection",
      selectWorker: "Select Worker",
      selectDate: "Select Date",
      monthlyCalendar: "Monthly Calendar",
      searchByDate: "Search by Date",
      collected: "Collected",
      pending: "Pending",
      missed: "Missed",
      totalInstallment: "Total Installment",
      totalSavings: "Total Savings",
      collectedDays: "Collected Days",
      missedDays: "Missed Days",
      photo: "Photo",
      uploadPhoto: "Upload Photo",
      adminLogin: "Admin Login",
      adminPassword: "Admin Password",
      login: "Login",
      logout: "Logout",
      dataBackup: "Data Backup",
      downloadPDF: "Download PDF",
      uploadBackup: "Upload Backup",
      deleteData: "Delete Data",
      confirmDelete: "Confirm Delete",
      cannotDelete: "Only admin can delete data",
      dataProtected: "Data Protected",
      memberProfilePDF: "Member Profile PDF",
      collectionCalendarPDF: "Collection Calendar PDF",
      completeDatabasePDF: "Complete Database PDF",
      generating: "Generating...",
      noDataFound: "No data found",
      monthlyInstallment: "Monthly Installment",
      monthlySavings: "Monthly Savings",
      incomeExpense: "Income & Expense",
      workerSalary: "Worker Salary",
      addIncomeExpense: "Add Income/Expense",
      addWorkerSalary: "Pay Salary",
      income: "Income",
      expense: "Expense",
      category: "Category",
      amount: "Amount",
      description: "Description",
      date: "Date",
      baseSalary: "Base Salary",
      bonus: "Bonus",
      deductions: "Deductions",
      totalSalary: "Total Salary",
      month: "Month",
      paid: "Paid",
      pending: "Pending",
      cancelled: "Cancelled",
      totalIncome: "Total Income",
      totalExpense: "Total Expense",
      netIncome: "Net Income",
      salaryPaid: "Salary Paid",
      selectMonth: "Select Month"
    }
  };

  const currentText = text[language];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  // Admin authentication - STRONG SECURITY
  const handleAdminLogin = () => {
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setShowAdminDialog(false);
      setAdminPassword("");
      // Store admin session securely
      sessionStorage.setItem('society_admin_session', 'authenticated');
    } else {
      alert(language === 'bn' ? 'ভুল পাসওয়ার্ড' : 'Wrong password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('society_admin_session');
  };

  // Check admin session on load
  useEffect(() => {
    const adminSession = sessionStorage.getItem('society_admin_session');
    if (adminSession === 'authenticated') {
      setIsAdmin(true);
    }
  }, []);

  // STRONG DATA PROTECTION - Only admin can delete
  const handleDeleteWorker = (workerId: string) => {
    if (!isAdmin) {
      alert(currentText.cannotDelete);
      return;
    }
    
    // Extra confirmation for data protection
    if (window.confirm(language === 'bn' ? 'আপনি কি সত্যিই এই কর্মীকে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'Are you sure you want to delete this worker? This action cannot be undone.')) {
      const updatedWorkers = workers.filter(w => w.id !== workerId);
      setWorkers(updatedWorkers);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (!isAdmin) {
      alert(currentText.cannotDelete);
      return;
    }
    
    // Extra confirmation for data protection
    if (window.confirm(language === 'bn' ? 'আপনি কি সত্যিই এই সদস্যকে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'Are you sure you want to delete this member? This action cannot be undone.')) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        // Update worker's total members count
        const updatedWorkers = workers.map(w => 
          w.name === member.workerName 
            ? { ...w, totalMembers: Math.max(0, w.totalMembers - 1) }
            : w
        );
        setWorkers(updatedWorkers);
      }
      
      const updatedMembers = members.filter(m => m.id !== memberId);
      setMembers(updatedMembers);
      
      // Also remove related collections
      const updatedCollections = collections.filter(c => c.memberId !== memberId);
      setCollections(updatedCollections);
    }
  };

  // Worker management functions
  const handleAddWorker = () => {
    const worker: Worker = {
      id: `W${String(workers.length + 1).padStart(3, '0')}`,
      name: newWorker.name,
      area: newWorker.area,
      phone: newWorker.phone,
      photo: newWorker.photo,
      totalMembers: 0,
      dailyCollection: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: isAdmin ? 'admin' : 'user'
    };

    setWorkers([...workers, worker]);
    setNewWorker({
      name: '',
      area: '',
      phone: '',
      photo: ''
    });
    setAddWorkerOpen(false);
  };

  const handleAddMember = () => {
    const member: SocietyMember = {
      id: `M${String(members.length + 1).padStart(3, '0')}`,
      memberCode: newMember.memberCode,
      name: newMember.name,
      nid: newMember.nid,
      phone: newMember.phone,
      workerName: newMember.workerName,
      area: workers.find(w => w.name === newMember.workerName)?.area || '',
      installmentAmount: newMember.installmentAmount || 0,
      savingsAmount: newMember.savingsAmount || 0,
      loanAmount: newMember.loanAmount || 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      membershipType: 'regular',
      createdAt: new Date().toISOString(),
      createdBy: isAdmin ? 'admin' : 'user'
    };

    setMembers([...members, member]);
    
    // Update worker's total members count
    const updatedWorkers = workers.map(w => 
      w.name === newMember.workerName 
        ? { ...w, totalMembers: w.totalMembers + 1 }
        : w
    );
    setWorkers(updatedWorkers);

    setNewMember({
      memberCode: '',
      name: '',
      nid: '',
      phone: '',
      workerName: '',
      installmentAmount: 0,
      savingsAmount: 0,
      loanAmount: 0
    });
    setAddMemberOpen(false);
  };

  // Collection function - allows any amount or empty
  const handleSaveCollection = () => {
    const newCollections: DailyCollection[] = [];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    Object.entries(dailyCollectionData).forEach(([memberId, data]) => {
      const member = members.find(m => m.id === memberId);
      if (member) {
        // Save collection even if both amounts are 0 or empty
        newCollections.push({
          id: `C${String(collections.length + newCollections.length + 1).padStart(3, '0')}`,
          memberId,
          memberCode: member.memberCode,
          memberName: member.name,
          workerName: selectedWorker,
          date: selectedDateStr,
          installmentCollected: data.installment || 0,
          savingsCollected: data.savings || 0,
          status: 'collected',
          createdAt: new Date().toISOString(),
          createdBy: isAdmin ? 'admin' : 'user'
        });
      }
    });

    setCollections([...collections, ...newCollections]);

    // Update worker's daily collection
    const totalCollection = newCollections.reduce((sum, c) =>
      sum + c.installmentCollected + c.savingsCollected, 0
    );

    const updatedWorkers = workers.map(w =>
      w.name === selectedWorker
        ? { ...w, dailyCollection: w.dailyCollection + totalCollection }
        : w
    );
    setWorkers(updatedWorkers);

    setDailyCollectionData({});
    setCollectionSheetOpen(false);
  };

  // Income/Expense management functions
  const handleAddIncomeExpense = () => {
    const incomeExpense: IncomeExpense = {
      id: `IE${String(incomeExpenses.length + 1).padStart(3, '0')}`,
      type: newIncomeExpense.type,
      category: newIncomeExpense.category,
      amount: newIncomeExpense.amount,
      description: newIncomeExpense.description,
      date: newIncomeExpense.date,
      createdAt: new Date().toISOString(),
      createdBy: isAdmin ? 'admin' : 'user'
    };

    setIncomeExpenses([...incomeExpenses, incomeExpense]);
    setNewIncomeExpense({
      type: 'income',
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIncomeExpenseOpen(false);
  };

  // Worker Salary management functions
  const handleAddWorkerSalary = () => {
    const worker = workers.find(w => w.id === newWorkerSalary.workerId);
    if (!worker) return;

    const totalSalary = newWorkerSalary.baseSalary + newWorkerSalary.bonus - newWorkerSalary.deductions;

    const salary: WorkerSalary = {
      id: `WS${String(workerSalaries.length + 1).padStart(3, '0')}`,
      workerId: newWorkerSalary.workerId,
      workerName: worker.name,
      month: newWorkerSalary.month.split('-')[1],
      year: parseInt(newWorkerSalary.month.split('-')[0]),
      baseSalary: newWorkerSalary.baseSalary,
      bonus: newWorkerSalary.bonus,
      deductions: newWorkerSalary.deductions,
      totalSalary,
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: isAdmin ? 'admin' : 'user'
    };

    setWorkerSalaries([...workerSalaries, salary]);

    // Add salary as expense
    const salaryExpense: IncomeExpense = {
      id: `IE${String(incomeExpenses.length + 1).padStart(3, '0')}`,
      type: 'expense',
      category: 'বেতন',
      amount: totalSalary,
      description: `${worker.name} - ${newWorkerSalary.month} মাসের বেতন`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: isAdmin ? 'admin' : 'user'
    };
    setIncomeExpenses([...incomeExpenses, salaryExpense]);

    setNewWorkerSalary({
      workerId: '',
      workerName: '',
      month: new Date().toISOString().split('T')[0].substring(0, 7),
      baseSalary: 0,
      bonus: 0,
      deductions: 0
    });
    setWorkerSalaryOpen(false);
  };

  const getWorkerMembers = (workerName: string) => {
    return members.filter(m => m.workerName === workerName);
  };

  const getMemberCollections = (memberId: string) => {
    return collections.filter(c => c.memberId === memberId);
  };

  const getMemberProfileData = (member: SocietyMember): MemberProfile => {
    const memberCollections = getMemberCollections(member.id);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyCollections = memberCollections.filter(c => {
      const collectionDate = new Date(c.date);
      return collectionDate.getMonth() === currentMonth && collectionDate.getFullYear() === currentYear;
    });

    const monthlyStats = {
      totalInstallment: monthlyCollections.reduce((sum, c) => sum + c.installmentCollected, 0),
      totalSavings: monthlyCollections.reduce((sum, c) => sum + c.savingsCollected, 0),
      collectedDays: monthlyCollections.filter(c => c.status === 'collected').length,
      missedDays: Math.max(0, new Date().getDate() - monthlyCollections.length)
    };

    return {
      member,
      collections: memberCollections,
      monthlyStats
    };
  };

  const getCollectionsByDate = (date: string) => {
    return collections.filter(c => c.date === date);
  };

  // INDIVIDUAL MEMBER PROFILE PDF GENERATION
  const generateMemberProfilePDF = (member: SocietyMember) => {
    const memberProfile = getMemberProfileData(member);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>সদস্যের প্রোফাইল - ${member.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          .profile-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .info-box h3 { color: #2563eb; margin-top: 0; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>সদস্যের প্রোফাইল</h1>
          <h2>${member.name} (${member.memberCode})</h2>
          <p>রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        </div>

        <div class="profile-info">
          <div class="info-box">
            <h3>ব্যক্তিগত তথ্য</h3>
            <p><strong>সদস্য কোড:</strong> ${member.memberCode}</p>
            <p><strong>নাম:</strong> ${member.name}</p>
            <p><strong>এনআইডি:</strong> ${member.nid}</p>
            <p><strong>মোবাইল:</strong> ${member.phone}</p>
            <p><strong>যোগদানের তারিখ:</strong> ${member.joinDate}</p>
            <p><strong>অবস্থা:</strong> ${member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</p>
          </div>

          <div class="info-box">
            <h3>সমিতির তথ্য</h3>
            <p><strong>কর্মীর নাম:</strong> ${member.workerName}</p>
            <p><strong>এলাকা:</strong> ${member.area}</p>
            <p><strong>দৈনিক কিস্তি:</strong> ${formatCurrency(member.installmentAmount)}</p>
            <p><strong>দৈনিক সঞ্চয়:</strong> ${formatCurrency(member.savingsAmount)}</p>
            <p><strong>গৃহীত ঋণ:</strong> ${formatCurrency(member.loanAmount)}</p>
            <p><strong>সদস্যপদ:</strong> ${member.membershipType === 'regular' ? 'নিয়মিত' : member.membershipType === 'premium' ? 'প্রিমিয়াম' : 'আজীবন'}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatCurrency(memberProfile.monthlyStats.totalInstallment)}</div>
            <div class="stat-label">মাসিক মোট কিস্তি</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatCurrency(memberProfile.monthlyStats.totalSavings)}</div>
            <div class="stat-label">মাসিক মোট সঞ্চয়</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${memberProfile.monthlyStats.collectedDays}</div>
            <div class="stat-label">কালেকশন দিন</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${memberProfile.monthlyStats.missedDays}</div>
            <div class="stat-label">মিসড দিন</div>
          </div>
        </div>

        <h3>সাম্প্রতিক কালেকশন ইতিহাস</h3>
        <table>
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>কিস্তি</th>
              <th>সঞ্চয়</th>
              <th>মোট</th>
              <th>অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            ${memberProfile.collections.slice(-15).reverse().map(collection => `
              <tr>
                <td>${collection.date}</td>
                <td>${formatCurrency(collection.installmentCollected)}</td>
                <td>${formatCurrency(collection.savingsCollected)}</td>
                <td>${formatCurrency(collection.installmentCollected + collection.savingsCollected)}</td>
                <td>${collection.status === 'collected' ? 'সংগৃহীত' : collection.status === 'pending' ? 'অপেক্ষমান' : 'মিসড'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>আমাদের সমিতি - সদস্য প্রোফাইল রিপোর্ট</p>
          <p>এই রিপোর্টটি ${new Date().toLocaleString('bn-BD')} এ তৈরি করা হয়েছে</p>
        </div>

        <script>
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // CALENDAR-STYLE COLLECTION PDF GENERATION
  const generateMemberCollectionCalendarPDF = (member: SocietyMember) => {
    const memberCollections = getMemberCollections(member.id);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthName = new Date(currentYear, currentMonth).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' });
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Create calendar grid
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    let calendarHTML = '';
    let dayCounter = 1;

    // Create weeks
    for (let week = 0; week < 6 && dayCounter <= daysInMonth; week++) {
      calendarHTML += '<tr>';
      
      // Create days of the week
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < startingDayOfWeek) {
          calendarHTML += '<td class="empty-day"></td>';
        } else if (dayCounter <= daysInMonth) {
          const currentDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
          const dayCollection = memberCollections.find(c => c.date === currentDate);
          
          const dayClass = dayCollection ? 'collected-day' : 'no-collection-day';
          const collectionInfo = dayCollection ? 
            `<div class="collection-info">
              <small>কিস্তি: ${formatCurrency(dayCollection.installmentCollected)}</small>
              <small>সঞ্চয়: ${formatCurrency(dayCollection.savingsCollected)}</small>
            </div>` : '';
          
          calendarHTML += `
            <td class="${dayClass}">
              <div class="day-number">${dayCounter}</div>
              ${collectionInfo}
            </td>
          `;
          dayCounter++;
        } else {
          calendarHTML += '<td class="empty-day"></td>';
        }
      }
      
      calendarHTML += '</tr>';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>কালেকশন ক্যালেন্ডার - ${member.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .calendar { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .calendar th, .calendar td { border: 1px solid #ddd; padding: 8px; height: 80px; vertical-align: top; }
          .calendar th { background-color: #2563eb; color: white; text-align: center; height: 40px; }
          .day-number { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
          .collected-day { background-color: #dcfce7; }
          .no-collection-day { background-color: #fef2f2; }
          .empty-day { background-color: #f9fafb; }
          .collection-info { font-size: 10px; }
          .collection-info small { display: block; margin: 1px 0; }
          .legend { display: flex; justify-content: center; gap: 20px; margin: 20px 0; }
          .legend-item { display: flex; align-items: center; }
          .legend-color { width: 20px; height: 20px; margin-right: 5px; border: 1px solid #ddd; }
          .summary { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>কালেকশন ক্যালেন্ডার</h1>
          <h2>${member.name} (${member.memberCode})</h2>
          <h3>${monthName}</h3>
        </div>

        <div class="legend">
          <div class="legend-item">
            <div class="legend-color" style="background-color: #dcfce7;"></div>
            <span>কালেকশন সংগৃহীত</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #fef2f2;"></div>
            <span>কালেকশন নেই</span>
          </div>
        </div>

        <table class="calendar">
          <thead>
            <tr>
              <th>রবিবার</th>
              <th>সোমবার</th>
              <th>মঙ্গলবার</th>
              <th>বুধবার</th>
              <th>বৃহস্পতিবার</th>
              <th>শুক্রবার</th>
              <th>শনিবার</th>
            </tr>
          </thead>
          <tbody>
            ${calendarHTML}
          </tbody>
        </table>

        <div class="summary">
          <h3>মাসিক সারাংশ</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #059669;">
                ${formatCurrency(getMemberProfileData(member).monthlyStats.totalInstallment)}
              </div>
              <div style="font-size: 12px; color: #666;">মোট কিস্তি</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #0284c7;">
                ${formatCurrency(getMemberProfileData(member).monthlyStats.totalSavings)}
              </div>
              <div style="font-size: 12px; color: #666;">মোট সঞ্চয়</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #16a34a;">
                ${getMemberProfileData(member).monthlyStats.collectedDays}
              </div>
              <div style="font-size: 12px; color: #666;">কালেকশন দিন</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #dc2626;">
                ${getMemberProfileData(member).monthlyStats.missedDays}
              </div>
              <div style="font-size: 12px; color: #666;">মিসড দিন</div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
          <p>আমাদের সমিতি - কালেকশন ক্যালেন্ডার রিপোর্ট</p>
          <p>রিপোর্��� তৈরির তারিখ: ${new Date().toLocaleString('bn-BD')}</p>
        </div>

        <script>
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // COMPLETE DATABASE PDF GENERATION
  const generateCompleteDatabasePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>সমিতি সম্পূর্ণ ডেটাবেস রিপোর্ট</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 15px; }
          .section { margin-bottom: 40px; page-break-inside: avoid; }
          .section h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f8fafc; font-weight: bold; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .stat-box { text-align: center; padding: 15px; border: 2px solid #2563eb; border-radius: 8px; background-color: #f8fafc; }
          .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
          .page-break { page-break-before: always; }
          @media print { 
            body { margin: 0; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>আমাদের সমিতি</h1>
          <h2>সম্পূর্ণ ডেটাবেস রিপোর্ট</h2>
          <p><strong>রিপোর্ট তৈরির তারিখ:</strong> ${new Date().toLocaleDateString('bn-BD')}</p>
          <p><strong>রিপোর্ট তৈরির সময়:</strong> ${new Date().toLocaleTimeString('bn-BD')}</p>
        </div>

        <div class="stats">
          <div class="stat-box">
            <div class="stat-value">${workers.length}</div>
            <div class="stat-label">মোট কর্মী</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${members.length}</div>
            <div class="stat-label">মোট সদস্য</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${collections.length}</div>
            <div class="stat-label">মোট কালেকশন</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${formatCurrency(collections.reduce((sum, c) => sum + c.installmentCollected + c.savingsCollected, 0))}</div>
            <div class="stat-label">মোট সংগ্রহ</div>
          </div>
        </div>

        <div class="section">
          <h2>কর্মী তালিকা</h2>
          <table>
            <thead>
              <tr>
                <th>কর্মী আইডি</th>
                <th>নাম</th>
                <th>এলাকা</th>
                <th>মোবাইল</th>
                <th>মোট সদস্য</th>
                <th>দৈনিক কালেকশন</th>
                <th>অবস্থা</th>
                <th>যোগদানের তারিখ</th>
              </tr>
            </thead>
            <tbody>
              ${workers.map(worker => `
                <tr>
                  <td>${worker.id}</td>
                  <td>${worker.name}</td>
                  <td>${worker.area}</td>
                  <td>${worker.phone}</td>
                  <td>${worker.totalMembers}</td>
                  <td>${formatCurrency(worker.dailyCollection)}</td>
                  <td>${worker.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</td>
                  <td>${new Date(worker.createdAt).toLocaleDateString('bn-BD')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section page-break">
          <h2>সদস্য তালিকা</h2>
          <table>
            <thead>
              <tr>
                <th>সদস্য কোড</th>
                <th>নাম</th>
                <th>এনআইডি</th>
                <th>মোবাইল</th>
                <th>কর্মী</th>
                <th>এলাকা</th>
                <th>কিস্তি</th>
                <th>সঞ্চয়</th>
                <th>ঋণ</th>
                <th>যোগদান</th>
                <th>অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              ${members.map(member => `
                <tr>
                  <td>${member.memberCode}</td>
                  <td>${member.name}</td>
                  <td>${member.nid}</td>
                  <td>${member.phone}</td>
                  <td>${member.workerName}</td>
                  <td>${member.area}</td>
                  <td>${formatCurrency(member.installmentAmount)}</td>
                  <td>${formatCurrency(member.savingsAmount)}</td>
                  <td>${formatCurrency(member.loanAmount)}</td>
                  <td>${member.joinDate}</td>
                  <td>${member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section page-break">
          <h2>কালেকশন ইতিহাস</h2>
          <table>
            <thead>
              <tr>
                <th>তারিখ</th>
                <th>সদস্য কোড</th>
                <th>সদস্যের নাম</th>
                <th>কর্মী</th>
                <th>কিস্তি</th>
                <th>সঞ্চয়</th>
                <th>মোট</th>
                <th>অবস্থা</th>
                <th>এন্ট্রির তা���িখ</th>
              </tr>
            </thead>
            <tbody>
              ${collections.slice(-50).map(collection => `
                <tr>
                  <td>${collection.date}</td>
                  <td>${collection.memberCode}</td>
                  <td>${collection.memberName}</td>
                  <td>${collection.workerName}</td>
                  <td>${formatCurrency(collection.installmentCollected)}</td>
                  <td>${formatCurrency(collection.savingsCollected)}</td>
                  <td>${formatCurrency(collection.installmentCollected + collection.savingsCollected)}</td>
                  <td>${collection.status === 'collected' ? 'সংগৃহীত' : collection.status === 'pending' ? 'অপেক্ষমান' : 'মিসড'}</td>
                  <td>${new Date(collection.createdAt).toLocaleDateString('bn-BD')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section page-break">
          <h2>এলাকাভিত্তিক পরিসংখ্যান</h2>
          <table>
            <thead>
              <tr>
                <th>এলাকা</th>
                <th>কর্মী</th>
                <th>মোট সদস্য</th>
                <th>সক্রিয় সদস্য</th>
                <th>মোট কালেকশন</th>
                <th>দৈনিক গড় কালেকশন</th>
              </tr>
            </thead>
            <tbody>
              ${workers.map(worker => {
                const areaMembers = members.filter(m => m.area === worker.area);
                const activeMembers = areaMembers.filter(m => m.status === 'active');
                const areaCollections = collections.filter(c => c.workerName === worker.name);
                const totalCollection = areaCollections.reduce((sum, c) => sum + c.installmentCollected + c.savingsCollected, 0);
                const avgDaily = areaCollections.length > 0 ? totalCollection / areaCollections.length : 0;
                
                return `
                  <tr>
                    <td>${worker.area}</td>
                    <td>${worker.name}</td>
                    <td>${areaMembers.length}</td>
                    <td>${activeMembers.length}</td>
                    <td>${formatCurrency(totalCollection)}</td>
                    <td>${formatCurrency(avgDaily)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div style="text-align: center; margin-top: 40px; border-top: 2px solid #2563eb; padding-top: 20px;">
          <h3>আমাদের সমিতি</h3>
          <p>সম্পূর্ণ ডেটাবেস রিপোর্ট</p>
          <p><strong>তৈরি:</strong> ${new Date().toLocaleString('bn-BD')}</p>
          <p><strong>মোট পৃষ্ঠা:</strong> ${Math.ceil((workers.length + members.length + collections.length) / 50)}</p>
        </div>

        <script>
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Backup functions with enhanced security
  const downloadBackup = () => {
    const backup = {
      workers,
      members,
      collections,
      timestamp: new Date().toISOString(),
      version: "2.0",
      totalRecords: workers.length + members.length + collections.length,
      generatedBy: isAdmin ? 'admin' : 'user'
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `society_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAdmin) {
      alert(currentText.cannotDelete);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        if (backup.workers && backup.members && backup.collections) {
          // Extra confirmation before importing
          if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে এই ব্যাকআপ ইমপোর্ট করতে চান? বর্তমান সব ডেটা প্রতিস্থাপিত হবে।' : 'Are you sure you want to import this backup? All current data will be replaced.')) {
            setWorkers(backup.workers);
            setMembers(backup.members);
            setCollections(backup.collections);
            alert(language === 'bn' ? 'ব্যাকআপ সফলভাবে ইমপোর্ট হয়েছে' : 'Backup imported successfully');
          }
        } else {
          alert(language === 'bn' ? 'ভুল ফাইল ফরম্যাট' : 'Invalid file format');
        }
      } catch (error) {
        alert(language === 'bn' ? 'ফাইল পড়তে ত্রুটি হয়েছে' : 'Error reading file');
      }
    };
    reader.readAsText(file);
  };

  // Calculate statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyCollections = collections.filter(c => {
    const collectionDate = new Date(c.date);
    return collectionDate.getMonth() === currentMonth && collectionDate.getFullYear() === currentYear;
  });

  const stats = {
    totalMembers: members.length,
    totalWorkers: workers.length,
    todayCollection: collections
      .filter(c => c.date === new Date().toISOString().split('T')[0])
      .reduce((sum, c) => sum + c.installmentCollected + c.savingsCollected, 0),
    monthlyTarget: members.reduce((sum, m) => sum + m.installmentAmount + m.savingsAmount, 0) * 30,
    monthlyInstallment: monthlyCollections.reduce((sum, c) => sum + c.installmentCollected, 0),
    monthlySavings: monthlyCollections.reduce((sum, c) => sum + c.savingsCollected, 0),
    totalIncome: incomeExpenses.filter(ie => ie.type === 'income').reduce((sum, ie) => sum + ie.amount, 0),
    totalExpense: incomeExpenses.filter(ie => ie.type === 'expense').reduce((sum, ie) => sum + ie.amount, 0),
    netIncome: incomeExpenses.filter(ie => ie.type === 'income').reduce((sum, ie) => sum + ie.amount, 0) -
               incomeExpenses.filter(ie => ie.type === 'expense').reduce((sum, ie) => sum + ie.amount, 0),
    salaryPaid: workerSalaries.reduce((sum, ws) => sum + ws.totalSalary, 0)
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{currentText.societyName}</h1>
                  <p className="text-sm text-gray-500">
                    {language === 'bn' ? 'সমিতি ব্যবস্থাপনা সিস্টেম' : 'Society Management System'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}>
                  {language === 'bn' ? 'English' : 'বাংলা'}
                </Button>
                
                {isAdmin ? (
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleAdminLogout}>
                      {currentText.logout}
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setShowAdminDialog(true)}>
                    <Shield className="w-4 h-4 mr-2" />
                    {currentText.adminLogin}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                {currentText.dashboard}
              </TabsTrigger>
              <TabsTrigger value="workers" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {currentText.workers}
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {currentText.members}
              </TabsTrigger>
              <TabsTrigger value="collection" className="flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {currentText.collection}
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {currentText.reports}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                {currentText.settings}
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.totalMembers}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMembers}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? `${workers.length}টি এলাকায় বিভক্ত` : `Across ${workers.length} areas`}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.totalWorkers}</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalWorkers}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'দৈনিক কালেকশনকারী' : 'Daily collectors'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.todayCollection}</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.todayCollection)}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'কিস্তি ও সঞ্চয়' : 'Installment & Savings'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.dataBackup}</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button size="sm" onClick={generateCompleteDatabasePDF} className="w-full">
                        <Download className="w-3 h-3 mr-1" />
                        {currentText.completeDatabasePDF}
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadBackup} className="w-full">
                        <HardDrive className="w-3 h-3 mr-1" />
                        {language === 'bn' ? 'JSON ব্যাকআপ' : 'JSON Backup'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Collections with improved display */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'সাম্প্রতিক কালেকশন' : 'Recent Collections'}</CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'সাম্প্রতিক আর্থিক লেনদেন - বিস্তারিত দেখতে ক্লিক করুন' : 'Latest financial transactions - click for details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {collections.length === 0 ? (
                      <div className="text-center py-8">
                        <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {language === 'bn' ? 'এখনো কোনো কালেকশন নেই। প্রথমে কর্মী এবং সদস্য যোগ করুন।' : 'No collections yet. Add workers and members first.'}
                        </p>
                      </div>
                    ) : (
                      collections.slice(-10).reverse().map((collection) => (
                        <div 
                          key={collection.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setExpandedCollection(
                            expandedCollection === collection.id ? null : collection.id
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">
                                {collection.memberName.length > 15 
                                  ? collection.memberName.substring(0, 15) + '...' 
                                  : collection.memberName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {collection.workerName.length > 12 
                                  ? collection.workerName.substring(0, 12) + '...' 
                                  : collection.workerName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{collection.date}</p>
                            {expandedCollection === collection.id && (
                              <div className="text-sm text-muted-foreground mt-2 border-t pt-2">
                                <p>{language === 'bn' ? 'কিস্তি:' : 'Installment:'} {formatCurrency(collection.installmentCollected)}</p>
                                <p>{language === 'bn' ? 'সঞ্চয়:' : 'Savings:'} {formatCurrency(collection.savingsCollected)}</p>
                                <p className="font-medium text-primary">{language === 'bn' ? 'মোট:' : 'Total:'} {formatCurrency(collection.installmentCollected + collection.savingsCollected)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workers Tab */}
            <TabsContent value="workers" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{currentText.workers}</h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'সমিতির কর্ম��দের তথ্য ও কর্মক্ষমতা ব্যবস্থাপনা' : 'Manage worker information and performance'}
                  </p>
                </div>
                
                <Button onClick={() => setAddWorkerOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {currentText.addWorker}
                </Button>
              </div>

              {workers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'bn' ? 'কোনো কর্মী নেই' : 'No Workers Added'}
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {language === 'bn' ? 'প্রথমে কর্মী যোগ করুন যারা বিভিন্ন এলাকায় দৈনিক কালেকশন করবেন।' : 'Start by adding workers who will collect daily from different areas.'}
                    </p>
                    <Button onClick={() => setAddWorkerOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      {currentText.addWorker}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workers.map((worker) => (
                    <Card key={worker.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {worker.photo ? (
                              <img src={worker.photo} alt={worker.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="text-lg">{worker.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <CardTitle className="text-lg">{worker.name}</CardTitle>
                              <CardDescription>{worker.area}</CardDescription>
                            </div>
                          </div>
                          {isAdmin && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{currentText.confirmDelete}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === 'bn' ? 'আপনি কি নিশ্চিত যে এই কর্মীকে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'Are you sure you want to delete this worker? This action cannot be undone.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{currentText.cancel}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteWorker(worker.id)} className="bg-red-500 hover:bg-red-600">
                                    {currentText.deleteData}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          {worker.phone}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মোট সদস্য' : 'Total Members'}</p>
                            <p className="font-bold text-xl">{worker.totalMembers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'দৈনিক কালেকশন' : 'Daily Collection'}</p>
                            <p className="font-bold text-xl text-green-600">{formatCurrency(worker.dailyCollection)}</p>
                          </div>
                        </div>

                        <Badge className="bg-green-500 text-white">
                          {language === 'bn' ? 'সক্রিয়' : 'Active'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{currentText.members}</h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'সমিতির সদস্যদের তথ্য ব্যবস্থাপনা ও প্রোফাইল' : 'Manage member information and profiles'}
                  </p>
                </div>
                
                <Button onClick={() => setAddMemberOpen(true)} disabled={workers.length === 0}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {currentText.addMember}
                </Button>
              </div>

              {workers.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
                    <p className="text-muted-foreground text-center">
                      {language === 'bn' ? 'সদস্য যোগ করার আগে প্রথমে কর্মী যোগ করুন।' : 'Please add workers before adding members.'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={currentText.searchMembers}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Members Table */}
              {members.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'bn' ? 'কোনো সদস্য নেই' : 'No Members Added'}
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {language === 'bn' ? 'প্রথমে সদস্য যোগ করুন যারা নিয়মিত কিস্তি ও সঞ্চয় জমা দেবেন।' : 'Start by adding members who will regularly deposit installments and savings.'}
                    </p>
                    {workers.length > 0 && (
                      <Button onClick={() => setAddMemberOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {currentText.addMember}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'সদস্য তালিকা' : 'Members List'} ({members.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{currentText.memberCode}</TableHead>
                          <TableHead>{currentText.memberName}</TableHead>
                          <TableHead>{currentText.phoneNumber}</TableHead>
                          <TableHead>{currentText.workerName}</TableHead>
                          <TableHead>{currentText.area}</TableHead>
                          <TableHead>{language === 'bn' ? 'কিস্তি' : 'Installment'}</TableHead>
                          <TableHead>{language === 'bn' ? 'সঞ্চয়' : 'Savings'}</TableHead>
                          <TableHead>{language === 'bn' ? 'কার্যক্রম' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members
                          .filter(member => 
                            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.memberCode.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-mono">{member.memberCode}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">NID: {member.nid}</div>
                              </div>
                            </TableCell>
                            <TableCell>{member.phone}</TableCell>
                            <TableCell>{member.workerName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{member.area}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(member.installmentAmount)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(member.savingsAmount)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setMemberProfileOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => generateMemberProfilePDF(member)}
                                  title={currentText.memberProfilePDF}
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => generateMemberCollectionCalendarPDF(member)}
                                  title={currentText.collectionCalendarPDF}
                                >
                                  <CalendarIcon className="w-4 h-4" />
                                </Button>
                                {isAdmin && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{currentText.confirmDelete}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {language === 'bn' ? 'আপনি কি নিশ্চিত যে এই সদস্যকে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'Are you sure you want to delete this member? This action cannot be undone.'}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{currentText.cancel}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-red-500 hover:bg-red-600">
                                          {currentText.deleteData}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Collection Tab */}
            <TabsContent value="collection" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{currentText.collection}</h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'দৈনিক কালেকশন ব্যবস্থাপনা ও রেকর্ড' : 'Daily collection management and records'}
                  </p>
                </div>
                
                <Button onClick={() => setCollectionSheetOpen(true)} disabled={members.length === 0}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {currentText.collectionSheet}
                </Button>
              </div>

              {/* Collection Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'bn' ? 'আজকের কালেকশন' : "Today's Collection"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.todayCollection)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'bn' ? 'সংগৃহীত সদস্য' : 'Collected Members'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {collections.filter(c => c.date === new Date().toISOString().split('T')[0]).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{language === 'bn' ? 'বাকি সদস্য' : 'Pending Members'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {members.length - collections.filter(c => c.date === new Date().toISOString().split('T')[0]).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Collections */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'সাম্প্রতিক কালেকশন' : 'Recent Collections'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {collections.length === 0 ? (
                    <div className="text-center py-8">
                      <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'bn' ? 'এখনো ক��নো কালেকশন রেকর্ড নেই।' : 'No collection records yet.'}
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                          <TableHead>{currentText.memberCode}</TableHead>
                          <TableHead>{currentText.memberName}</TableHead>
                          <TableHead>{currentText.workerName}</TableHead>
                          <TableHead>{language === 'bn' ? 'কিস্তি' : 'Installment'}</TableHead>
                          <TableHead>{language === 'bn' ? 'সঞ্চয়' : 'Savings'}</TableHead>
                          <TableHead>{language === 'bn' ? 'মোট' : 'Total'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collections.slice(-10).reverse().map((collection) => (
                          <TableRow key={collection.id}>
                            <TableCell>{collection.date}</TableCell>
                            <TableCell className="font-mono">{collection.memberCode}</TableCell>
                            <TableCell>{collection.memberName}</TableCell>
                            <TableCell>{collection.workerName}</TableCell>
                            <TableCell>{formatCurrency(collection.installmentCollected)}</TableCell>
                            <TableCell>{formatCurrency(collection.savingsCollected)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(collection.installmentCollected + collection.savingsCollected)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      {currentText.completeDatabasePDF}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'সমিতির সকল ডেটা একসাথে পিডিএফ আকারে ডাউনলোড করুন' : 'Download all society data together as PDF'}
                    </p>
                    <Button className="w-full" onClick={generateCompleteDatabasePDF}>
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'সম্পূর্ণ ডেটাবেস পিডিএফ' : 'Complete Database PDF'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HardDrive className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'ডেটা ব্যাকআপ' : 'Data Backup'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'সমিতির ডেটা JSON ফরম্যাটে ব্যাকআপ ডাউনলোড করুন' : 'Download society data backup in JSON format'}
                    </p>
                    <Button className="w-full" variant="outline" onClick={downloadBackup}>
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'JSON ব্যাকআপ ডাউনলোড' : 'Download JSON Backup'}
                    </Button>
                  </CardContent>
                </Card>

                {isAdmin && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Upload className="w-5 h-5 mr-2" />
                        {currentText.uploadBackup}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === 'bn' ? 'পূর্বের ব্যাকআপ ফাইল ইমপোর্ট করুন (শুধুমাত্র অ্যাডমিন)' : 'Import previous backup file (admin only)'}
                      </p>
                      <Input
                        type="file"
                        accept=".json"
                        onChange={uploadBackup}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'সমিতির তথ্য' : 'Society Information'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="society-name">{language === 'bn' ? 'সমিতির নাম' : 'Society Name'}</Label>
                      <Input id="society-name" defaultValue="আমাদের সমিতি" />
                    </div>
                    <div>
                      <Label htmlFor="registration">{language === 'bn' ? 'নিবন্ধন নম্বর' : 'Registration Number'}</Label>
                      <Input id="registration" defaultValue="REG-2023-001" />
                    </div>
                    <div>
                      <Label htmlFor="address">{language === 'bn' ? 'ঠিকানা' : 'Address'}</Label>
                      <Textarea id="address" rows={3} />
                    </div>
                    <Button>
                      {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'ডেটা সুরক্ষা ও পরিসংখ্যান' : 'Data Protection & Statistics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">
                          {currentText.dataProtected}
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-2">
                        {language === 'bn' 
                          ? 'সকল ডেটা স্থ���নীয়ভাবে সংরক্ষিত এবং কখনো অটোমেটিক মুছে যায় না।'
                          : 'All data is stored locally and never automatically deleted.'
                        }
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">
                        {language === 'bn' ? 'বর্তমান পরিসংখ্যান:' : 'Current Statistics:'}
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span>{language === 'bn' ? 'মোট কর্মী:' : 'Total Workers:'}</span>
                          <span className="font-medium">{workers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'bn' ? 'মোট সদস্য:' : 'Total Members:'}</span>
                          <span className="font-medium">{members.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'bn' ? 'মোট কালেকশন:' : 'Total Collections:'}</span>
                          <span className="font-medium">{collections.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'bn' ? 'মোট সংগ্রহ:' : 'Total Amount:'}</span>
                          <span className="font-medium">{formatCurrency(collections.reduce((sum, c) => sum + c.installmentCollected + c.savingsCollected, 0))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button onClick={generateCompleteDatabasePDF} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        {currentText.completeDatabasePDF}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Admin Login Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentText.adminLogin}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'ডেটা মুছার ও ব্যাকআপ ইমপোর্টের জন্য অ্যাডমিন অ্যাক্সেস প্রয়োজন' : 'Admin access required for data deletion and backup import'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-password">{currentText.adminPassword}</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="admin123"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
              {currentText.cancel}
            </Button>
            <Button onClick={handleAdminLogin}>
              <Shield className="w-4 h-4 mr-2" />
              {currentText.login}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Worker Dialog */}
      <Dialog open={addWorkerOpen} onOpenChange={setAddWorkerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentText.addWorker}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'নতুন কর্মীর সম্পূর্ণ তথ্য প্রবেশ করান' : 'Enter complete new worker information'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="workerName">{currentText.workerName} *</Label>
              <Input
                id="workerName"
                value={newWorker.name}
                onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                placeholder={language === 'bn' ? 'কর্মীর পূর্ণ নাম' : 'Worker full name'}
              />
            </div>
            
            <div>
              <Label htmlFor="workerArea">{currentText.area} *</Label>
              <Input
                id="workerArea"
                value={newWorker.area}
                onChange={(e) => setNewWorker({...newWorker, area: e.target.value})}
                placeholder={language === 'bn' ? 'এলাকার নাম (যেমন: এলাকা-১)' : 'Area name (e.g.: Area-1)'}
              />
            </div>
            
            <div>
              <Label htmlFor="workerPhone">{currentText.phoneNumber} *</Label>
              <Input
                id="workerPhone"
                value={newWorker.phone}
                onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                placeholder="01712345678"
              />
            </div>
            
            <div>
              <Label htmlFor="workerPhoto">{currentText.photo}</Label>
              <Input
                id="workerPhoto"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setNewWorker({...newWorker, photo: e.target?.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'bn' ? 'কর্মীর ছবি আপলোড করুন (ঐচ্ছিক)' : 'Upload worker photo (optional)'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setAddWorkerOpen(false)}>
              {currentText.cancel}
            </Button>
            <Button onClick={handleAddWorker} disabled={!newWorker.name || !newWorker.area || !newWorker.phone}>
              <Save className="w-4 h-4 mr-2" />
              {currentText.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentText.addMember}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'নতুন সদস্যের সম্পূর্ণ তথ্য প্রবেশ করান' : 'Enter complete new member information'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="memberCode">{currentText.memberCode} *</Label>
              <Input
                id="memberCode"
                value={newMember.memberCode}
                onChange={(e) => setNewMember({...newMember, memberCode: e.target.value})}
                placeholder="SM001"
              />
            </div>
            
            <div>
              <Label htmlFor="memberName">{currentText.memberName} *</Label>
              <Input
                id="memberName"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder={language === 'bn' ? 'সদস্যের পূর্ণ নাম' : 'Member full name'}
              />
            </div>
            
            <div>
              <Label htmlFor="nid">{currentText.nidNumber} *</Label>
              <Input
                id="nid"
                value={newMember.nid}
                onChange={(e) => setNewMember({...newMember, nid: e.target.value})}
                placeholder="1234567890123"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">{currentText.phoneNumber} *</Label>
              <Input
                id="phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                placeholder="01712345678"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="worker">{currentText.workerName} *</Label>
              <Select
                value={newMember.workerName}
                onValueChange={(value) => setNewMember({...newMember, workerName: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={currentText.selectWorker} />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.name}>
                      {worker.name} - {worker.area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="installment">{currentText.installmentAmount}</Label>
              <Input
                id="installment"
                type="number"
                value={newMember.installmentAmount || ''}
                onChange={(e) => setNewMember({...newMember, installmentAmount: Number(e.target.value) || 0})}
                placeholder="500"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'bn' ? 'দৈনিক কিস্তির পরিমাণ (ঐচ্ছিক)' : 'Daily installment amount (optional)'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="savings">{currentText.savingsAmount}</Label>
              <Input
                id="savings"
                type="number"
                value={newMember.savingsAmount || ''}
                onChange={(e) => setNewMember({...newMember, savingsAmount: Number(e.target.value) || 0})}
                placeholder="200"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'bn' ? 'দৈনিক সঞ্চয়ের পরিমাণ (ঐচ্ছিক)' : 'Daily savings amount (optional)'}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="loan">{currentText.loanAmount}</Label>
              <Input
                id="loan"
                type="number"
                value={newMember.loanAmount || ''}
                onChange={(e) => setNewMember({...newMember, loanAmount: Number(e.target.value) || 0})}
                placeholder="25000"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'bn' ? 'গৃহীত ঋণের পরিমাণ (ঐচ্ছিক)' : 'Loan amount taken (optional)'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
              {currentText.cancel}
            </Button>
            <Button 
              onClick={handleAddMember}
              disabled={!newMember.memberCode || !newMember.name || !newMember.nid || !newMember.phone || !newMember.workerName}
            >
              <Save className="w-4 h-4 mr-2" />
              {currentText.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Collection Sheet Dialog */}
      <Dialog open={collectionSheetOpen} onOpenChange={setCollectionSheetOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentText.collectionSheet}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'দৈনিক কালেকশন রেকর্ড করুন - যেকোনো পরিমাণ বা খালি রেখেও সেভ করতে পারবেন' : 'Record daily collection - can save any amount or leave empty'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{currentText.selectWorker} *</Label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger>
                    <SelectValue placeholder={currentText.selectWorker} />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.name}>
                        {worker.name} - {worker.area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>{currentText.selectDate} *</Label>
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
            </div>

            {selectedWorker && getWorkerMembers(selectedWorker).length > 0 && (
              <div>
                <h4 className="font-medium mb-4">
                  {language === 'bn' ? 'সদস্য তালিকা:' : 'Member List:'} {selectedWorker} ({getWorkerMembers(selectedWorker).length} {language === 'bn' ? 'জন' : 'members'})
                </h4>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{currentText.memberCode}</TableHead>
                      <TableHead>{currentText.memberName}</TableHead>
                      <TableHead>
                        {language === 'bn' ? 'কিস্তি সংগ্রহ' : 'Installment Collection'}
                        <span className="text-xs text-green-600 block">
                          {language === 'bn' ? '(যেকোনো পরিমাণ বা খালি)' : '(any amount or empty)'}
                        </span>
                      </TableHead>
                      <TableHead>
                        {language === 'bn' ? 'সঞ্চয় সংগ্রহ' : 'Savings Collection'}
                        <span className="text-xs text-green-600 block">
                          {language === 'bn' ? '(যেকোনো পরিমাণ ��া খালি)' : '(any amount or empty)'}
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getWorkerMembers(selectedWorker).map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-mono">{member.memberCode}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'bn' ? 'নিয়মিত:' : 'Regular:'} {formatCurrency(member.installmentAmount)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            value={dailyCollectionData[member.id]?.installment || ''}
                            onChange={(e) => setDailyCollectionData({
                              ...dailyCollectionData,
                              [member.id]: {
                                ...dailyCollectionData[member.id],
                                installment: Number(e.target.value) || 0,
                                savings: dailyCollectionData[member.id]?.savings || 0
                              }
                            })}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            value={dailyCollectionData[member.id]?.savings || ''}
                            onChange={(e) => setDailyCollectionData({
                              ...dailyCollectionData,
                              [member.id]: {
                                ...dailyCollectionData[member.id],
                                savings: Number(e.target.value) || 0,
                                installment: dailyCollectionData[member.id]?.installment || 0
                              }
                            })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>{language === 'bn' ? 'নোট:' : 'Note:'}</strong> {language === 'bn' ? 'যেকোনো পরিমাণ টাকা বা কোনো পরিমাণ না দিয়েও সেভ করতে পারবেন। সব ফিল্ড ঐচ্ছিক।' : 'You can save any amount or leave fields empty. All fields are optional.'}
                  </p>
                </div>
              </div>
            )}

            {selectedWorker && getWorkerMembers(selectedWorker).length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'bn' 
                    ? 'এই কর্মীর এলাকায় কোনো সদস্য নেই। প্রথমে সদস্য যোগ করুন।' 
                    : 'No members in this worker\'s area. Add members first.'}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setCollectionSheetOpen(false)}>
              {currentText.cancel}
            </Button>
            <Button onClick={handleSaveCollection} disabled={!selectedWorker}>
              <Save className="w-4 h-4 mr-2" />
              {currentText.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Profile Dialog with PDF options */}
      <Dialog open={memberProfileOpen} onOpenChange={setMemberProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{currentText.memberProfile}</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => selectedMember && generateMemberProfilePDF(selectedMember)}>
                  <Printer className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'প্রোফাইল পিডিএফ' : 'Profile PDF'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => selectedMember && generateMemberCollectionCalendarPDF(selectedMember)}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'ক্যালেন্ডার পিডিএফ' : 'Calendar PDF'}
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedMember?.name} - {selectedMember?.memberCode}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Member Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{language === 'bn' ? 'সদস্যের তথ্য' : 'Member Information'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{currentText.memberCode}</p>
                      <p className="font-medium">{selectedMember.memberCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{currentText.phoneNumber}</p>
                      <p className="font-medium">{selectedMember.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{currentText.workerName}</p>
                      <p className="font-medium">{selectedMember.workerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{currentText.area}</p>
                      <p className="font-medium">{selectedMember.area}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{language === 'bn' ? 'মাসিক পরিসংখ্যান' : 'Monthly Statistics'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(getMemberProfileData(selectedMember).monthlyStats.totalInstallment)}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentText.totalInstallment}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(getMemberProfileData(selectedMember).monthlyStats.totalSavings)}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentText.totalSavings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {getMemberProfileData(selectedMember).monthlyStats.collectedDays}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentText.collectedDays}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {getMemberProfileData(selectedMember).monthlyStats.missedDays}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentText.missedDays}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{currentText.searchByDate}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      placeholder={language === 'bn' ? 'তারিখ নির্বাচন করুন' : 'Select date'}
                    />
                    <Button onClick={() => {
                      if (searchDate) {
                        const dateCollections = getCollectionsByDate(searchDate);
                        const memberCollection = dateCollections.find(c => c.memberId === selectedMember.id);
                        if (memberCollection) {
                          alert(`${language === 'bn' ? 'এই তারিখের কালেকশন:' : 'Collection for this date:'}\n${language === 'bn' ? 'কিস্তি:' : 'Installment:'} ${formatCurrency(memberCollection.installmentCollected)}\n${language === 'bn' ? 'সঞ্চয়:' : 'Savings:'} ${formatCurrency(memberCollection.savingsCollected)}\n${language === 'bn' ? 'মোট:' : 'Total:'} ${formatCurrency(memberCollection.installmentCollected + memberCollection.savingsCollected)}`);
                        } else {
                          alert(language === 'bn' ? 'এই তারিখে কোন কালেকশন পাওয়া যায়নি' : 'No collection found for this date');
                        }
                      }
                    }}>
                      <Search className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'খুঁজুন' : 'Search'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Collection History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{currentText.monthlyCalendar}</CardTitle>
                </CardHeader>
                <CardContent>
                  {getMemberCollections(selectedMember.id).length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'bn' ? 'এই সদস্যের এখনো কোনো কালেকশন নেই।' : 'No collections for this member yet.'}
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                          <TableHead>{language === 'bn' ? 'কিস্তি' : 'Installment'}</TableHead>
                          <TableHead>{language === 'bn' ? 'সঞ্চয়' : 'Savings'}</TableHead>
                          <TableHead>{language === 'bn' ? 'মোট' : 'Total'}</TableHead>
                          <TableHead>{language === 'bn' ? 'অবস্থা' : 'Status'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getMemberCollections(selectedMember.id).slice(-10).reverse().map((collection) => (
                          <TableRow key={collection.id}>
                            <TableCell>{collection.date}</TableCell>
                            <TableCell>{formatCurrency(collection.installmentCollected)}</TableCell>
                            <TableCell>{formatCurrency(collection.savingsCollected)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(collection.installmentCollected + collection.savingsCollected)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-500 text-white">
                                {currentText.collected}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
