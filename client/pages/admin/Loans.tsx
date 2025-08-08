import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  FileText,
  Calculator,
  Calendar,
  Banknote,
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

// Load applications from localStorage
const loadApplicationsFromStorage = () => {
  const stored = localStorage.getItem('loanApplications');
  if (stored) {
    return JSON.parse(stored).map((app: any, index: number) => ({
      id: app.applicationId || `LB${Date.now() + index}`,
      applicantId: `M${Date.now() + index}`,
      applicantName: app.name,
      applicantEmail: app.email || 'N/A',
      applicantPhone: app.phone,
      loanType: app.loanType,
      requestedAmount: parseInt(app.amount),
      approvedAmount: parseInt(app.amount),
      tenure: parseInt(app.tenure),
      interestRate: app.calculation?.interestRate || 18,
      emi: app.calculation?.emi || 0,
      purpose: app.purpose,
      status: "pending_approval",
      riskLevel: "medium",
      creditScore: 650,
      monthlyIncome: parseInt(app.monthlyIncome) || 0,
      existingLoans: parseInt(app.existingLoans) || 0,
      submittedAt: app.submittedAt || new Date().toISOString(),
      lastUpdated: app.submittedAt || new Date().toISOString(),
      documents: [
        { type: "NID", status: "pending", uploadedAt: app.submittedAt },
        { type: "Application Form", status: "verified", uploadedAt: app.submittedAt }
      ],
      notes: [],
      address: app.address,
      dob: app.dob,
      nid: app.nid,
      employmentType: app.employmentType,
      employer: app.employer
    }));
  }
  return [];
};

// Mock loan data
const mockLoans = [
  {
    id: "LN001234",
    applicantId: "M001234",
    applicantName: "মোহাম্মদ রহিম",
    applicantEmail: "rahim@email.com",
    applicantPhone: "01712345678",
    loanType: "Salary Loan",
    requestedAmount: 150000,
    approvedAmount: 150000,
    tenure: 24,
    interestRate: 15,
    emi: 7125,
    purpose: "Home renovation and medical expenses",
    status: "pending_approval",
    riskLevel: "low",
    creditScore: 720,
    monthlyIncome: 45000,
    existingLoans: 0,
    submittedAt: "2024-01-15T10:30:00",
    lastUpdated: "2024-01-15T10:30:00",
    documents: [
      { type: "NID", status: "verified", uploadedAt: "2024-01-15T09:00:00" },
      { type: "Salary Certificate", status: "verified", uploadedAt: "2024-01-15T09:15:00" },
      { type: "Bank Statement", status: "pending", uploadedAt: "2024-01-15T09:30:00" }
    ],
    notes: [],
    disbursementDetails: null
  },
  {
    id: "LN001235",
    applicantId: "M001235",
    applicantName: "ফাতেমা খাতুন",
    applicantEmail: "fatema@email.com",
    applicantPhone: "01987654321",
    loanType: "Instant Microloan",
    requestedAmount: 25000,
    approvedAmount: 25000,
    tenure: 12,
    interestRate: 18,
    emi: 2292,
    purpose: "Business inventory purchase",
    status: "approved",
    riskLevel: "low",
    creditScore: 680,
    monthlyIncome: 35000,
    existingLoans: 0,
    submittedAt: "2024-01-14T16:45:00",
    lastUpdated: "2024-01-15T09:00:00",
    documents: [
      { type: "NID", status: "verified", uploadedAt: "2024-01-14T15:00:00" },
      { type: "Business License", status: "verified", uploadedAt: "2024-01-14T15:30:00" }
    ],
    notes: [
      { id: 1, author: "Admin", content: "Verified business documents. Good credit history.", timestamp: "2024-01-15T09:00:00" }
    ],
    disbursementDetails: {
      approvedBy: "Admin User",
      approvedAt: "2024-01-15T09:00:00",
      scheduledDisbursement: "2024-01-16T10:00:00",
      bankAccount: "1234567890",
      bankName: "ABC Bank"
    }
  },
  {
    id: "LN001236",
    applicantId: "M001236",
    applicantName: "আব্দুল করিম",
    applicantEmail: "karim@email.com",
    applicantPhone: "01555666777",
    loanType: "Business Microloan",
    requestedAmount: 300000,
    approvedAmount: 250000,
    tenure: 36,
    interestRate: 20,
    emi: 9260,
    purpose: "Expand small restaurant business",
    status: "disbursed",
    riskLevel: "medium",
    creditScore: 650,
    monthlyIncome: 40000,
    existingLoans: 50000,
    submittedAt: "2024-01-10T11:20:00",
    lastUpdated: "2024-01-12T14:30:00",
    documents: [
      { type: "NID", status: "verified", uploadedAt: "2024-01-10T10:00:00" },
      { type: "Business License", status: "verified", uploadedAt: "2024-01-10T10:30:00" },
      { type: "Financial Statements", status: "verified", uploadedAt: "2024-01-10T11:00:00" }
    ],
    notes: [
      { id: 1, author: "Loan Officer", content: "Reduced amount due to existing debt.", timestamp: "2024-01-11T14:00:00" },
      { id: 2, author: "Admin", content: "Approved for reduced amount. Monitor closely.", timestamp: "2024-01-12T09:00:00" }
    ],
    disbursementDetails: {
      approvedBy: "Admin User",
      approvedAt: "2024-01-12T09:00:00",
      disbursedAt: "2024-01-12T14:30:00",
      bankAccount: "9876543210",
      bankName: "XYZ Bank",
      disbursedAmount: 250000
    }
  }
];

export default function AdminLoans() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; loan: any } | null>(null);
  const [allLoans, setAllLoans] = useState(mockLoans);
  const [filteredLoans, setFilteredLoans] = useState(mockLoans);
  const [activeTab, setActiveTab] = useState("applications");

  // Load real applications on mount
  useEffect(() => {
    const realApplications = loadApplicationsFromStorage();
    const combined = [...realApplications, ...mockLoans];
    setAllLoans(combined);
    setFilteredLoans(combined);
  }, []);

  useEffect(() => {
    let filtered = allLoans;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.applicantPhone.includes(searchTerm) ||
        loan.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(loan => loan.loanType === typeFilter);
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter(loan => loan.riskLevel === riskFilter);
    }

    setFilteredLoans(filtered);
  }, [searchTerm, statusFilter, typeFilter, riskFilter, allLoans]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'disbursed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'disbursed': return 'Disbursed';
      case 'rejected': return 'Rejected';
      case 'under_review': return 'Under Review';
      default: return status;
    }
  };

  const handleApprove = (loan: any, modifiedAmount?: number) => {
    console.log("Approving loan:", loan.id, "Amount:", modifiedAmount || loan.requestedAmount);
    setActionDialog(null);
    // In real app, this would call API
  };

  const handleReject = (loan: any, reason: string) => {
    console.log("Rejecting loan:", loan.id, "Reason:", reason);
    setActionDialog(null);
    // In real app, this would call API
  };

  const handleDisburse = (loan: any, disbursementDetails: any) => {
    console.log("Disbursing loan:", loan.id, "Details:", disbursementDetails);
    setActionDialog(null);
    // In real app, this would call API
  };

  // Filter loans by status for tabs
  const pendingLoans = mockLoans.filter(loan => loan.status === 'pending_approval');
  const approvedLoans = mockLoans.filter(loan => loan.status === 'approved');
  const disbursedLoans = mockLoans.filter(loan => loan.status === 'disbursed');
  const activeLoans = mockLoans.filter(loan => ['disbursed'].includes(loan.status));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
            <p className="text-muted-foreground">
              Manage loan applications, approvals, and disbursements
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Loan Calculator
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingLoans.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(pendingLoans.reduce((sum, loan) => sum + loan.requestedAmount, 0))} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{approvedLoans.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready for disbursement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeLoans.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently disbursed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(disbursedLoans.reduce((sum, loan) => sum + loan.approvedAmount, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                +15% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">
              Applications ({pendingLoans.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedLoans.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeLoans.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Loans ({mockLoans.length})
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by applicant name, email, phone, or loan ID..."
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
                    <SelectItem value="pending_approval">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="disbursed">Disbursed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Loan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Instant Microloan">Instant Microloan</SelectItem>
                    <SelectItem value="Salary Loan">Salary Loan</SelectItem>
                    <SelectItem value="Consumer Loan">Consumer Loan</SelectItem>
                    <SelectItem value="Business Microloan">Business Microloan</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Loans Table */}
          <TabsContent value="applications">
            <LoanTable 
              loans={pendingLoans} 
              onViewDetails={setSelectedLoan}
              onAction={setActionDialog}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="approved">
            <LoanTable 
              loans={approvedLoans} 
              onViewDetails={setSelectedLoan}
              onAction={setActionDialog}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="active">
            <LoanTable 
              loans={activeLoans} 
              onViewDetails={setSelectedLoan}
              onAction={setActionDialog}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="all">
            <LoanTable 
              loans={filteredLoans} 
              onViewDetails={setSelectedLoan}
              onAction={setActionDialog}
              showActions={true}
            />
          </TabsContent>
        </Tabs>

        {/* Loan Details Dialog */}
        {selectedLoan && (
          <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Loan Details: {selectedLoan.id}</DialogTitle>
                <DialogDescription>
                  Complete loan application information and history
                </DialogDescription>
              </DialogHeader>
              
              <LoanDetails loan={selectedLoan} onAction={setActionDialog} />
            </DialogContent>
          </Dialog>
        )}

        {/* Action Dialogs */}
        {actionDialog && (
          <ActionDialogs 
            action={actionDialog} 
            onClose={() => setActionDialog(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onDisburse={handleDisburse}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Loan Table Component
function LoanTable({ 
  loans, 
  onViewDetails, 
  onAction, 
  showActions 
}: { 
  loans: any[]; 
  onViewDetails: (loan: any) => void;
  onAction: (action: { type: string; loan: any }) => void;
  showActions: boolean;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'disbursed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'disbursed': return 'Disbursed';
      case 'rejected': return 'Rejected';
      case 'under_review': return 'Under Review';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loans ({loans.length})</CardTitle>
        <CardDescription>
          {showActions ? "Loan applications requiring action" : "Active loan portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Loan Details</TableHead>
              <TableHead>Amount & EMI</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>{loan.applicantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{loan.applicantName}</div>
                      <div className="text-sm text-muted-foreground">ID: {loan.id}</div>
                      <div className="text-sm text-muted-foreground">Score: {loan.creditScore}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{loan.loanType}</div>
                    <div className="text-sm text-muted-foreground">{loan.tenure} months</div>
                    <div className="text-sm text-muted-foreground">{loan.interestRate}% interest</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{formatCurrency(loan.requestedAmount)}</div>
                    {loan.approvedAmount !== loan.requestedAmount && (
                      <div className="text-sm text-blue-600">
                        Approved: {formatCurrency(loan.approvedAmount)}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">EMI: {formatCurrency(loan.emi)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`font-medium ${getRiskColor(loan.riskLevel)}`}>
                    {loan.riskLevel.toUpperCase()} RISK
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Income: {formatCurrency(loan.monthlyIncome)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(loan.status)} text-white`}>
                    {getStatusDisplay(loan.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {new Date(loan.submittedAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(loan)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {showActions && loan.status === 'pending_approval' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => onAction({ type: 'approve', loan })}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onAction({ type: 'reject', loan })}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {showActions && loan.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => onAction({ type: 'disburse', loan })}
                      >
                        <Banknote className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Loan Details Component
function LoanDetails({ loan, onAction }: { loan: any; onAction: (action: any) => void }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <Tabs defaultValue="application" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="application">Application</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="assessment">Assessment</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="application" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/api/placeholder/48/48" />
                  <AvatarFallback>{loan.applicantName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{loan.applicantName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {loan.applicantId}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{loan.applicantPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{loan.applicantEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Type</p>
                  <p className="font-medium">{loan.loanType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requested Amount</p>
                  <p className="font-medium">{formatCurrency(loan.requestedAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tenure</p>
                  <p className="font-medium">{loan.tenure} months</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly EMI</p>
                  <p className="font-medium">{formatCurrency(loan.emi)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Payable</p>
                  <p className="font-medium">{formatCurrency(loan.emi * loan.tenure)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="text-sm mt-1">{loan.purpose}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-lg font-bold">{formatCurrency(loan.monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Existing Loans</p>
                <p className="text-lg font-bold">{formatCurrency(loan.existingLoans)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credit Score</p>
                <p className="text-lg font-bold text-green-600">{loan.creditScore}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Debt-to-Income</p>
                <p className="text-lg font-bold">
                  {((loan.emi + (loan.existingLoans / 12)) / loan.monthlyIncome * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {loan.status === 'pending_approval' && (
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onAction({ type: 'reject', loan })}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onAction({ type: 'approve', loan })}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Document Verification</CardTitle>
            <CardDescription>Review uploaded documents and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loan.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">{doc.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(doc.status)} text-white`}>
                      {doc.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assessment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Automated and manual risk evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getRiskColor(loan.riskLevel)}`}>
                    {loan.riskLevel.toUpperCase()}
                  </div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{loan.creditScore}</div>
                  <p className="text-sm text-muted-foreground">Credit Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">85%</div>
                  <p className="text-sm text-muted-foreground">Approval Probability</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Risk Factors</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Income Stability</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Low Risk</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Debt-to-Income Ratio</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Low Risk</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Credit History</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Low Risk</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Loan Purpose</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>Timeline of actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    Application submitted by {loan.applicantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(loan.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {loan.notes.map((note: any) => (
                <div key={note.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Note by {note.author}</p>
                    <p className="text-sm text-muted-foreground">{note.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="new-note">Add Note</Label>
                  <Textarea
                    id="new-note"
                    placeholder="Add a note about this application..."
                    rows={3}
                  />
                  <Button size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Action Dialogs Component
function ActionDialogs({ 
  action, 
  onClose, 
  onApprove, 
  onReject, 
  onDisburse 
}: { 
  action: { type: string; loan: any };
  onClose: () => void;
  onApprove: (loan: any, amount?: number) => void;
  onReject: (loan: any, reason: string) => void;
  onDisburse: (loan: any, details: any) => void;
}) {
  const [approvalAmount, setApprovalAmount] = useState(action.loan.requestedAmount);
  const [rejectionReason, setRejectionReason] = useState("");
  const [disbursementDetails, setDisbursementDetails] = useState({
    bankAccount: "",
    bankName: "",
    scheduledDate: new Date().toISOString().split('T')[0]
  });

  if (action.type === 'approve') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Loan Application</DialogTitle>
            <DialogDescription>
              Review and approve the loan application for {action.loan.applicantName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-amount">Approval Amount</Label>
              <Input
                id="approval-amount"
                type="number"
                value={approvalAmount}
                onChange={(e) => setApprovalAmount(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Requested: {formatCurrency(action.loan.requestedAmount)}
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onApprove(action.loan, approvalAmount)}>
                Approve Loan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (action.type === 'reject') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {action.loan.applicantName}'s loan application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Provide a detailed reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => onReject(action.loan, rejectionReason)}
                disabled={!rejectionReason.trim()}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (action.type === 'disburse') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disburse Loan</DialogTitle>
            <DialogDescription>
              Set up disbursement details for {action.loan.applicantName}'s approved loan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank-account">Bank Account</Label>
                <Input
                  id="bank-account"
                  placeholder="Account number"
                  value={disbursementDetails.bankAccount}
                  onChange={(e) => setDisbursementDetails({
                    ...disbursementDetails,
                    bankAccount: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  placeholder="Bank name"
                  value={disbursementDetails.bankName}
                  onChange={(e) => setDisbursementDetails({
                    ...disbursementDetails,
                    bankName: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="scheduled-date">Scheduled Disbursement Date</Label>
              <Input
                id="scheduled-date"
                type="date"
                value={disbursementDetails.scheduledDate}
                onChange={(e) => setDisbursementDetails({
                  ...disbursementDetails,
                  scheduledDate: e.target.value
                })}
              />
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Amount to Disburse:</strong> {formatCurrency(action.loan.approvedAmount)}
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onDisburse(action.loan, disbursementDetails)}>
                Schedule Disbursement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending_approval': case 'pending': return 'bg-yellow-500';
    case 'approved': return 'bg-blue-500';
    case 'disbursed': case 'verified': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    case 'under_review': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}

function getRiskColor(risk: string) {
  switch (risk) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount).replace('BDT', '৳');
}
