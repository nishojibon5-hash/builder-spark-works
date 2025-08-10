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
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Shield,
  AlertTriangle,
  Send,
  RefreshCw,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";

interface LoanApplication {
  applicationId: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  language: 'bn' | 'en';
  loanType: string;
  amount: string;
  tenure: string;
  purpose: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  nid: string;
  address: string;
  employmentType: string;
  employer: string;
  monthlyIncome: string;
  existingLoans: string;
  nidVerified?: boolean;
  nidImageData?: string;
  verifiedNidData?: any;
  calculation: {
    principal: number;
    interestRate: number;
    months: number;
    emi: number;
    totalPayable: number;
    totalInterest: number;
  };
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function ApplicationReview() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Load applications from localStorage
  useEffect(() => {
    const loadApplications = () => {
      const stored = localStorage.getItem('loanApplications');
      if (stored) {
        try {
          const apps = JSON.parse(stored);
          setApplications(apps);
        } catch (error) {
          console.error('Error loading applications:', error);
        }
      }
    };

    loadApplications();
    // Set up interval to check for new applications
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'under_review': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getLoanTypeText = (type: string, language: string) => {
    const types = {
      instant: language === 'bn' ? 'তাৎক্ষণিক মাইক্রোলোন' : 'Instant Microloan',
      salary: language === 'bn' ? 'বেতনভোগী ঋণ' : 'Salary Loan',
      consumer: language === 'bn' ? 'ভোক্তা ঋণ' : 'Consumer Loan',
      business: language === 'bn' ? 'ব্যবসায়িক মাইক্রোলোন' : 'Business Microloan'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleApprove = async (application: LoanApplication) => {
    setLoading(true);
    try {
      // Update application status
      const updatedApplication = {
        ...application,
        status: 'approved' as const,
        reviewedBy: 'Admin User',
        reviewedAt: new Date().toISOString()
      };

      // Update in localStorage
      const updatedApplications = applications.map(app =>
        app.applicationId === application.applicationId ? updatedApplication : app
      );
      localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
      setApplications(updatedApplications);

      // Simulate email notification
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Application Approved",
        description: `Loan application ${application.applicationId} has been approved successfully.`,
      });

      setReviewDialog(false);
      setSelectedApplication(null);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (application: LoanApplication) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update application status
      const updatedApplication = {
        ...application,
        status: 'rejected' as const,
        reviewedBy: 'Admin User',
        reviewedAt: new Date().toISOString(),
        rejectionReason
      };

      // Update in localStorage
      const updatedApplications = applications.map(app =>
        app.applicationId === application.applicationId ? updatedApplication : app
      );
      localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
      setApplications(updatedApplications);

      // Simulate email notification
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Application Rejected",
        description: `Rejection email sent to ${application.email || application.phone}.`,
      });

      setRejectDialog(false);
      setRejectionReason("");
      setSelectedApplication(null);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetUnderReview = async (application: LoanApplication) => {
    setLoading(true);
    try {
      const updatedApplication = {
        ...application,
        status: 'under_review' as const,
        reviewedBy: 'Admin User',
        reviewedAt: new Date().toISOString()
      };

      const updatedApplications = applications.map(app =>
        app.applicationId === application.applicationId ? updatedApplication : app
      );
      localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
      setApplications(updatedApplications);

      toast({
        title: "Status Updated",
        description: "Application marked as under review.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    underReview: applications.filter(app => app.status === 'under_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    totalAmount: applications.reduce((sum, app) => sum + (parseFloat(app.amount) || 0), 0)
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Application Review</h1>
            <p className="text-muted-foreground">
              Review and manage loan applications from customers
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Needs immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
              <p className="text-xs text-muted-foreground">Being processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Ready for disbursement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">All applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, phone, email, or application ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              Complete list of loan applications with review actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Loan Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.applicationId}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{application.applicationId}</div>
                        <div className="text-sm text-muted-foreground">
                          {getLoanTypeText(application.loanType, application.language)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-sm text-muted-foreground">{application.phone}</div>
                          {application.nidVerified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              NID Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(parseFloat(application.amount))}</div>
                        <div className="text-sm text-muted-foreground">
                          {application.tenure} months • EMI: {formatCurrency(application.calculation.emi)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(application.status)} text-white`}>
                        {getStatusText(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(application.submittedAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Application Review: {application.applicationId}</DialogTitle>
                              <DialogDescription>
                                Complete application details and verification information
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedApplication && (
                              <ApplicationDetails 
                                application={selectedApplication} 
                                onApprove={handleApprove}
                                onReject={() => setRejectDialog(true)}
                                onSetUnderReview={handleSetUnderReview}
                                loading={loading}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        {application.status === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSetUnderReview(application)}
                              disabled={loading}
                            >
                              <Activity className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(application)}
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No applications found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria.' 
                    : 'New applications will appear here when submitted.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rejection Dialog */}
        <AlertDialog open={rejectDialog} onOpenChange={setRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Application</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting this application. An email will be sent to the applicant.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectionReason("")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedApplication && handleReject(selectedApplication)}
                disabled={!rejectionReason.trim() || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Rejection Email
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

// Application Details Component
function ApplicationDetails({ 
  application, 
  onApprove, 
  onReject, 
  onSetUnderReview, 
  loading 
}: { 
  application: LoanApplication;
  onApprove: (app: LoanApplication) => void;
  onReject: () => void;
  onSetUnderReview: (app: LoanApplication) => void;
  loading: boolean;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const getLoanTypeText = (type: string, language: string) => {
    const types = {
      instant: language === 'bn' ? 'তাৎক্ষণিক মাইক্রোলোন' : 'Instant Microloan',
      salary: language === 'bn' ? 'বেতনভোগী ঋণ' : 'Salary Loan',
      consumer: language === 'bn' ? 'ভোক্তা ঋণ' : 'Consumer Loan',
      business: language === 'bn' ? 'ব্যবসায়িক মাইক্রোলোন' : 'Business Microloan'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Tabs defaultValue="application" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="application">Application Details</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="calculation">Loan Calculation</TabsTrigger>
        <TabsTrigger value="review">Review Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="application" className="space-y-4">
        {/* Loan Information */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Loan Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Loan Type:</span>
              <p className="font-medium">{getLoanTypeText(application.loanType, application.language)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Amount:</span>
              <p className="font-medium">{formatCurrency(parseFloat(application.amount))}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tenure:</span>
              <p className="font-medium">{application.tenure} months</p>
            </div>
            <div>
              <span className="text-muted-foreground">Purpose:</span>
              <p className="font-medium">{application.purpose}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Full Name:</span>
              <p className="font-medium">{application.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <p className="font-medium">{application.phone}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{application.email || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date of Birth:</span>
              <p className="font-medium">{application.dob}</p>
            </div>
            <div>
              <span className="text-muted-foreground">NID Number:</span>
              <p className="font-medium font-mono">{application.nid}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium">{application.address}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Employment Information */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Employment Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Employment Type:</span>
              <p className="font-medium">{application.employmentType}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Employer:</span>
              <p className="font-medium">{application.employer}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Monthly Income:</span>
              <p className="font-medium">{formatCurrency(parseFloat(application.monthlyIncome))}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Existing Loans:</span>
              <p className="font-medium">
                {application.existingLoans ? formatCurrency(parseFloat(application.existingLoans)) : 'None'}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="verification" className="space-y-4">
        {/* NID Verification Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            NID Verification Status
          </h4>
          {application.nidVerified ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-900 font-medium">NID Successfully Verified</span>
              </div>
              {application.verifiedNidData && (
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Verified Name:</span>
                    <p className="font-medium">{application.verifiedNidData.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <p className="font-medium">{application.verifiedNidData.confidence}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <p className="font-medium">{application.verifiedNidData.dateOfBirth}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blood Group:</span>
                    <p className="font-medium">{application.verifiedNidData.bloodGroup}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-900">NID verification not completed</span>
            </div>
          )}
        </div>

        {/* NID Image */}
        {application.nidImageData && (
          <div>
            <h4 className="font-medium mb-2">Captured NID Image</h4>
            <img 
              src={application.nidImageData} 
              alt="NID Card" 
              className="max-w-md rounded-lg border shadow-lg"
            />
          </div>
        )}

        {/* Application Metadata */}
        <div>
          <h4 className="font-medium mb-2">Application Metadata</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Application ID:</span>
              <p className="font-medium font-mono">{application.applicationId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span>
              <p className="font-medium">{application.language === 'bn' ? 'Bengali' : 'English'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted At:</span>
              <p className="font-medium">{new Date(application.submittedAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Current Status:</span>
              <p className="font-medium">{application.status}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="calculation" className="space-y-4">
        <div className="bg-primary/5 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Loan Calculation Details</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Principal Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(application.calculation.principal)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <p className="text-2xl font-bold">{application.calculation.interestRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tenure</p>
              <p className="text-2xl font-bold">{application.calculation.months} months</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(application.calculation.emi)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Payable</p>
              <p className="text-2xl font-bold">{formatCurrency(application.calculation.totalPayable)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-2xl font-bold">{formatCurrency(application.calculation.totalInterest)}</p>
            </div>
          </div>

          {/* Income vs EMI Analysis */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-2">Income Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monthly Income:</span>
                <span className="font-medium">{formatCurrency(parseFloat(application.monthlyIncome))}</span>
              </div>
              <div className="flex justify-between">
                <span>Proposed EMI:</span>
                <span className="font-medium">{formatCurrency(application.calculation.emi)}</span>
              </div>
              <div className="flex justify-between">
                <span>EMI to Income Ratio:</span>
                <span className={`font-medium ${
                  (application.calculation.emi / parseFloat(application.monthlyIncome)) * 100 <= 40 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {((application.calculation.emi / parseFloat(application.monthlyIncome)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="review" className="space-y-4">
        <div className="space-y-6">
          {/* Review Status */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Review Status</h3>
            <div className="flex items-center space-x-4">
              <Badge className={`${application.status === 'approved' ? 'bg-green-500' : 
                                application.status === 'rejected' ? 'bg-red-500' : 
                                application.status === 'under_review' ? 'bg-blue-500' : 
                                'bg-yellow-500'} text-white px-3 py-1`}>
                {application.status === 'pending' && 'Pending Review'}
                {application.status === 'under_review' && 'Under Review'}
                {application.status === 'approved' && 'Approved'}
                {application.status === 'rejected' && 'Rejected'}
              </Badge>
              
              {application.reviewedBy && (
                <div className="text-sm text-muted-foreground">
                  Reviewed by {application.reviewedBy} on {new Date(application.reviewedAt!).toLocaleString()}
                </div>
              )}
            </div>

            {application.rejectionReason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                <p className="text-red-800">{application.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {application.status === 'pending' && (
            <div className="space-y-4">
              <h4 className="font-medium">Review Actions</h4>
              <div className="flex space-x-4">
                <Button
                  onClick={() => onSetUnderReview(application)}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  Mark Under Review
                </Button>
                <Button
                  onClick={() => onApprove(application)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve Application
                </Button>
                <Button
                  onClick={onReject}
                  disabled={loading}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </div>
          )}

          {application.status === 'under_review' && (
            <div className="space-y-4">
              <h4 className="font-medium">Final Review Actions</h4>
              <div className="flex space-x-4">
                <Button
                  onClick={() => onApprove(application)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve Application
                </Button>
                <Button
                  onClick={onReject}
                  disabled={loading}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
