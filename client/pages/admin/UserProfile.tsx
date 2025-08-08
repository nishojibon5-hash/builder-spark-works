import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Search,
  Filter,
  Download,
  UserPlus,
  Eye,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  Wallet,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Activity,
  Hash,
  User,
  RefreshCw
} from "lucide-react";

// Enhanced user interface with user number and user code
interface UserProfile {
  id: string;
  userNumber: string; // New field for user number
  userCode: string; // New field for user code
  name: string;
  email: string;
  phone: string;
  nid: string;
  address: string;
  dateOfBirth: string;
  employment: string;
  employer: string;
  monthlyIncome: number;
  joinDate: string;
  kycStatus: "verified" | "pending" | "rejected";
  status: "active" | "inactive" | "suspended";
  totalLoans: number;
  activeLoanAmount: number;
  totalRepaid: number;
  creditScore: number;
  lastActivity: string;
  profileImage?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  loans: LoanDetails[];
  payments: PaymentDetails[];
}

interface LoanDetails {
  id: string;
  type: string;
  amount: number;
  disbursedDate: string;
  status: string;
  emi: number;
  remainingBalance: number;
  dueDate: string;
  interestRate: number;
}

interface PaymentDetails {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  status: string;
  method: string;
  transactionId?: string;
}

// Mock user data with user numbers and codes
const mockUsers: UserProfile[] = [
  {
    id: "U001234",
    userNumber: "UN001234",
    userCode: "UC-2024-001",
    name: "মোহাম্মদ রহিম",
    email: "rahim@email.com",
    phone: "01712345678",
    nid: "1234567890123",
    address: "House 123, Road 5, Dhanmondi, Dhaka-1205",
    dateOfBirth: "1990-05-15",
    employment: "Salaried",
    employer: "XYZ Company Ltd",
    monthlyIncome: 45000,
    joinDate: "2023-01-15",
    kycStatus: "verified",
    status: "active",
    totalLoans: 2,
    activeLoanAmount: 150000,
    totalRepaid: 75000,
    creditScore: 720,
    lastActivity: "2024-01-15T10:30:00",
    emergencyContact: {
      name: "ফাতেমা রহিম",
      phone: "01712345679",
      relation: "স���ত্রী"
    },
    bankDetails: {
      bankName: "Dutch Bangla Bank",
      accountNumber: "1234567890",
      branch: "Dhanmondi Branch"
    },
    loans: [
      {
        id: "LN001234",
        type: "Salary Loan",
        amount: 100000,
        disbursedDate: "2023-06-01",
        status: "active",
        emi: 5500,
        remainingBalance: 45000,
        dueDate: "2024-02-01",
        interestRate: 12.5
      },
      {
        id: "LN001567",
        type: "Instant Microloan",
        amount: 50000,
        disbursedDate: "2023-12-01",
        status: "active",
        emi: 2800,
        remainingBalance: 35000,
        dueDate: "2024-02-01",
        interestRate: 15.0
      }
    ],
    payments: [
      {
        id: "P001",
        loanId: "LN001234",
        amount: 5500,
        date: "2024-01-01",
        status: "paid",
        method: "bKash",
        transactionId: "BKX123456789"
      },
      {
        id: "P002",
        loanId: "LN001567",
        amount: 2800,
        date: "2024-01-01",
        status: "paid",
        method: "Bank Transfer",
        transactionId: "BT987654321"
      }
    ]
  },
  {
    id: "U001235",
    userNumber: "UN001235",
    userCode: "UC-2024-002",
    name: "ফাতেমা খাতুন",
    email: "fatema@email.com",
    phone: "01987654321",
    nid: "9876543210987",
    address: "Plot 456, CDA Avenue, Chittagong-4000",
    dateOfBirth: "1985-08-22",
    employment: "Business",
    employer: "Own Business",
    monthlyIncome: 35000,
    joinDate: "2023-03-20",
    kycStatus: "pending",
    status: "active",
    totalLoans: 1,
    activeLoanAmount: 25000,
    totalRepaid: 10000,
    creditScore: 680,
    lastActivity: "2024-01-14T16:45:00",
    emergencyContact: {
      name: "আব্দুল করিম",
      phone: "01987654322",
      relation: "স্বামী"
    },
    bankDetails: {
      bankName: "Islami Bank Bangladesh",
      accountNumber: "0987654321",
      branch: "Chittagong Branch"
    },
    loans: [
      {
        id: "LN001890",
        type: "Business Microloan",
        amount: 25000,
        disbursedDate: "2023-11-15",
        status: "active",
        emi: 1500,
        remainingBalance: 15000,
        dueDate: "2024-02-15",
        interestRate: 14.0
      }
    ],
    payments: [
      {
        id: "P003",
        loanId: "LN001890",
        amount: 1500,
        date: "2024-01-05",
        status: "paid",
        method: "Cash",
        transactionId: "CSH123456"
      }
    ]
  }
];

export default function UserProfileDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all"); // all, userNumber, userCode, name, phone
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);

  // Filter users based on search criteria
  useEffect(() => {
    let filtered = mockUsers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const term = searchTerm.toLowerCase();
        switch (searchType) {
          case "userNumber":
            return user.userNumber.toLowerCase().includes(term);
          case "userCode":
            return user.userCode.toLowerCase().includes(term);
          case "name":
            return user.name.toLowerCase().includes(term);
          case "phone":
            return user.phone.includes(searchTerm);
          default: // "all"
            return (
              user.userNumber.toLowerCase().includes(term) ||
              user.userCode.toLowerCase().includes(term) ||
              user.name.toLowerCase().includes(term) ||
              user.email.toLowerCase().includes(term) ||
              user.phone.includes(searchTerm) ||
              user.id.toLowerCase().includes(term)
            );
        }
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply KYC filter
    if (kycFilter !== "all") {
      filtered = filtered.filter(user => user.kycStatus === kycFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, searchType, statusFilter, kycFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!editData || !selectedUser) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would call API to update user
      console.log("Saving user data:", editData);
      
      // Update local state (in real app, refetch from API)
      const updatedUsers = mockUsers.map(user => 
        user.id === selectedUser.id ? { ...user, ...editData } : user
      );
      
      toast({
        title: "Profile Updated",
        description: "User profile has been successfully updated.",
      });
      
      setEditMode(false);
      setSelectedUser(null);
      setEditData({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({});
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchType("all");
    setStatusFilter("all");
    setKycFilter("all");
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Profile Dashboard</h1>
            <p className="text-muted-foreground">
              Search and manage user profiles with advanced filtering options
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={clearSearch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                Active profiles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search Results</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredUsers.length}</div>
              <p className="text-xs text-muted-foreground">Matching users found</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KYC Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockUsers.filter(u => u.kycStatus === 'verified').length}
              </div>
              <p className="text-xs text-muted-foreground">Verified profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockUsers.reduce((sum, user) => sum + user.totalLoans, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total loan accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Advanced User Search
            </CardTitle>
            <CardDescription>
              Search by user number, user code, name, phone, or use global search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Type Selector */}
              <div className="md:col-span-2">
                <Label htmlFor="searchType">Search By</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="userNumber">User Number</SelectItem>
                    <SelectItem value="userCode">User Code</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input */}
              <div className="md:col-span-5">
                <Label htmlFor="search">Search Term</Label>
                <div className="relative">
                  {searchType === "userNumber" && <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />}
                  {searchType === "userCode" && <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />}
                  {searchType === "name" && <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />}
                  {searchType === "phone" && <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />}
                  {searchType === "all" && <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />}
                  <Input
                    id="search"
                    placeholder={
                      searchType === "userNumber" ? "Enter user number (e.g. UN001234)" :
                      searchType === "userCode" ? "Enter user code (e.g. UC-2024-001)" :
                      searchType === "name" ? "Enter user name" :
                      searchType === "phone" ? "Enter phone number" :
                      "Search by any field..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="md:col-span-2">
                <Label>Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* KYC Filter */}
              <div className="md:col-span-2">
                <Label>KYC Filter</Label>
                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All KYC</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Button */}
              <div className="md:col-span-1 flex items-end">
                <Button variant="outline" onClick={clearSearch} className="w-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Profiles ({filteredUsers.length} found)</CardTitle>
            <CardDescription>
              {searchTerm ? `Search results for "${searchTerm}"` : "Complete list of user profiles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Info</TableHead>
                  <TableHead>User Number</TableHead>
                  <TableHead>User Code</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Loans</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.profileImage || "/api/placeholder/40/40"} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-sm">{user.userNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-sm">{user.userCode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={`${getStatusColor(user.status)} text-white`}>
                          {user.status}
                        </Badge>
                        <Badge className={`${getKycStatusColor(user.kycStatus)} text-white`}>
                          KYC: {user.kycStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{user.totalLoans} loans</div>
                        <div className="text-sm text-muted-foreground">
                          Active: {formatCurrency(user.activeLoanAmount)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Profile: {user.name}</DialogTitle>
                              <DialogDescription>
                                Complete user information and account history
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <UserProfileView user={selectedUser} onEdit={() => handleEdit(user)} />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No users found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        {editMode && editData && (
          <Dialog open={editMode} onOpenChange={() => setEditMode(false)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit User Profile: {editData.name}</DialogTitle>
                <DialogDescription>
                  Update user information and account settings
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact & Emergency</TabsTrigger>
                  <TabsTrigger value="financial">Financial Info</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="userNumber">User Number</Label>
                      <Input
                        id="userNumber"
                        value={editData.userNumber || ''}
                        onChange={(e) => setEditData({...editData, userNumber: e.target.value})}
                        placeholder="UN001234"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userCode">User Code</Label>
                      <Input
                        id="userCode"
                        value={editData.userCode || ''}
                        onChange={(e) => setEditData({...editData, userCode: e.target.value})}
                        placeholder="UC-2024-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nid">National ID</Label>
                      <Input
                        id="nid"
                        value={editData.nid || ''}
                        onChange={(e) => setEditData({...editData, nid: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={editData.dateOfBirth || ''}
                        onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employment">Employment Type</Label>
                      <Select
                        value={editData.employment || ''}
                        onValueChange={(value) => setEditData({...editData, employment: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Salaried">Salaried</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Self-employed">Self-employed</SelectItem>
                          <SelectItem value="Freelancer">Freelancer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="employer">Employer</Label>
                      <Input
                        id="employer"
                        value={editData.employer || ''}
                        onChange={(e) => setEditData({...editData, employer: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyIncome">Monthly Income (৳)</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        value={editData.monthlyIncome || ''}
                        onChange={(e) => setEditData({...editData, monthlyIncome: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Account Status</Label>
                      <Select
                        value={editData.status || ''}
                        onValueChange={(value) => setEditData({...editData, status: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="kycStatus">KYC Status</Label>
                      <Select
                        value={editData.kycStatus || ''}
                        onValueChange={(value) => setEditData({...editData, kycStatus: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <Separator />
                  <h4 className="font-medium">Emergency Contact</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        value={editData.emergencyContact?.name || ''}
                        onChange={(e) => setEditData({
                          ...editData, 
                          emergencyContact: {
                            ...editData.emergencyContact,
                            name: e.target.value,
                            phone: editData.emergencyContact?.phone || '',
                            relation: editData.emergencyContact?.relation || ''
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={editData.emergencyContact?.phone || ''}
                        onChange={(e) => setEditData({
                          ...editData, 
                          emergencyContact: {
                            ...editData.emergencyContact,
                            name: editData.emergencyContact?.name || '',
                            phone: e.target.value,
                            relation: editData.emergencyContact?.relation || ''
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelation">Relation</Label>
                      <Input
                        id="emergencyRelation"
                        value={editData.emergencyContact?.relation || ''}
                        onChange={(e) => setEditData({
                          ...editData, 
                          emergencyContact: {
                            ...editData.emergencyContact,
                            name: editData.emergencyContact?.name || '',
                            phone: editData.emergencyContact?.phone || '',
                            relation: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <h4 className="font-medium">Bank Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={editData.bankDetails?.bankName || ''}
                        onChange={(e) => setEditData({
                          ...editData, 
                          bankDetails: {
                            ...editData.bankDetails,
                            bankName: e.target.value,
                            accountNumber: editData.bankDetails?.accountNumber || '',
                            branch: editData.bankDetails?.branch || ''
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={editData.bankDetails?.accountNumber || ''}
                        onChange={(e) => setEditData({
                          ...editData, 
                          bankDetails: {
                            ...editData.bankDetails,
                            bankName: editData.bankDetails?.bankName || '',
                            accountNumber: e.target.value,
                            branch: editData.bankDetails?.branch || ''
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        value={editData.bankDetails?.branch || ''}
                        onChange={(e) => setEditData({
                          ...editData, 
                          bankDetails: {
                            ...editData.bankDetails,
                            bankName: editData.bankDetails?.bankName || '',
                            accountNumber: editData.bankDetails?.accountNumber || '',
                            branch: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="creditScore">Credit Score</Label>
                      <Input
                        id="creditScore"
                        type="number"
                        min="300"
                        max="850"
                        value={editData.creditScore || ''}
                        onChange={(e) => setEditData({...editData, creditScore: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}

// User Profile View Component
function UserProfileView({ user, onEdit }: { user: UserProfile; onEdit: () => void }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'paid': case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="loans">Loans</TabsTrigger>
        <TabsTrigger value="payments">Payment History</TabsTrigger>
        <TabsTrigger value="activity">Activity Log</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.profileImage || "/api/placeholder/64/64"} />
              <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-muted-foreground">User ID: {user.id}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Hash className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-mono">{user.userNumber}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-mono">{user.userCode}</span>
              </div>
              <div className="flex space-x-2 mt-2">
                <Badge className={`${getStatusColor(user.status)} text-white`}>
                  {user.status}
                </Badge>
                <Badge className={`${getKycStatusColor(user.kycStatus)} text-white`}>
                  KYC: {user.kycStatus}
                </Badge>
              </div>
            </div>
          </div>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <span>{user.address}</span>
              </div>
            </div>

            {user.emergencyContact && (
              <>
                <h4 className="font-semibold mt-6">Emergency Contact</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{user.emergencyContact.name} ({user.emergencyContact.relation})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.emergencyContact.phone}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Personal Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>DOB: {new Date(user.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>NID: {user.nid}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{user.employment} - {user.employer}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span>Income: {formatCurrency(user.monthlyIncome)}/month</span>
              </div>
            </div>

            {user.bankDetails && (
              <>
                <h4 className="font-semibold mt-6">Bank Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span>{user.bankDetails.bankName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span>{user.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{user.bankDetails.branch}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{user.creditScore}</div>
              <p className="text-xs text-muted-foreground">
                {user.creditScore >= 700 ? 'Excellent' : user.creditScore >= 650 ? 'Good' : 'Fair'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalLoans}</div>
              <p className="text-xs text-muted-foreground">Active: {formatCurrency(user.activeLoanAmount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Repaid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(user.totalRepaid)}</div>
              <p className="text-xs text-muted-foreground">Payment History</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="loans" className="space-y-4">
        <div className="space-y-4">
          {user.loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{loan.type}</CardTitle>
                  <Badge className={`${getStatusColor(loan.status)} text-white`}>
                    {loan.status}
                  </Badge>
                </div>
                <CardDescription>Loan ID: {loan.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="font-medium">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly EMI</p>
                    <p className="font-medium">{formatCurrency(loan.emi)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="font-medium">{formatCurrency(loan.remainingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="font-medium">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Due</p>
                    <p className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="payments" className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Loan ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.loanId}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(payment.status)} text-white`}>
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">Payment Received</p>
              <p className="text-sm text-muted-foreground">
                Received EMI payment of {formatCurrency(5500)} for loan LN001234
              </p>
              <p className="text-xs text-muted-foreground">January 1, 2024 at 10:30 AM</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Loan Disbursed</p>
              <p className="text-sm text-muted-foreground">
                Instant Microloan of {formatCurrency(50000)} disbursed to account
              </p>
              <p className="text-xs text-muted-foreground">December 1, 2023 at 2:15 PM</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <FileText className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium">Profile Updated</p>
              <p className="text-sm text-muted-foreground">
                User profile information updated by admin
              </p>
              <p className="text-xs text-muted-foreground">January 10, 2024 at 3:20 PM</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">KYC Verified</p>
              <p className="text-sm text-muted-foreground">
                KYC documents verified and approved by admin
              </p>
              <p className="text-xs text-muted-foreground">March 20, 2023 at 11:45 AM</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
