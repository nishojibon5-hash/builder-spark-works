import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Search,
  Filter,
  Download,
  UserPlus,
  Eye,
  Edit,
  MoreHorizontal,
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
  Activity
} from "lucide-react";

// Mock member data
const mockMembers = [
  {
    id: "M001234",
    name: "মোহাম্মদ রহিম",
    email: "rahim@email.com",
    phone: "01712345678",
    nid: "1234567890123",
    address: "ঢাকা, বাংলাদেশ",
    dateOfBirth: "1990-05-15",
    employment: "Salaried",
    employer: "XYZ Company",
    monthlyIncome: 45000,
    joinDate: "2023-01-15",
    kycStatus: "verified",
    status: "active",
    totalLoans: 2,
    activeLoanAmount: 150000,
    totalRepaid: 75000,
    creditScore: 720,
    lastActivity: "2024-01-15T10:30:00",
    loans: [
      {
        id: "LN001234",
        type: "Salary Loan",
        amount: 100000,
        disbursedDate: "2023-06-01",
        status: "active",
        emi: 5500,
        remainingBalance: 45000
      },
      {
        id: "LN001567",
        type: "Instant Microloan",
        amount: 50000,
        disbursedDate: "2023-12-01",
        status: "active",
        emi: 2800,
        remainingBalance: 35000
      }
    ],
    payments: [
      {
        id: "P001",
        loanId: "LN001234",
        amount: 5500,
        date: "2024-01-01",
        status: "paid",
        method: "bKash"
      },
      {
        id: "P002",
        loanId: "LN001567",
        amount: 2800,
        date: "2024-01-01",
        status: "paid",
        method: "Bank Transfer"
      }
    ]
  },
  {
    id: "M001235",
    name: "ফাতেমা খাতুন",
    email: "fatema@email.com",
    phone: "01987654321",
    nid: "9876543210987",
    address: "চট্টগ্রাম, বাংলাদেশ",
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
    loans: [
      {
        id: "LN001890",
        type: "Business Microloan",
        amount: 25000,
        disbursedDate: "2023-11-15",
        status: "active",
        emi: 1500,
        remainingBalance: 15000
      }
    ],
    payments: [
      {
        id: "P003",
        loanId: "LN001890",
        amount: 1500,
        date: "2024-01-05",
        status: "paid",
        method: "Cash"
      }
    ]
  }
];

export default function AdminMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [filteredMembers, setFilteredMembers] = useState(mockMembers);

  useEffect(() => {
    let filtered = mockMembers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Apply KYC filter
    if (kycFilter !== "all") {
      filtered = filtered.filter(member => member.kycStatus === kycFilter);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, statusFilter, kycFilter]);

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

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setEditData(member);
    setEditMode(true);
  };

  const handleSave = () => {
    // In real app, this would call API to update member
    console.log("Saving member data:", editData);
    setEditMode(false);
    setSelectedMember(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({});
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
            <p className="text-muted-foreground">
              Manage customer profiles, KYC status, and account information
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
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
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,156</div>
              <p className="text-xs text-muted-foreground">93.7% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KYC Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">45</div>
              <p className="text-xs text-muted-foreground">Requires verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">156</div>
              <p className="text-xs text-muted-foreground">+23% vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, phone, or member ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={kycFilter} onValueChange={setKycFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="KYC Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KYC</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Members List ({filteredMembers.length})</CardTitle>
            <CardDescription>
              Complete list of registered members with their account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Employment</TableHead>
                  <TableHead>Loans</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="/api/placeholder/40/40" />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {member.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {member.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{member.employment}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(member.monthlyIncome)}/month</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{member.totalLoans} loans</div>
                        <div className="text-sm text-muted-foreground">
                          Active: {formatCurrency(member.activeLoanAmount)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={`${getStatusColor(member.status)} text-white`}>
                          {member.status}
                        </Badge>
                        <Badge className={`${getKycStatusColor(member.kycStatus)} text-white`}>
                          KYC: {member.kycStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(member.lastActivity).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Member Profile: {member.name}</DialogTitle>
                              <DialogDescription>
                                Complete member information and account history
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedMember && (
                              <MemberProfile member={selectedMember} onEdit={() => handleEdit(member)} />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
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

        {/* Edit Member Dialog */}
        {editMode && (
          <Dialog open={editMode} onOpenChange={() => setEditMode(false)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Member: {editData.name}</DialogTitle>
                <DialogDescription>
                  Update member information and account settings
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
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
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income</Label>
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
                      onValueChange={(value) => setEditData({...editData, status: value})}
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
                      onValueChange={(value) => setEditData({...editData, kycStatus: value})}
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

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}

// Member Profile Component
function MemberProfile({ member, onEdit }: { member: any; onEdit: () => void }) {
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
              <AvatarImage src="/api/placeholder/64/64" />
              <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-muted-foreground">Member ID: {member.id}</p>
              <div className="flex space-x-2 mt-2">
                <Badge className={`${getStatusColor(member.status)} text-white`}>
                  {member.status}
                </Badge>
                <Badge className={`${getKycStatusColor(member.kycStatus)} text-white`}>
                  KYC: {member.kycStatus}
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
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <span>{member.address}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Personal Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>DOB: {new Date(member.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>NID: {member.nid}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{member.employment} - {member.employer}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span>Income: {formatCurrency(member.monthlyIncome)}/month</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{member.creditScore}</div>
              <p className="text-xs text-muted-foreground">Good Credit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{member.totalLoans}</div>
              <p className="text-xs text-muted-foreground">Active: {formatCurrency(member.activeLoanAmount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Repaid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(member.totalRepaid)}</div>
              <p className="text-xs text-muted-foreground">Payment History</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="loans" className="space-y-4">
        <div className="space-y-4">
          {member.loans.map((loan: any) => (
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <p className="text-sm text-muted-foreground">Disbursed</p>
                    <p className="font-medium">{new Date(loan.disbursedDate).toLocaleDateString()}</p>
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {member.payments.map((payment: any) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.loanId}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.method}</TableCell>
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

function getStatusColor(status: string) {
  switch (status) {
    case 'active': case 'paid': case 'verified': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'inactive': case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getKycStatusColor(status: string) {
  switch (status) {
    case 'verified': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount).replace('BDT', '৳');
}
