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
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  Banknote,
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  Phone,
  Mail,
  Receipt,
  Plus,
  FileText,
  Bell,
  DollarSign,
  History,
  Calculator
} from "lucide-react";

// Mock repayment data
const mockRepayments = [
  {
    id: "PAY001234",
    loanId: "LN001234",
    memberId: "M001234",
    memberName: "মোহাম্মদ রহিম",
    memberPhone: "01712345678",
    memberEmail: "rahim@email.com",
    loanType: "Salary Loan",
    emiAmount: 7125,
    dueDate: "2024-01-15",
    paidDate: "2024-01-15",
    paidAmount: 7125,
    paymentMethod: "bKash",
    status: "paid",
    lateFee: 0,
    outstanding: 142875,
    emiNumber: 3,
    totalEmis: 24,
    nextDueDate: "2024-02-15",
    paymentReference: "TXN123456789",
    collectedBy: "Auto Collection"
  },
  {
    id: "PAY001235",
    loanId: "LN001235",
    memberId: "M001235",
    memberName: "ফাতেমা খাতুন",
    memberPhone: "01987654321",
    memberEmail: "fatema@email.com",
    loanType: "Instant Microloan",
    emiAmount: 2292,
    dueDate: "2024-01-10",
    paidDate: null,
    paidAmount: 0,
    paymentMethod: null,
    status: "overdue",
    lateFee: 115,
    outstanding: 22920,
    emiNumber: 1,
    totalEmis: 12,
    nextDueDate: "2024-01-10",
    paymentReference: null,
    collectedBy: null,
    overdueBy: 5
  },
  {
    id: "PAY001236",
    loanId: "LN001236",
    memberId: "M001236",
    memberName: "আব্দুল করিম",
    memberPhone: "01555666777",
    memberEmail: "karim@email.com",
    loanType: "Business Microloan",
    emiAmount: 9260,
    dueDate: "2024-01-20",
    paidDate: null,
    paidAmount: 0,
    paymentMethod: null,
    status: "due_today",
    lateFee: 0,
    outstanding: 231500,
    emiNumber: 5,
    totalEmis: 36,
    nextDueDate: "2024-01-20",
    paymentReference: null,
    collectedBy: null
  },
  {
    id: "PAY001237",
    loanId: "LN001237",
    memberId: "M001237",
    memberName: "সালমা বেগম",
    memberPhone: "01666777888",
    memberEmail: "salma@email.com",
    loanType: "Consumer Loan",
    emiAmount: 5875,
    dueDate: "2024-01-25",
    paidDate: null,
    paidAmount: 0,
    paymentMethod: null,
    status: "upcoming",
    lateFee: 0,
    outstanding: 176250,
    emiNumber: 8,
    totalEmis: 36,
    nextDueDate: "2024-01-25",
    paymentReference: null,
    collectedBy: null
  }
];

// Mock collection activities
const mockCollectionActivities = [
  {
    id: "COL001",
    memberId: "M001235",
    memberName: "ফাতেমা খাতুন",
    loanId: "LN001235",
    activity: "SMS Reminder Sent",
    description: "Automatic SMS reminder sent for overdue payment",
    timestamp: "2024-01-16T09:00:00",
    performedBy: "System",
    status: "completed"
  },
  {
    id: "COL002",
    memberId: "M001235",
    memberName: "ফাতেমা খাতুন",
    loanId: "LN001235",
    activity: "Phone Call Attempted",
    description: "Called customer regarding overdue payment - no answer",
    timestamp: "2024-01-16T14:30:00",
    performedBy: "Collection Agent",
    status: "completed"
  }
];

export default function AdminRepayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [manualPaymentDialog, setManualPaymentDialog] = useState(false);
  const [filteredRepayments, setFilteredRepayments] = useState(mockRepayments);
  const [activeTab, setActiveTab] = useState("due_today");

  useEffect(() => {
    let filtered = mockRepayments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.memberPhone.includes(searchTerm) ||
        payment.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(payment => payment.loanType === typeFilter);
    }

    setFilteredRepayments(filtered);
  }, [searchTerm, statusFilter, typeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'due_today': return 'bg-yellow-500';
      case 'upcoming': return 'bg-blue-500';
      case 'partial': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'overdue': return 'Overdue';
      case 'due_today': return 'Due Today';
      case 'upcoming': return 'Upcoming';
      case 'partial': return 'Partial Payment';
      default: return status;
    }
  };

  // Filter payments by status for tabs
  const dueToday = mockRepayments.filter(p => p.status === 'due_today');
  const overdue = mockRepayments.filter(p => p.status === 'overdue');
  const upcoming = mockRepayments.filter(p => p.status === 'upcoming');
  const paid = mockRepayments.filter(p => p.status === 'paid');

  // Calculate summary stats
  const totalDueToday = dueToday.reduce((sum, p) => sum + p.emiAmount, 0);
  const totalOverdue = overdue.reduce((sum, p) => sum + (p.emiAmount + p.lateFee), 0);
  const totalCollected = paid.reduce((sum, p) => sum + p.paidAmount, 0);
  const collectionRate = paid.length / mockRepayments.length * 100;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Repayment Management</h1>
            <p className="text-muted-foreground">
              Track payments, manage collections, and monitor repayment performance
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={() => setManualPaymentDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
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
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{dueToday.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(totalDueToday)} total amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdue.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(totalOverdue)} total amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
                +12% vs yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{collectionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="due_today">
              Due Today ({dueToday.length})
            </TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue ({overdue.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid ({paid.length})
            </TabsTrigger>
            <TabsTrigger value="collections">
              Collections
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
                      placeholder="Search by member name, loan ID, payment ID..."
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
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="due_today">Due Today</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
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

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Tables */}
          <TabsContent value="due_today">
            <PaymentTable 
              payments={dueToday} 
              onViewDetails={setSelectedPayment}
              showActions={true}
              title="Payments Due Today"
              description="EMI payments that are due today"
            />
          </TabsContent>

          <TabsContent value="overdue">
            <PaymentTable 
              payments={overdue} 
              onViewDetails={setSelectedPayment}
              showActions={true}
              title="Overdue Payments"
              description="Payments that are past their due date"
            />
          </TabsContent>

          <TabsContent value="upcoming">
            <PaymentTable 
              payments={upcoming} 
              onViewDetails={setSelectedPayment}
              showActions={false}
              title="Upcoming Payments"
              description="Future payment schedules"
            />
          </TabsContent>

          <TabsContent value="paid">
            <PaymentTable 
              payments={paid} 
              onViewDetails={setSelectedPayment}
              showActions={false}
              title="Paid Payments"
              description="Successfully completed payments"
            />
          </TabsContent>

          <TabsContent value="collections">
            <CollectionActivities activities={mockCollectionActivities} />
          </TabsContent>
        </Tabs>

        {/* Payment Details Dialog */}
        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Payment Details: {selectedPayment.id}</DialogTitle>
                <DialogDescription>
                  Complete payment information and history
                </DialogDescription>
              </DialogHeader>
              
              <PaymentDetails payment={selectedPayment} />
            </DialogContent>
          </Dialog>
        )}

        {/* Manual Payment Dialog */}
        {manualPaymentDialog && (
          <Dialog open={manualPaymentDialog} onOpenChange={setManualPaymentDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Manual Payment</DialogTitle>
                <DialogDescription>
                  Enter payment details for offline or manual payments
                </DialogDescription>
              </DialogHeader>
              
              <ManualPaymentForm onClose={() => setManualPaymentDialog(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}

// Payment Table Component
function PaymentTable({ 
  payments, 
  onViewDetails, 
  showActions,
  title,
  description
}: { 
  payments: any[]; 
  onViewDetails: (payment: any) => void;
  showActions: boolean;
  title: string;
  description: string;
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
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'due_today': return 'bg-yellow-500';
      case 'upcoming': return 'bg-blue-500';
      case 'partial': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'overdue': return 'Overdue';
      case 'due_today': return 'Due Today';
      case 'upcoming': return 'Upcoming';
      case 'partial': return 'Partial Payment';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({payments.length})</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Loan Details</TableHead>
              <TableHead>EMI Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>{payment.memberName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{payment.memberName}</div>
                      <div className="text-sm text-muted-foreground">{payment.memberPhone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{payment.loanType}</div>
                    <div className="text-sm text-muted-foreground">
                      EMI {payment.emiNumber}/{payment.totalEmis}
                    </div>
                    <div className="text-sm text-muted-foreground">ID: {payment.loanId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{formatCurrency(payment.emiAmount)}</div>
                    {payment.lateFee > 0 && (
                      <div className="text-sm text-red-600">
                        Late Fee: {formatCurrency(payment.lateFee)}
                      </div>
                    )}
                    {payment.paidAmount > 0 && (
                      <div className="text-sm text-green-600">
                        Paid: {formatCurrency(payment.paidAmount)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{new Date(payment.dueDate).toLocaleDateString()}</div>
                    {payment.overdueBy && (
                      <div className="text-sm text-red-600">
                        {payment.overdueBy} days overdue
                      </div>
                    )}
                    {payment.paidDate && (
                      <div className="text-sm text-green-600">
                        Paid: {new Date(payment.paidDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(payment.status)} text-white`}>
                    {getStatusDisplay(payment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatCurrency(payment.outstanding)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((payment.outstanding / (payment.emiAmount * payment.totalEmis)) * 100).toFixed(1)}% remaining
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(payment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {showActions && payment.status !== 'paid' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </>
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

// Payment Details Component
function PaymentDetails({ payment }: { payment: any }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Payment Details</TabsTrigger>
        <TabsTrigger value="schedule">EMI Schedule</TabsTrigger>
        <TabsTrigger value="history">Payment History</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/api/placeholder/48/48" />
                  <AvatarFallback>{payment.memberName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{payment.memberName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {payment.memberId}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{payment.memberPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{payment.memberEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-medium">{payment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan ID</p>
                  <p className="font-medium">{payment.loanId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">EMI Amount</p>
                  <p className="font-medium">{formatCurrency(payment.emiAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
                </div>
                {payment.lateFee > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Late Fee</p>
                    <p className="font-medium text-red-600">{formatCurrency(payment.lateFee)}</p>
                  </div>
                )}
                {payment.paidAmount > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Paid Amount</p>
                      <p className="font-medium text-green-600">{formatCurrency(payment.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Paid Date</p>
                      <p className="font-medium">{new Date(payment.paidDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reference</p>
                      <p className="font-medium">{payment.paymentReference}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Loan Type</p>
                <p className="text-lg font-bold">{payment.loanType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">EMI Progress</p>
                <p className="text-lg font-bold">{payment.emiNumber}/{payment.totalEmis}</p>
                <Progress value={(payment.emiNumber / payment.totalEmis) * 100} className="mt-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="text-lg font-bold">{formatCurrency(payment.outstanding)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Due Date</p>
                <p className="text-lg font-bold">{new Date(payment.nextDueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {payment.status !== 'paid' && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" className="text-blue-600 hover:text-blue-700">
              <Phone className="w-4 h-4 mr-2" />
              Call Member
            </Button>
            <Button variant="outline" className="text-green-600 hover:text-green-700">
              <Bell className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>EMI Schedule</CardTitle>
            <CardDescription>Complete repayment schedule for this loan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Array.from({ length: payment.totalEmis }, (_, i) => i + 1).map((emiNum) => (
                <div key={emiNum} className={`flex justify-between items-center p-3 rounded-lg border ${
                  emiNum === payment.emiNumber ? 'bg-yellow-50 border-yellow-200' : 
                  emiNum < payment.emiNumber ? 'bg-green-50 border-green-200' : 
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <span className="font-medium">EMI {emiNum}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(new Date(payment.dueDate).setMonth(new Date(payment.dueDate).getMonth() + (emiNum - payment.emiNumber))).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(payment.emiAmount)}</div>
                    <div className="text-sm">
                      {emiNum < payment.emiNumber ? (
                        <Badge className="bg-green-500 text-white">Paid</Badge>
                      ) : emiNum === payment.emiNumber ? (
                        <Badge className="bg-yellow-500 text-white">Current</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All payment transactions for this loan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payment.status === 'paid' && (
                <div className="flex items-start space-x-3 p-3 border rounded-lg bg-green-50">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">
                      Received {formatCurrency(payment.paidAmount)} via {payment.paymentMethod}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.paidDate).toLocaleString()} • Reference: {payment.paymentReference}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 text-white">Success</Badge>
                  </div>
                </div>
              )}
              
              {payment.status === 'overdue' && (
                <div className="flex items-start space-x-3 p-3 border rounded-lg bg-red-50">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Payment Overdue</p>
                    <p className="text-sm text-muted-foreground">
                      Payment of {formatCurrency(payment.emiAmount)} is {payment.overdueBy} days overdue
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due Date: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500 text-white">Overdue</Badge>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">EMI Scheduled</p>
                  <p className="text-sm text-muted-foreground">
                    EMI {payment.emiNumber} of {payment.totalEmis} scheduled for {new Date(payment.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Amount: {formatCurrency(payment.emiAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Collection Activities Component
function CollectionActivities({ activities }: { activities: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Activities</CardTitle>
        <CardDescription>Recent collection efforts and customer communications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {activity.activity.includes('SMS') && <Bell className="w-4 h-4 text-blue-600" />}
                {activity.activity.includes('Phone') && <Phone className="w-4 h-4 text-blue-600" />}
                {activity.activity.includes('Email') && <Mail className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{activity.activity}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-muted-foreground">Member: {activity.memberName}</span>
                  <span className="text-xs text-muted-foreground">Loan: {activity.loanId}</span>
                  <span className="text-xs text-muted-foreground">By: {activity.performedBy}</span>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Completed</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Manual Payment Form Component
function ManualPaymentForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    memberId: '',
    loanId: '',
    amount: '',
    paymentMethod: '',
    reference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recording manual payment:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="memberId">Member ID</Label>
          <Input
            id="memberId"
            placeholder="M001234"
            value={formData.memberId}
            onChange={(e) => setFormData({...formData, memberId: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="loanId">Loan ID</Label>
          <Input
            id="loanId"
            placeholder="LN001234"
            value={formData.loanId}
            onChange={(e) => setFormData({...formData, loanId: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="amount">Payment Amount (৳)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="5000"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="rocket">Rocket</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="card">Card Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input
            id="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reference">Payment Reference</Label>
        <Input
          id="reference"
          placeholder="Transaction ID or reference number"
          value={formData.reference}
          onChange={(e) => setFormData({...formData, reference: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes about this payment..."
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          <Receipt className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>
    </form>
  );
}
