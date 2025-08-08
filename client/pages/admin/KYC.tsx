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
  FileText,
  Upload,
  Image as ImageIcon,
  Zoom,
  RotateCw,
  RotateCcw,
  User,
  Camera,
  IdCard,
  CreditCard,
  Building,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Flag,
  Fingerprint
} from "lucide-react";

// Mock KYC data
const mockKYCApplications = [
  {
    id: "KYC001234",
    memberId: "M001234",
    memberName: "মোহাম্মদ রহিম",
    memberEmail: "rahim@email.com",
    memberPhone: "01712345678",
    submittedAt: "2024-01-15T10:30:00",
    status: "pending_review",
    priority: "high",
    assignedTo: "KYC Officer 1",
    documents: [
      {
        id: "DOC001",
        type: "National ID (NID)",
        category: "identity",
        frontImage: "/api/placeholder/400/250",
        backImage: "/api/placeholder/400/250",
        extractedData: {
          nidNumber: "1234567890123",
          fullName: "মোহাম্মদ রহিম",
          fatherName: "আব্দুল রহিম",
          motherName: "ফাতেমা বেগম",
          dateOfBirth: "1990-05-15",
          address: "House 123, Road 5, Dhanmondi, Dhaka"
        },
        ocrConfidence: 95,
        verificationStatus: "pending",
        uploadedAt: "2024-01-15T10:00:00"
      },
      {
        id: "DOC002",
        type: "Selfie with NID",
        category: "verification",
        frontImage: "/api/placeholder/300/400",
        extractedData: null,
        ocrConfidence: null,
        verificationStatus: "pending",
        uploadedAt: "2024-01-15T10:15:00"
      },
      {
        id: "DOC003",
        type: "Bank Statement",
        category: "financial",
        frontImage: "/api/placeholder/400/600",
        extractedData: {
          bankName: "ABC Bank Limited",
          accountNumber: "1234567890",
          accountHolderName: "Mohammad Rahim",
          lastTransactionDate: "2024-01-10",
          averageBalance: "45000"
        },
        ocrConfidence: 88,
        verificationStatus: "pending",
        uploadedAt: "2024-01-15T10:30:00"
      }
    ],
    verificationChecks: {
      nameMatch: { status: "pass", confidence: 98 },
      dateOfBirthMatch: { status: "pass", confidence: 100 },
      addressVerification: { status: "pending", confidence: null },
      faceMatch: { status: "pending", confidence: null },
      duplicateCheck: { status: "pass", confidence: 100 },
      blacklistCheck: { status: "pass", confidence: 100 }
    },
    notes: [],
    lastActivity: "2024-01-15T10:30:00"
  },
  {
    id: "KYC001235",
    memberId: "M001235",
    memberName: "ফাতেমা খাতুন",
    memberEmail: "fatema@email.com",
    memberPhone: "01987654321",
    submittedAt: "2024-01-14T16:45:00",
    status: "approved",
    priority: "medium",
    assignedTo: "KYC Officer 2",
    documents: [
      {
        id: "DOC004",
        type: "National ID (NID)",
        category: "identity",
        frontImage: "/api/placeholder/400/250",
        backImage: "/api/placeholder/400/250",
        extractedData: {
          nidNumber: "9876543210987",
          fullName: "ফাতেমা খাতুন",
          fatherName: "মোহাম্মদ আলী",
          motherName: "রাবেয়া খাতুন",
          dateOfBirth: "1985-08-22",
          address: "House 456, Road 10, Chittagong"
        },
        ocrConfidence: 97,
        verificationStatus: "verified",
        uploadedAt: "2024-01-14T16:00:00"
      },
      {
        id: "DOC005",
        type: "Selfie with NID",
        category: "verification",
        frontImage: "/api/placeholder/300/400",
        extractedData: null,
        ocrConfidence: null,
        verificationStatus: "verified",
        uploadedAt: "2024-01-14T16:15:00"
      }
    ],
    verificationChecks: {
      nameMatch: { status: "pass", confidence: 99 },
      dateOfBirthMatch: { status: "pass", confidence: 100 },
      addressVerification: { status: "pass", confidence: 95 },
      faceMatch: { status: "pass", confidence: 92 },
      duplicateCheck: { status: "pass", confidence: 100 },
      blacklistCheck: { status: "pass", confidence: 100 }
    },
    notes: [
      {
        id: 1,
        author: "KYC Officer 2",
        content: "All documents verified successfully. Clear face match and no duplicate records found.",
        timestamp: "2024-01-15T09:00:00",
        type: "approval"
      }
    ],
    lastActivity: "2024-01-15T09:00:00",
    approvedAt: "2024-01-15T09:00:00",
    approvedBy: "KYC Officer 2"
  },
  {
    id: "KYC001236",
    memberId: "M001236",
    memberName: "আব্দুল করিম",
    memberEmail: "karim@email.com",
    memberPhone: "01555666777",
    submittedAt: "2024-01-13T11:20:00",
    status: "rejected",
    priority: "low",
    assignedTo: "KYC Officer 1",
    documents: [
      {
        id: "DOC006",
        type: "National ID (NID)",
        category: "identity",
        frontImage: "/api/placeholder/400/250",
        backImage: "/api/placeholder/400/250",
        extractedData: {
          nidNumber: "5555666777888",
          fullName: "আব্দুল করিম",
          fatherName: "মোহাম্মদ করিম",
          motherName: "সালমা বেগম",
          dateOfBirth: "1988-03-10",
          address: "House 789, Road 15, Sylhet"
        },
        ocrConfidence: 75,
        verificationStatus: "rejected",
        uploadedAt: "2024-01-13T11:00:00"
      }
    ],
    verificationChecks: {
      nameMatch: { status: "fail", confidence: 45 },
      dateOfBirthMatch: { status: "fail", confidence: 20 },
      addressVerification: { status: "fail", confidence: 30 },
      faceMatch: { status: "pending", confidence: null },
      duplicateCheck: { status: "pass", confidence: 100 },
      blacklistCheck: { status: "pass", confidence: 100 }
    },
    notes: [
      {
        id: 1,
        author: "KYC Officer 1",
        content: "Document quality is poor. OCR extraction confidence is below threshold. Name and DOB mismatch with application data.",
        timestamp: "2024-01-14T10:00:00",
        type: "rejection"
      }
    ],
    lastActivity: "2024-01-14T10:00:00",
    rejectedAt: "2024-01-14T10:00:00",
    rejectedBy: "KYC Officer 1"
  }
];

export default function AdminKYC() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [filteredKYC, setFilteredKYC] = useState(mockKYCApplications);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    let filtered = mockKYCApplications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(kyc =>
        kyc.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.memberPhone.includes(searchTerm) ||
        kyc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.memberId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(kyc => kyc.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(kyc => kyc.priority === priorityFilter);
    }

    setFilteredKYC(filtered);
  }, [searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-500';
      case 'under_review': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'resubmission_required': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_review': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'resubmission_required': return 'Resubmission Required';
      default: return status;
    }
  };

  // Filter KYC by status for tabs
  const pendingKYC = mockKYCApplications.filter(kyc => ['pending_review', 'under_review'].includes(kyc.status));
  const approvedKYC = mockKYCApplications.filter(kyc => kyc.status === 'approved');
  const rejectedKYC = mockKYCApplications.filter(kyc => kyc.status === 'rejected');

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
            <p className="text-muted-foreground">
              Review and verify customer identity documents and compliance
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
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
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingKYC.length}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-xs text-muted-foreground">
                Verified and approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">
                Failed verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">92.5%</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending ({pendingKYC.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedKYC.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedKYC.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All KYC ({mockKYCApplications.length})
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
                      placeholder="Search by member name, email, phone, or KYC ID..."
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
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KYC Tables */}
          <TabsContent value="pending">
            <KYCTable 
              applications={pendingKYC} 
              onViewDetails={setSelectedKYC}
              showActions={true}
              title="Pending KYC Applications"
              description="Applications awaiting review and verification"
            />
          </TabsContent>

          <TabsContent value="approved">
            <KYCTable 
              applications={approvedKYC} 
              onViewDetails={setSelectedKYC}
              showActions={false}
              title="Approved KYC Applications"
              description="Successfully verified and approved applications"
            />
          </TabsContent>

          <TabsContent value="rejected">
            <KYCTable 
              applications={rejectedKYC} 
              onViewDetails={setSelectedKYC}
              showActions={false}
              title="Rejected KYC Applications"
              description="Applications that failed verification"
            />
          </TabsContent>

          <TabsContent value="all">
            <KYCTable 
              applications={filteredKYC} 
              onViewDetails={setSelectedKYC}
              showActions={true}
              title="All KYC Applications"
              description="Complete list of KYC applications"
            />
          </TabsContent>
        </Tabs>

        {/* KYC Details Dialog */}
        {selectedKYC && (
          <Dialog open={!!selectedKYC} onOpenChange={() => setSelectedKYC(null)}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>KYC Verification: {selectedKYC.id}</DialogTitle>
                <DialogDescription>
                  Complete KYC review and document verification
                </DialogDescription>
              </DialogHeader>
              
              <KYCDetails kyc={selectedKYC} onUpdate={() => setSelectedKYC(null)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}

// KYC Table Component
function KYCTable({ 
  applications, 
  onViewDetails, 
  showActions,
  title,
  description
}: { 
  applications: any[]; 
  onViewDetails: (kyc: any) => void;
  showActions: boolean;
  title: string;
  description: string;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-500';
      case 'under_review': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'resubmission_required': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_review': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'resubmission_required': return 'Resubmission Required';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({applications.length})</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Verification Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((kyc) => (
              <TableRow key={kyc.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>{kyc.memberName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{kyc.memberName}</div>
                      <div className="text-sm text-muted-foreground">{kyc.memberPhone}</div>
                      <div className="text-sm text-muted-foreground">ID: {kyc.memberId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{kyc.documents.length} documents</div>
                    <div className="flex flex-wrap gap-1">
                      {kyc.documents.map((doc: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {Object.entries(kyc.verificationChecks).map(([check, result]: [string, any]) => (
                      <div key={check} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          result.status === 'pass' ? 'bg-green-500' : 
                          result.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-xs">{check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`font-medium ${getPriorityColor(kyc.priority)}`}>
                    {kyc.priority.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Assigned to: {kyc.assignedTo}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(kyc.status)} text-white`}>
                    {getStatusDisplay(kyc.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(kyc.submittedAt).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(kyc.submittedAt).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(kyc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {showActions && ['pending_review', 'under_review'].includes(kyc.status) && (
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
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
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

// KYC Details Component
function KYCDetails({ kyc, onUpdate }: { kyc: any; onUpdate: () => void }) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [newNote, setNewNote] = useState("");

  const handleApprove = () => {
    console.log("Approving KYC:", kyc.id);
    onUpdate();
  };

  const handleReject = () => {
    console.log("Rejecting KYC:", kyc.id);
    onUpdate();
  };

  const addNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote);
      setNewNote("");
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="text-lg">{kyc.memberName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{kyc.memberName}</h3>
                  <p className="text-muted-foreground">Member ID: {kyc.memberId}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge className={`${getStatusColor(kyc.status)} text-white`}>
                      {getStatusDisplay(kyc.status)}
                    </Badge>
                    <Badge variant="outline">{kyc.priority.toUpperCase()} Priority</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{kyc.memberPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{kyc.memberEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Submitted: {new Date(kyc.submittedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Assigned to: {kyc.assignedTo}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Summary */}
          <Card>
            <CardHeader>
              <CardTitle>KYC Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Documents Submitted</h4>
                <div className="space-y-2">
                  {kyc.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{doc.type}</span>
                      </div>
                      <Badge variant={doc.verificationStatus === 'verified' ? 'default' : doc.verificationStatus === 'rejected' ? 'destructive' : 'secondary'}>
                        {doc.verificationStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Verification Progress</h4>
                <div className="space-y-2">
                  {Object.entries(kyc.verificationChecks).map(([check, result]: [string, any]) => (
                    <div key={check} className="flex items-center justify-between">
                      <span className="text-sm">{check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <div className="flex items-center space-x-2">
                        {result.confidence && (
                          <span className="text-xs text-muted-foreground">{result.confidence}%</span>
                        )}
                        <div className={`w-3 h-3 rounded-full ${
                          result.status === 'pass' ? 'bg-green-500' : 
                          result.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {['pending_review', 'under_review'].includes(kyc.status) && (
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleReject}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject KYC
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve KYC
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kyc.documents.map((doc: any) => (
            <DocumentCard key={doc.id} document={doc} onView={setSelectedDocument} />
          ))}
        </div>

        {/* Document Viewer Dialog */}
        {selectedDocument && (
          <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{selectedDocument.type}</DialogTitle>
                <DialogDescription>
                  Document verification and OCR data extraction
                </DialogDescription>
              </DialogHeader>
              
              <DocumentViewer document={selectedDocument} />
            </DialogContent>
          </Dialog>
        )}
      </TabsContent>

      <TabsContent value="verification" className="space-y-4">
        <VerificationChecks checks={kyc.verificationChecks} />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>KYC History & Notes</CardTitle>
            <CardDescription>Timeline of KYC verification process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kyc.notes.map((note: any) => (
                <div key={note.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{note.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{note.author}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{note.content}</p>
                  </div>
                  <Badge variant={note.type === 'approval' ? 'default' : note.type === 'rejection' ? 'destructive' : 'secondary'}>
                    {note.type}
                  </Badge>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="new-note">Add Note</Label>
                  <Textarea
                    id="new-note"
                    placeholder="Add a note about this KYC verification..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
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

// Document Card Component
function DocumentCard({ document, onView }: { document: any; onView: (doc: any) => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onView(document)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{document.type}</CardTitle>
          <Badge variant={document.verificationStatus === 'verified' ? 'default' : document.verificationStatus === 'rejected' ? 'destructive' : 'secondary'}>
            {document.verificationStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Category:</span>
            <span className="font-medium">{document.category}</span>
          </div>
          {document.ocrConfidence && (
            <div className="flex justify-between text-xs">
              <span>OCR Confidence:</span>
              <span className={`font-medium ${document.ocrConfidence > 90 ? 'text-green-600' : document.ocrConfidence > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {document.ocrConfidence}%
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span>Uploaded:</span>
            <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Document Viewer Component
function DocumentViewer({ document }: { document: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Document Image */}
      <div className="space-y-4">
        <h3 className="font-medium">Document Image</h3>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Document Preview</span>
        </div>
        
        {document.backImage && (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Back Side</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Zoom className="w-4 h-4 mr-2" />
            Zoom
          </Button>
          <Button variant="outline" size="sm">
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate
          </Button>
        </div>
      </div>

      {/* Extracted Data */}
      <div className="space-y-4">
        <h3 className="font-medium">Extracted Data</h3>
        
        {document.extractedData ? (
          <div className="space-y-3">
            {Object.entries(document.extractedData).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <span className="text-sm">{value}</span>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">OCR Confidence:</span>
                <div className="flex items-center space-x-2">
                  <Progress value={document.ocrConfidence} className="w-20" />
                  <span className={`text-sm font-medium ${document.ocrConfidence > 90 ? 'text-green-600' : document.ocrConfidence > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {document.ocrConfidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border rounded-lg text-center text-muted-foreground">
            No extractable data for this document type
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          <Button variant="outline" className="text-green-600 hover:text-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify Document
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <XCircle className="w-4 h-4 mr-2" />
            Reject Document
          </Button>
        </div>
      </div>
    </div>
  );
}

// Verification Checks Component
function VerificationChecks({ checks }: { checks: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(checks).map(([checkName, result]: [string, any]) => (
        <Card key={checkName}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              {checkName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              <div className={`w-3 h-3 rounded-full ${
                result.status === 'pass' ? 'bg-green-500' : 
                result.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status:</span>
                <Badge variant={result.status === 'pass' ? 'default' : result.status === 'fail' ? 'destructive' : 'secondary'}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
              {result.confidence && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={result.confidence} className="w-16" />
                    <span className="text-sm font-medium">{result.confidence}%</span>
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {getCheckDescription(checkName, result)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getCheckDescription(checkName: string, result: any) {
  switch (checkName) {
    case 'nameMatch':
      return result.status === 'pass' ? 'Name matches across all documents' : 'Name mismatch detected';
    case 'dateOfBirthMatch':
      return result.status === 'pass' ? 'Date of birth is consistent' : 'Date of birth mismatch';
    case 'addressVerification':
      return result.status === 'pass' ? 'Address verified successfully' : 'Address verification failed';
    case 'faceMatch':
      return result.status === 'pass' ? 'Selfie matches ID photo' : 'Face verification failed';
    case 'duplicateCheck':
      return result.status === 'pass' ? 'No duplicate records found' : 'Duplicate record detected';
    case 'blacklistCheck':
      return result.status === 'pass' ? 'Not found in blacklist' : 'Found in blacklist database';
    default:
      return 'Verification check completed';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending_review': return 'bg-yellow-500';
    case 'under_review': return 'bg-blue-500';
    case 'approved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    case 'resubmission_required': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
}

function getStatusDisplay(status: string) {
  switch (status) {
    case 'pending_review': return 'Pending Review';
    case 'under_review': return 'Under Review';
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    case 'resubmission_required': return 'Resubmission Required';
    default: return status;
  }
}
