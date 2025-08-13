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
  Calendar,
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
  RefreshCw
} from "lucide-react";

interface SocietyMember {
  id: string;
  name: string;
  memberNumber: string;
  phone: string;
  email?: string;
  address: string;
  joinDate: string;
  membershipType: 'regular' | 'premium' | 'life';
  status: 'active' | 'inactive' | 'suspended';
  totalDeposits: number;
  totalLoans: number;
  outstandingLoan: number;
  shares: number;
  lastActivity: string;
}

interface FinancialTransaction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'deposit' | 'withdrawal' | 'loan' | 'repayment' | 'dividend';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string[];
  attendees: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  minutes?: string;
}

export default function SocietyManager() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<SocietyMember | null>(null);

  // Load mock data
  useEffect(() => {
    // Mock members data
    const mockMembers: SocietyMember[] = [
      {
        id: 'M001',
        name: 'মোহাম্মদ আলী',
        memberNumber: 'SM001',
        phone: '01712345678',
        email: 'ali@email.com',
        address: 'ঢাকা, বাংলাদেশ',
        joinDate: '2023-01-15',
        membershipType: 'premium',
        status: 'active',
        totalDeposits: 150000,
        totalLoans: 50000,
        outstandingLoan: 25000,
        shares: 10,
        lastActivity: '2024-01-15T10:30:00'
      },
      {
        id: 'M002',
        name: 'ফাতেমা খাতুন',
        memberNumber: 'SM002',
        phone: '01987654321',
        email: 'fatema@email.com',
        address: 'চট্টগ্রাম, বাংলাদেশ',
        joinDate: '2023-03-20',
        membershipType: 'regular',
        status: 'active',
        totalDeposits: 75000,
        totalLoans: 30000,
        outstandingLoan: 15000,
        shares: 5,
        lastActivity: '2024-01-14T16:45:00'
      },
      {
        id: 'M003',
        name: 'রহিম উদ্দিন',
        memberNumber: 'SM003',
        phone: '01555666777',
        address: 'সিলেট, বাংলাদেশ',
        joinDate: '2023-06-10',
        membershipType: 'life',
        status: 'active',
        totalDeposits: 200000,
        totalLoans: 100000,
        outstandingLoan: 60000,
        shares: 20,
        lastActivity: '2024-01-13T09:15:00'
      }
    ];

    // Mock transactions data
    const mockTransactions: FinancialTransaction[] = [
      {
        id: 'T001',
        memberId: 'M001',
        memberName: 'মোহাম্মদ আলী',
        type: 'deposit',
        amount: 10000,
        date: '2024-01-15',
        description: 'মাসিক সঞ্চয় জমা',
        status: 'completed'
      },
      {
        id: 'T002',
        memberId: 'M002',
        memberName: 'ফাতেমা খাতুন',
        type: 'loan',
        amount: 25000,
        date: '2024-01-14',
        description: 'জরুরি ঋণ',
        status: 'completed'
      },
      {
        id: 'T003',
        memberId: 'M003',
        memberName: 'রহিম উদ্দিন',
        type: 'repayment',
        amount: 5000,
        date: '2024-01-13',
        description: 'ঋণ পরিশোধ কিস্তি',
        status: 'completed'
      }
    ];

    // Mock meetings data
    const mockMeetings: Meeting[] = [
      {
        id: 'MT001',
        title: 'মাসিক সাধারণ সভা',
        date: '2024-01-20',
        time: '10:00 AM',
        venue: 'সমিতি অফিস',
        agenda: ['আর্থিক প্রতিবেদন', 'নতুন সদস্য গ্রহণ', 'ঋণ নীতি পর্যালোচনা'],
        attendees: 25,
        status: 'scheduled'
      },
      {
        id: 'MT002',
        title: 'বার্ষিক নির্বাচনী সভা',
        date: '2024-01-05',
        time: '2:00 PM',
        venue: 'কমিউনিটি হল',
        agenda: ['বার্ষিক প্রতিবেদন', 'নির্বাচনী প্রক্রিয়া', 'নতুন কমিটি গঠন'],
        attendees: 45,
        status: 'completed',
        minutes: 'সভায় বার্ষিক প্রতিবেদন উপস্থাপন করা হয়। নতুন কমিটি নির্বাচিত হয়।'
      }
    ];

    setMembers(mockMembers);
    setTransactions(mockTransactions);
    setMeetings(mockMeetings);
  }, []);

  const text = {
    bn: {
      dashboard: "ড্যাশবোর্ড",
      members: "সদস্যগণ",
      finance: "আর্থিক ব্যবস্থাপনা",
      meetings: "সভাসমূহ",
      reports: "প্রতিবেদন",
      settings: "সেটিংস",
      societyName: "আমাদের সমিতি",
      totalMembers: "মোট সদস্য",
      totalDeposits: "মোট জমা",
      totalLoans: "মোট ঋণ",
      availableFunds: "উপলব্ধ তহবিল",
      memberManagement: "সদস্য ব্যবস্থাপনা",
      addMember: "নতুন সদস্য যোগ করুন",
      searchMembers: "সদস্য খুঁজুন...",
      memberNumber: "সদস্য নম্বর",
      memberName: "সদস্যের নাম",
      membershipType: "সদস্যপদের ধরন",
      status: "অবস্থা",
      recentTransactions: "সাম্প্রতিক লেনদেন",
      upcomingMeetings: "আসন্ন সভা",
      viewDetails: "বিস্তারিত দেখুন",
      active: "সক্রিয়",
      inactive: "নিষ্ক্রিয়",
      deposit: "জমা",
      withdrawal: "উত্তোলন",
      loan: "ঋণ",
      repayment: "পরিশোধ",
      dividend: "লভ্যাংশ",
      completed: "সম্পন্ন",
      pending: "অপেক্ষমান",
      cancelled: "বাতিল",
      regular: "নিয়মিত",
      premium: "প্রিমিয়াম",
      life: "আজীবন"
    },
    en: {
      dashboard: "Dashboard",
      members: "Members",
      finance: "Finance",
      meetings: "Meetings",
      reports: "Reports",
      settings: "Settings",
      societyName: "Our Society",
      totalMembers: "Total Members",
      totalDeposits: "Total Deposits",
      totalLoans: "Total Loans",
      availableFunds: "Available Funds",
      memberManagement: "Member Management",
      addMember: "Add New Member",
      searchMembers: "Search members...",
      memberNumber: "Member Number",
      memberName: "Member Name",
      membershipType: "Membership Type",
      status: "Status",
      recentTransactions: "Recent Transactions",
      upcomingMeetings: "Upcoming Meetings",
      viewDetails: "View Details",
      active: "Active",
      inactive: "Inactive",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      loan: "Loan",
      repayment: "Repayment",
      dividend: "Dividend",
      completed: "Completed",
      pending: "Pending",
      cancelled: "Cancelled",
      regular: "Regular",
      premium: "Premium",
      life: "Life"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'bg-green-500';
      case 'pending': case 'scheduled': return 'bg-yellow-500';
      case 'inactive': case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'life': return 'bg-purple-500';
      case 'premium': return 'bg-blue-500';
      case 'regular': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'withdrawal': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'loan': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'repayment': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'dividend': return <Award className="w-4 h-4 text-yellow-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    totalDeposits: members.reduce((sum, member) => sum + member.totalDeposits, 0),
    totalLoans: members.reduce((sum, member) => sum + member.outstandingLoan, 0),
    availableFunds: members.reduce((sum, member) => sum + member.totalDeposits, 0) - 
                   members.reduce((sum, member) => sum + member.outstandingLoan, 0),
    totalShares: members.reduce((sum, member) => sum + member.shares, 0)
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
              <TabsTrigger value="members" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {currentText.members}
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                {currentText.finance}
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {currentText.meetings}
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
                      <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                      {stats.activeMembers} {language === 'bn' ? 'সক্রিয়' : 'active'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.totalDeposits}</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalDeposits)}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'সকল সদস্যের জমা' : 'From all members'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.totalLoans}</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalLoans)}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'বকেয়া ঋণের পরিমাণ' : 'Outstanding loan amount'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{currentText.availableFunds}</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.availableFunds)}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'ঋণ প্রদানের জন্য উপলব্ধ' : 'Available for loans'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{currentText.recentTransactions}</CardTitle>
                    <CardDescription>
                      {language === 'bn' ? 'সাম্প্রতিক আর্থিক লেনদেন' : 'Latest financial transactions'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <p className="font-medium">{transaction.memberName}</p>
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Meetings */}
                <Card>
                  <CardHeader>
                    <CardTitle>{currentText.upcomingMeetings}</CardTitle>
                    <CardDescription>
                      {language === 'bn' ? 'আসন্ন সভাসমূহ' : 'Scheduled meetings'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {meetings.filter(m => m.status === 'scheduled').map((meeting) => (
                        <div key={meeting.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{meeting.title}</h4>
                            <Badge className={`${getStatusColor(meeting.status)} text-white`}>
                              {meeting.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {meeting.date} - {meeting.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {meeting.venue}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {meeting.attendees} {language === 'bn' ? 'জন' : 'attendees'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === 'bn' ? 'সদস্যপদের বিতরণ' : 'Membership Distribution'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['regular', 'premium', 'life'].map(type => {
                        const count = members.filter(m => m.membershipType === type).length;
                        const percentage = (count / members.length) * 100;
                        return (
                          <div key={type}>
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{currentText[type as keyof typeof currentText]}</span>
                              <span>{count} ({percentage.toFixed(0)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === 'bn' ? 'আর্থিক স্বাস্থ্য' : 'Financial Health'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'bn' ? 'তহবিল ব্যবহার' : 'Fund Utilization'}</span>
                        <span className="text-sm font-medium">
                          {((stats.totalLoans / stats.totalDeposits) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={(stats.totalLoans / stats.totalDeposits) * 100} className="h-2" />
                      
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'bn' ? 'মোট শেয়ার' : 'Total Shares'}</span>
                        <span className="text-sm font-medium">{stats.totalShares}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {language === 'bn' ? 'সদস্য কার্যকলাপ' : 'Member Activity'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{language === 'bn' ? 'সক্রিয় সদস্য' : 'Active Members'}</span>
                        <span className="text-2xl font-bold text-green-600">{stats.activeMembers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{language === 'bn' ? 'গত মাসের লেনদেন' : 'Last Month Transactions'}</span>
                        <span className="text-lg font-medium">{transactions.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              {/* Members Management Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{currentText.memberManagement}</h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'সমিতির সদস্যদের তথ্য ব্যবস্থাপনা করুন' : 'Manage society member information'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {currentText.addMember}
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'bn' ? 'রপ্তানি' : 'Export'}
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder={currentText.searchMembers}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={language === 'bn' ? 'সদস্যপদের ধরন' : 'Membership Type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'bn' ? 'সকল ধরন' : 'All Types'}</SelectItem>
                        <SelectItem value="regular">{currentText.regular}</SelectItem>
                        <SelectItem value="premium">{currentText.premium}</SelectItem>
                        <SelectItem value="life">{currentText.life}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder={currentText.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'bn' ? 'সকল অবস্থা' : 'All Status'}</SelectItem>
                        <SelectItem value="active">{currentText.active}</SelectItem>
                        <SelectItem value="inactive">{currentText.inactive}</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <TableHead>{currentText.memberName}</TableHead>
                        <TableHead>{currentText.memberNumber}</TableHead>
                        <TableHead>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</TableHead>
                        <TableHead>{currentText.membershipType}</TableHead>
                        <TableHead>{language === 'bn' ? 'জমা' : 'Deposits'}</TableHead>
                        <TableHead>{language === 'bn' ? 'বকেয়া ঋণ' : 'Outstanding'}</TableHead>
                        <TableHead>{currentText.status}</TableHead>
                        <TableHead>{language === 'bn' ? 'কার্যক্রম' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {language === 'bn' ? 'যোগদান:' : 'Joined:'} {member.joinDate}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{member.memberNumber}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone className="w-3 h-3 mr-1" />
                                {member.phone}
                              </div>
                              {member.email && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {member.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getMembershipColor(member.membershipType)} text-white`}>
                              {currentText[member.membershipType as keyof typeof currentText]}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(member.totalDeposits)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(member.outstandingLoan)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(member.status)} text-white`}>
                              {currentText[member.status as keyof typeof currentText]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
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

            {/* Finance Tab */}
            <TabsContent value="finance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Summary */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'আর্থিক লেনদেন' : 'Financial Transactions'}</CardTitle>
                    <CardDescription>
                      {language === 'bn' ? 'সকল আর্থিক কার্যক্রমের তালিকা' : 'All financial activities'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <p className="font-medium">{transaction.memberName}</p>
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                            <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                              {currentText[transaction.status as keyof typeof currentText]}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'দ্রুত কার্যক্রম' : 'Quick Actions'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'নতুন জমা' : 'New Deposit'}
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'উত্তোলন' : 'Withdrawal'}
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'ঋণ প্রদান' : 'Grant Loan'}
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'ঋণ পরিশোধ' : 'Loan Repayment'}
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Award className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'লভ্যাংশ বিতরণ' : 'Dividend Distribution'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {language === 'bn' ? 'সভা ব্যবস্থাপনা' : 'Meeting Management'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'সমিতির সভাসমূহ পরিচালনা করুন' : 'Manage society meetings'}
                  </p>
                </div>
                
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'নতুন সভা' : 'Schedule Meeting'}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {meetings.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <Badge className={`${getStatusColor(meeting.status)} text-white`}>
                          {meeting.status === 'scheduled' && (language === 'bn' ? 'নির্ধারিত' : 'Scheduled')}
                          {meeting.status === 'completed' && (language === 'bn' ? 'সম্পন্ন' : 'Completed')}
                          {meeting.status === 'cancelled' && (language === 'bn' ? 'বাতিল' : 'Cancelled')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          {meeting.date} - {meeting.time}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {meeting.venue}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {meeting.attendees} {language === 'bn' ? 'জন উপস্থিতি' : 'attendees'}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          {language === 'bn' ? 'আলোচ্যসূচি:' : 'Agenda:'}
                        </h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {meeting.agenda.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {meeting.minutes && (
                        <div>
                          <h4 className="font-medium mb-2">
                            {language === 'bn' ? 'সভার কার্যবিবরণী:' : 'Meeting Minutes:'}
                          </h4>
                          <p className="text-sm text-muted-foreground">{meeting.minutes}</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          {currentText.viewDetails}
                        </Button>
                        {meeting.status === 'scheduled' && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'আর্থিক প্রতিবেদন' : 'Financial Report'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'সমিতির আর্থিক অবস্থার বিস্তারিত প্রতিবেদন' : 'Detailed financial status report'}
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
                      {language === 'bn' ? 'সদস্য প্রতিবেদন' : 'Member Report'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'সদস্যদের তথ্য ও কার্যক্রমের প্রতিবেদন' : 'Member information and activity report'}
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
                      <Calendar className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'সভার প্রতিবেদন' : 'Meeting Report'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'bn' ? 'সকল সভার কার্যবিবরণী ও উপস্থিতি' : 'All meeting minutes and attendance'}
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

                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'bn' ? 'সিস্টেম সেটিংস' : 'System Settings'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'bn' ? 'ইমেইল বিজ্ঞপ্তি' : 'Email Notifications'}</Label>
                        <p className="text-sm text-muted-foreground">
                          {language === 'bn' ? 'গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পাঠান' : 'Send emails for important updates'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === 'bn' ? 'সক্রিয়' : 'Enabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'bn' ? 'SMS বিজ্ঞপ্তি' : 'SMS Notifications'}</Label>
                        <p className="text-sm text-muted-foreground">
                          {language === 'bn' ? 'জরুরি বিষয়ের জন্য SMS পাঠান' : 'Send SMS for urgent matters'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === 'bn' ? 'নিষ্ক্রিয়' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'bn' ? 'ডেটা ব্যাকআপ' : 'Data Backup'}</Label>
                        <p className="text-sm text-muted-foreground">
                          {language === 'bn' ? 'স্বয়ংক্রিয় দৈনিক ব্যাকআপ' : 'Automatic daily backup'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === 'bn' ? 'সক্রিয়' : 'Enabled'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
