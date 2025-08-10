import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  FileCheck,
  Shield,
  Settings,
  Search,
  BarChart3,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  HelpCircle,
  ChevronDown,
  Home,
  Banknote,
  Calendar,
  Wallet,
  UserCircle
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [pendingApplications, setPendingApplications] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(userData));
    } catch (error) {
      navigate('/admin/login');
    }

    // Load pending applications count
    const loadPendingApplications = () => {
      const stored = localStorage.getItem('loanApplications');
      if (stored) {
        try {
          const apps = JSON.parse(stored);
          const pending = apps.filter((app: any) => app.status === 'pending' || !app.status).length;
          setPendingApplications(pending);
        } catch (error) {
          console.error('Error loading applications:', error);
        }
      }
    };

    loadPendingApplications();
    // Set up interval to check for new applications
    const interval = setInterval(loadPendingApplications, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      title: "Members",
      href: "/admin/members",
      icon: Users,
      badge: "1,234"
    },
    {
      title: "User Profiles",
      href: "/admin/user-profiles",
      icon: UserCircle,
      badge: null
    },
    {
      title: "Application Review",
      href: "/admin/application-review",
      icon: FileCheck,
      badge: pendingApplications > 0 ? pendingApplications.toString() : null
    },
    {
      title: "Loans",
      href: "/admin/loans",
      icon: CreditCard,
      badge: "23",
      subItems: [
        { title: "Applications", href: "/admin/loans/applications" },
        { title: "Active Loans", href: "/admin/loans/active" },
        { title: "Approvals", href: "/admin/loans/approvals" },
        { title: "Disbursements", href: "/admin/loans/disbursements" }
      ]
    },
    {
      title: "Repayments",
      href: "/admin/repayments",
      icon: Receipt,
      badge: "5",
      subItems: [
        { title: "Due Today", href: "/admin/repayments/due" },
        { title: "Overdue", href: "/admin/repayments/overdue" },
        { title: "Payment History", href: "/admin/repayments/history" }
      ]
    },
    {
      title: "KYC Verification",
      href: "/admin/kyc",
      icon: FileCheck,
      badge: "12"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      badge: null
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileCheck,
      badge: null
    },
    {
      title: "Admin Users",
      href: "/admin/users",
      icon: Shield,
      badge: null
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
      subItems: [
        { title: "Loan Products", href: "/admin/settings/products" },
        { title: "Interest Rates", href: "/admin/settings/rates" },
        { title: "Notifications", href: "/admin/settings/notifications" },
        { title: "System Settings", href: "/admin/settings/system" }
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    if (href !== '/admin/dashboard' && location.pathname.startsWith(href)) return true;
    return false;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'admin': return 'bg-blue-500';
      case 'loan_officer': return 'bg-green-500';
      case 'account_manager': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!adminUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">LoanBondhu</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminUser.name}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={`${getRoleColor(adminUser.role)} text-white text-xs`}>
                  {formatRole(adminUser.role)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.href}>
              <Link
                to={item.href}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant={isActive(item.href) ? "secondary" : "outline"} className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
              
              {/* Sub-items */}
              {item.subItems && isActive(item.href) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      to={subItem.href}
                      className={`block px-3 py-1 text-sm rounded-md transition-colors ${
                        location.pathname === subItem.href
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t">
          <div className="space-y-2">
            <Link to="/admin/loans/applications">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                New Applications
                <Badge variant="destructive" className="ml-auto">23</Badge>
              </Button>
            </Link>
            <Link to="/admin/repayments/overdue">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Overdue Payments
                <Badge variant="destructive" className="ml-auto">5</Badge>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search members, loans, transactions..."
                className="pl-10 pr-4 py-2 w-80 text-sm border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{adminUser.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{adminUser.name}</p>
                    <p className="text-xs text-muted-foreground">{adminUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <Link to="/">Customer Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
