import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Calendar,
  Target,
  Wallet,
  PieChart,
  BarChart3,
  Activity,
  Bell,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

// Mock data - In real app, this would come from API
const mockDashboardData = {
  overview: {
    totalMembers: 1234,
    memberGrowth: 12.5,
    totalLoansOutstanding: 45678900,
    loansGrowth: 8.3,
    totalDisbursed: 123456789,
    disbursedGrowth: 15.7,
    totalCollected: 98765432,
    collectedGrowth: 11.2,
    portfolioAtRisk: 2.8,
    riskTrend: -0.5,
    activeLoans: 567,
    activeLoansTrend: 5.2
  },
  todaysActivity: {
    newApplications: 23,
    approvals: 15,
    disbursements: 8,
    repayments: 145,
    overduePayments: 5,
    kycPending: 12
  },
  loanPortfolio: {
    instant: { count: 234, amount: 8950000, percentage: 25 },
    salary: { count: 189, amount: 15670000, percentage: 42 },
    consumer: { count: 89, amount: 18900000, percentage: 28 },
    business: { count: 55, amount: 2128900, percentage: 5 }
  },
  recentApplications: [
    {
      id: "LN001234",
      applicantName: "মোহাম্মদ রহিম",
      loanType: "Salary Loan",
      amount: 150000,
      status: "pending",
      submittedAt: "2024-01-15T10:30:00",
      risk: "low"
    },
    {
      id: "LN001235", 
      applicantName: "ফাতেমা খাতুন",
      loanType: "Instant Microloan",
      amount: 25000,
      status: "approved",
      submittedAt: "2024-01-15T09:15:00",
      risk: "low"
    },
    {
      id: "LN001236",
      applicantName: "আব্দুল করিম",
      loanType: "Business Loan",
      amount: 300000,
      status: "review",
      submittedAt: "2024-01-15T08:45:00",
      risk: "medium"
    }
  ],
  alertsNotifications: [
    {
      id: 1,
      type: "overdue",
      title: "5 Payments Overdue",
      message: "5 loan payments are overdue and require immediate attention",
      priority: "high",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "kyc",
      title: "KYC Documents Pending",
      message: "12 members have pending KYC verification",
      priority: "medium",
      time: "4 hours ago"
    },
    {
      id: 3,
      type: "approval",
      title: "Loan Approvals Required",
      message: "23 loan applications need approval",
      priority: "high",
      time: "6 hours ago"
    }
  ]
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [realApplications, setRealApplications] = useState([]);

  // Load real applications from localStorage
  useEffect(() => {
    const loadApplications = () => {
      const stored = localStorage.getItem('loanApplications');
      if (stored) {
        const apps = JSON.parse(stored);
        setRealApplications(apps);
      }
    };

    loadApplications();
    // Set up interval to check for new applications
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-BD').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'review': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your loan portfolio.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realApplications.length}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                Real-time updates
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockDashboardData.overview.totalMembers + realApplications.length)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +{mockDashboardData.overview.memberGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockDashboardData.overview.totalLoansOutstanding)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +{mockDashboardData.overview.loansGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockDashboardData.overview.totalDisbursed)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +{mockDashboardData.overview.disbursedGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio at Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mockDashboardData.overview.portfolioAtRisk}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                {mockDashboardData.overview.riskTrend}% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Today's Activity</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Applications</CardTitle>
                    <Link to="/admin/loans/applications">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Latest loan applications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDashboardData.recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{application.applicantName}</h4>
                            <Badge variant="outline" className={`${getStatusColor(application.status)} text-white`}>
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{application.loanType} • {formatCurrency(application.amount)}</p>
                          <p className="text-xs text-muted-foreground">ID: {application.id}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getRiskColor(application.risk)}`}>
                            {application.risk.toUpperCase()} RISK
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(application.submittedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/admin/application-review">
                      <Button variant="outline" className="w-full justify-start h-auto p-4 border-orange-200 hover:border-orange-300">
                        <div className="text-left">
                          <div className="flex items-center mb-2">
                            <FileText className="w-4 h-4 mr-2 text-orange-600" />
                            <span className="font-medium text-orange-900">Review Applications</span>
                          </div>
                          <p className="text-xs text-orange-700">{realApplications.length} total</p>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/admin/repayments/overdue">
                      <Button variant="outline" className="w-full justify-start h-auto p-4">
                        <div className="text-left">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span className="font-medium">Overdue Payments</span>
                          </div>
                          <p className="text-xs text-muted-foreground">5 overdue</p>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/admin/kyc">
                      <Button variant="outline" className="w-full justify-start h-auto p-4">
                        <div className="text-left">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">KYC Verification</span>
                          </div>
                          <p className="text-xs text-muted-foreground">12 pending</p>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/admin/analytics">
                      <Button variant="outline" className="w-full justify-start h-auto p-4">
                        <div className="text-left">
                          <div className="flex items-center mb-2">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            <span className="font-medium">View Analytics</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Generate reports</p>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Today's Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{mockDashboardData.todaysActivity.newApplications}</div>
                  <p className="text-xs text-muted-foreground">Applications submitted today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approvals</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockDashboardData.todaysActivity.approvals}</div>
                  <p className="text-xs text-muted-foreground">Loans approved today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disbursements</CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{mockDashboardData.todaysActivity.disbursements}</div>
                  <p className="text-xs text-muted-foreground">Loans disbursed today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Repayments</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockDashboardData.todaysActivity.repayments}</div>
                  <p className="text-xs text-muted-foreground">Payments received today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{mockDashboardData.todaysActivity.overduePayments}</div>
                  <p className="text-xs text-muted-foreground">Overdue payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">KYC Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{mockDashboardData.todaysActivity.kycPending}</div>
                  <p className="text-xs text-muted-foreground">KYC verifications pending</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loan Portfolio Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Loan Portfolio by Product</CardTitle>
                  <CardDescription>Distribution of active loans by product type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockDashboardData.loanPortfolio).map(([key, data]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{key} Loans</span>
                          <span>{data.count} loans • {formatCurrency(data.amount)}</span>
                        </div>
                        <Progress value={data.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground text-right">
                          {data.percentage}% of portfolio
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Collection Rate</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">96.2%</div>
                        <div className="text-xs text-muted-foreground">This month</div>
                      </div>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Loan Size</span>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(185000)}</div>
                        <div className="text-xs text-muted-foreground">+5.2% vs last month</div>
                      </div>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Loans</span>
                      <div className="text-right">
                        <div className="text-lg font-bold">{mockDashboardData.overview.activeLoans}</div>
                        <div className="text-xs text-muted-foreground">+{mockDashboardData.overview.activeLoansTrend}% growth</div>
                      </div>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Approval Rate</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">78.5%</div>
                        <div className="text-xs text-muted-foreground">Last 30 days</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alerts & Notifications</CardTitle>
                <CardDescription>Important system alerts requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDashboardData.alertsNotifications.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      {getPriorityIcon(alert.priority)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{alert.title}</h4>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}>
                            {alert.priority.toUpperCase()} PRIORITY
                          </Badge>
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
