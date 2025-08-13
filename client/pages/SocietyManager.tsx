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
  FileSpreadsheet
} from "lucide-react";

interface Worker {
  id: string;
  name: string;
  area: string;
  phone: string;
  totalMembers: number;
  dailyCollection: number;
  status: 'active' | 'inactive';
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

export default function SocietyManager() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [collections, setCollections] = useState<DailyCollection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<SocietyMember | null>(null);
  const [memberProfileOpen, setMemberProfileOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [collectionSheetOpen, setCollectionSheetOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState<string>("");

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

  // Collection form state
  const [dailyCollectionData, setDailyCollectionData] = useState<Record<string, {
    installment: number;
    savings: number;
  }>>({});

  // Load mock data
  useEffect(() => {
    // Mock workers data
    const mockWorkers: Worker[] = [
      {
        id: 'W001',
        name: 'করিম উদ্দিন',
        area: 'এলাকা-১',
        phone: '01711111111',
        totalMembers: 100,
        dailyCollection: 25000,
        status: 'active'
      },
      {
        id: 'W002',
        name: 'রহিম আলী',
        area: 'এলাকা-২',
        phone: '01722222222',
        totalMembers: 98,
        dailyCollection: 23500,
        status: 'active'
      },
      {
        id: 'W003',
        name: 'আব্দুল হক',
        area: 'এলাকা-৩',
        phone: '01733333333',
        totalMembers: 102,
        dailyCollection: 26000,
        status: 'active'
      },
      {
        id: 'W004',
        name: 'মোঃ সালাম',
        area: 'এলাকা-৪',
        phone: '01744444444',
        totalMembers: 95,
        dailyCollection: 22800,
        status: 'active'
      },
      {
        id: 'W005',
        name: 'নুরুল ইসলাম',
        area: 'এলাকা-৫',
        phone: '01755555555',
        totalMembers: 105,
        dailyCollection: 27200,
        status: 'active'
      }
    ];

    // Mock members data
    const mockMembers: SocietyMember[] = [
      {
        id: 'M001',
        memberCode: 'SM001',
        name: 'মোহাম্মদ আলী',
        nid: '1234567890123',
        phone: '01712345678',
        workerName: 'করিম উদ্দিন',
        area: 'এলাকা-১',
        installmentAmount: 500,
        savingsAmount: 200,
        loanAmount: 25000,
        joinDate: '2023-01-15',
        status: 'active',
        membershipType: 'regular'
      },
      {
        id: 'M002',
        memberCode: 'SM002',
        name: 'ফাতেমা খাতুন',
        nid: '9876543210987',
        phone: '01987654321',
        workerName: 'রহিম আলী',
        area: 'এলাকা-২',
        installmentAmount: 300,
        savingsAmount: 150,
        loanAmount: 15000,
        joinDate: '2023-03-20',
        status: 'active',
        membershipType: 'regular'
      },
      {
        id: 'M003',
        memberCode: 'SM003',
        name: 'রহিম উদ্দিন',
        nid: '5555666777888',
        phone: '01555666777',
        workerName: 'আব্দুল হক',
        area: 'এলাকা-৩',
        installmentAmount: 600,
        savingsAmount: 250,
        loanAmount: 35000,
        joinDate: '2023-06-10',
        status: 'active',
        membershipType: 'premium'
      }
    ];

    // Mock collections data
    const mockCollections: DailyCollection[] = [
      {
        id: 'C001',
        memberId: 'M001',
        memberCode: 'SM001',
        memberName: 'মোহাম্মদ আলী',
        workerName: 'কর���ম উদ্দিন',
        date: '2024-01-15',
        installmentCollected: 500,
        savingsCollected: 200,
        status: 'collected'
      },
      {
        id: 'C002',
        memberId: 'M002',
        memberCode: 'SM002',
        memberName: 'ফাতেমা খাতুন',
        workerName: 'রহিম আলী',
        date: '2024-01-15',
        installmentCollected: 300,
        savingsCollected: 150,
        status: 'collected'
      },
      {
        id: 'C003',
        memberId: 'M001',
        memberCode: 'SM001',
        memberName: 'মোহাম্মদ আলী',
        workerName: 'করিম উদ্দিন',
        date: '2024-01-14',
        installmentCollected: 500,
        savingsCollected: 200,
        status: 'collected'
      }
    ];

    setWorkers(mockWorkers);
    setMembers(mockMembers);
    setCollections(mockCollections);
  }, []);

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
      collectionSheet: "কালেকশন শীট",
      memberProfile: "সদস্যের প্রোফাইল",
      searchMembers: "সদস্য খুঁজুন...",
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
      missedDays: "মিসড দিন"
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
      missedDays: "Missed Days"
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

  const handleAddMember = () => {
    const member: SocietyMember = {
      id: `M${String(members.length + 1).padStart(3, '0')}`,
      memberCode: newMember.memberCode,
      name: newMember.name,
      nid: newMember.nid,
      phone: newMember.phone,
      workerName: newMember.workerName,
      area: workers.find(w => w.name === newMember.workerName)?.area || '',
      installmentAmount: newMember.installmentAmount,
      savingsAmount: newMember.savingsAmount,
      loanAmount: newMember.loanAmount,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      membershipType: 'regular'
    };

    setMembers([...members, member]);
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

  const handleSaveCollection = () => {
    const newCollections: DailyCollection[] = [];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    Object.entries(dailyCollectionData).forEach(([memberId, data]) => {
      const member = members.find(m => m.id === memberId);
      if (member && (data.installment > 0 || data.savings > 0)) {
        newCollections.push({
          id: `C${String(collections.length + newCollections.length + 1).padStart(3, '0')}`,
          memberId,
          memberCode: member.memberCode,
          memberName: member.name,
          workerName: selectedWorker,
          date: selectedDateStr,
          installmentCollected: data.installment,
          savingsCollected: data.savings,
          status: 'collected'
        });
      }
    });

    setCollections([...collections, ...newCollections]);
    setDailyCollectionData({});
    setCollectionSheetOpen(false);
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

  // Calculate statistics
  const stats = {
    totalMembers: members.length,
    totalWorkers: workers.length,
    todayCollection: collections
      .filter(c => c.date === new Date().toISOString().split('T')[0])
      .reduce((sum, c) => sum + c.installmentCollected + c.savingsCollected, 0),
    monthlyTarget: members.reduce((sum, m) => sum + m.installmentAmount + m.savingsAmount, 0) * 30
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
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notifications'}
                </Button>
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
                      {language === 'bn' ? '৫টি এলাকায় বিভক্ত' : 'Across 5 areas'}
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
                    <CardTitle className="text-sm font-medium">{currentText.monthlyTarget}</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.monthlyTarget)}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'মাসিক সংগ্রহ লক্ষ্য' : 'Monthly collection target'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Worker Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'কর্মী কর্মক্ষমতা' : 'Worker Performance'}</CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'প্রতিটি এলাকার দৈনিক কালেকশন' : 'Daily collection by area'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workers.map((worker) => (
                      <div key={worker.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{worker.name}</p>
                            <p className="text-sm text-muted-foreground">{worker.area}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(worker.dailyCollection)}</p>
                          <p className="text-sm text-muted-foreground">
                            {worker.totalMembers} {language === 'bn' ? 'সদস্য' : 'members'}
                          </p>
                        </div>
                      </div>
                    ))}
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
                    {language === 'bn' ? 'সমিতির কর্মীদের তথ্য ও কর্মক্ষমতা' : 'Worker information and performance'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map((worker) => (
                  <Card key={worker.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="text-lg">{worker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{worker.name}</CardTitle>
                          <CardDescription>{worker.area}</CardDescription>
                        </div>
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
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{currentText.members}</h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'সমিতির সদস্যদের তথ্য ব্যবস্থাপনা' : 'Manage society member information'}
                  </p>
                </div>
                
                <Button onClick={() => setAddMemberOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {currentText.addMember}
                </Button>
              </div>

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
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collection Tab */}
            <TabsContent value="collection" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{currentText.collection}</h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'দৈনিক কালেকশন ব্যবস্থাপনা' : 'Daily collection management'}
                  </p>
                </div>
                
                <Button onClick={() => setCollectionSheetOpen(true)}>
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'দৈনিক রিপোর্ট' : 'Daily Report'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'দৈনিক কালেকশন ও কর্মক্ষমতা রিপোর্ট' : 'Daily collection and performance report'}
                    </p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'সদস্য রিপোর্ট' : 'Member Report'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'সদস্যদের তথ্য ও কার্যক্রমের রিপোর্ট' : 'Member information and activity report'}
                    </p>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileSpreadsheet className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'কালেকশন রিপোর্ট' : 'Collection Report'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'মাসিক কালেকশন ও আয়ের রিপোর্ট' : 'Monthly collection and income report'}
                    </p>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}
                    </Button>
                  </CardContent>
                </Card>
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentText.addMember}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'নতুন সদস্যের তথ্য প্রবেশ করান' : 'Enter new member information'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="memberCode">{currentText.memberCode}</Label>
              <Input
                id="memberCode"
                value={newMember.memberCode}
                onChange={(e) => setNewMember({...newMember, memberCode: e.target.value})}
                placeholder="SM001"
              />
            </div>
            
            <div>
              <Label htmlFor="memberName">{currentText.memberName}</Label>
              <Input
                id="memberName"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder={language === 'bn' ? 'সদস্যের নাম' : 'Member name'}
              />
            </div>
            
            <div>
              <Label htmlFor="nid">{currentText.nidNumber}</Label>
              <Input
                id="nid"
                value={newMember.nid}
                onChange={(e) => setNewMember({...newMember, nid: e.target.value})}
                placeholder="1234567890123"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">{currentText.phoneNumber}</Label>
              <Input
                id="phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                placeholder="01712345678"
              />
            </div>
            
            <div>
              <Label htmlFor="worker">{currentText.workerName}</Label>
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
                value={newMember.installmentAmount}
                onChange={(e) => setNewMember({...newMember, installmentAmount: Number(e.target.value)})}
                placeholder="500"
              />
            </div>
            
            <div>
              <Label htmlFor="savings">{currentText.savingsAmount}</Label>
              <Input
                id="savings"
                type="number"
                value={newMember.savingsAmount}
                onChange={(e) => setNewMember({...newMember, savingsAmount: Number(e.target.value)})}
                placeholder="200"
              />
            </div>
            
            <div>
              <Label htmlFor="loan">{currentText.loanAmount}</Label>
              <Input
                id="loan"
                type="number"
                value={newMember.loanAmount}
                onChange={(e) => setNewMember({...newMember, loanAmount: Number(e.target.value)})}
                placeholder="25000"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
              {currentText.cancel}
            </Button>
            <Button onClick={handleAddMember}>
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
              {language === 'bn' ? 'দৈনিক কালেকশন রেকর্ড করুন' : 'Record daily collection'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{currentText.selectWorker}</Label>
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
                <Label>{currentText.selectDate}</Label>
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
            </div>

            {selectedWorker && (
              <div>
                <h4 className="font-medium mb-4">
                  {language === 'bn' ? 'সদস্য তালিকা:' : 'Member List:'} {selectedWorker}
                </h4>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{currentText.memberCode}</TableHead>
                      <TableHead>{currentText.memberName}</TableHead>
                      <TableHead>{language === 'bn' ? 'কিস্তি সংগ্রহ' : 'Installment Collection'}</TableHead>
                      <TableHead>{language === 'bn' ? 'সঞ্চয় সংগ্রহ' : 'Savings Collection'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getWorkerMembers(selectedWorker).map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-mono">{member.memberCode}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder={String(member.installmentAmount)}
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
                            placeholder={String(member.savingsAmount)}
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

      {/* Member Profile Dialog */}
      <Dialog open={memberProfileOpen} onOpenChange={setMemberProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentText.memberProfile}</DialogTitle>
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
                          alert(`${language === 'bn' ? 'এই তারিখের কালেকশন:' : 'Collection for this date:'}\n${language === 'bn' ? 'কিস্তি:' : 'Installment:'} ${formatCurrency(memberCollection.installmentCollected)}\n${language === 'bn' ? 'সঞ্চয়:' : 'Savings:'} ${formatCurrency(memberCollection.savingsCollected)}`);
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
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
