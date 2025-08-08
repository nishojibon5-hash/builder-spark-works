import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Phone, CreditCard, Calculator, User, Shield, Smartphone, Download } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const location = useLocation();

  const text = {
    bn: {
      companyName: "ঋণবন্ধু",
      tagline: "আপনার বিশ্বস্ত ঋণের সাথী",
      menu: {
        home: "হোম",
        loans: "ঋণ",
        calculator: "ক্যালকুলেটর",
        about: "আমাদের সম্পর্কে",
        contact: "যোগাযোগ",
        login: "লগইন",
        adminLogin: "অ্যাডমিন লগইন",
        apply: "আবেদন করুন"
      },
      contact: {
        phone: "ফোন: ০১৭xxxxxxxx",
        support: "সাহায্য: ২৪/৭"
      }
    },
    en: {
      companyName: "LoanBondhu",
      tagline: "Your Trusted Loan Partner",
      menu: {
        home: "Home",
        loans: "Loans",
        calculator: "Calculator",
        about: "About",
        contact: "Contact",
        login: "Login",
        adminLogin: "Admin Login",
        apply: "Apply Now"
      },
      contact: {
        phone: "Phone: 017xxxxxxxx",
        support: "Support: 24/7"
      }
    }
  };

  const currentText = text[language];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{currentText.companyName}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{currentText.tagline}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-foreground'
                }`}
              >
                {currentText.menu.home}
              </Link>
              <Link 
                to="/loans" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/loans') ? 'text-primary' : 'text-foreground'
                }`}
              >
                {currentText.menu.loans}
              </Link>
              <Link 
                to="/calculator" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/calculator') ? 'text-primary' : 'text-foreground'
                }`}
              >
                {currentText.menu.calculator}
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/about') ? 'text-primary' : 'text-foreground'
                }`}
              >
                {currentText.menu.about}
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/contact') ? 'text-primary' : 'text-foreground'
                }`}
              >
                {currentText.menu.contact}
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="hidden sm:flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs">{language === 'bn' ? 'EN' : 'বাং'}</span>
              </Button>

              {/* Login Button */}
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <User className="w-4 h-4 mr-2" />
                {currentText.menu.login}
              </Button>

              {/* Admin Login Button */}
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-orange-500 text-orange-600 hover:bg-orange-50" asChild>
                <Link to="/admin/login">
                  <Shield className="w-4 h-4 mr-2" />
                  {currentText.menu.adminLogin}
                </Link>
              </Button>

              {/* Apply Button */}
              <Button size="sm" asChild>
                <Link to="/apply">
                  {currentText.menu.apply}
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/') 
                    ? 'text-primary bg-accent' 
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {currentText.menu.home}
              </Link>
              <Link
                to="/loans"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/loans') 
                    ? 'text-primary bg-accent' 
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {currentText.menu.loans}
              </Link>
              <Link
                to="/calculator"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/calculator') 
                    ? 'text-primary bg-accent' 
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {currentText.menu.calculator}
              </Link>
              <Link
                to="/about"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/about') 
                    ? 'text-primary bg-accent' 
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {currentText.menu.about}
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/contact') 
                    ? 'text-primary bg-accent' 
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {currentText.menu.contact}
              </Link>
              
              <div className="pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                  className="w-full justify-start mb-2"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                  <User className="w-4 h-4 mr-2" />
                  {currentText.menu.login}
                </Button>

                <Button variant="outline" size="sm" className="w-full justify-start mb-2 border-orange-500 text-orange-600 hover:bg-orange-50" asChild>
                  <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-4 h-4 mr-2" />
                    {currentText.menu.adminLogin}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{currentText.companyName}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{currentText.tagline}</p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {currentText.contact.phone}
                </p>
                <p className="text-sm text-muted-foreground">{currentText.contact.support}</p>
              </div>
            </div>

            {/* Download App */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {language === 'bn' ? 'মোবাইল অ্যাপ' : 'Mobile App'}
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'সুবিধাজনক মোবাইল অ্যাপ ডাউনলোড করুন' : 'Download our convenient mobile app'}
                </p>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // Download the APK file
                    const link = document.createElement('a');
                    link.href = '/LoanBondhu.apk';
                    link.download = 'LoanBondhu.apk';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'APK ডাউনলোড' : 'Download APK'}
                </Button>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Smartphone className="w-4 h-4 mr-1" />
                  {language === 'bn' ? 'Android 5.0+ প্রয়োজন' : 'Requires Android 5.0+'}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/loans" className="text-sm text-muted-foreground hover:text-primary transition-colors">{currentText.menu.loans}</Link></li>
                <li><Link to="/calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">{currentText.menu.calculator}</Link></li>
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{currentText.menu.about}</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{currentText.menu.contact}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {language === 'bn' ? 'আ��নি' : 'Legal'}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
                </Link></li>
                <li><Link to="/compliance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === 'bn' ? 'নিয়মকানুন' : 'Compliance'}
                </Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 {currentText.companyName}. {language === 'bn' ? 'সকল অধিকার সংরক্ষিত।' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
