import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { 
  Calculator, 
  CreditCard, 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  Home,
  Banknote
} from "lucide-react";

export default function Apply() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    tenure: '',
    purpose: '',
    name: '',
    phone: '',
    email: '',
    dob: '',
    nid: '',
    address: '',
    employmentType: '',
    employer: '',
    monthlyIncome: '',
    existingLoans: ''
  });

  const [calculation, setCalculation] = useState({
    principal: 0,
    interestRate: 0,
    months: 0,
    emi: 0,
    totalPayable: 0,
    totalInterest: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const text = {
    bn: {
      title: "ঋণের আবেদন",
      subtitle: "সহজ পদ্ধতিতে আপনার ঋণের আবেদন সম্পন্ন করুন",
      steps: {
        loan: "ঋণের তথ্য",
        personal: "ব্যক্তিগত তথ্য",
        employment: "চাকরির তথ্য",
        review: "পর্যালোচনা"
      },
      loanDetails: {
        title: "ঋণের বিবরণ",
        type: "ঋণের ধরন",
        amount: "ঋণের পরিমাণ (টাকা)",
        tenure: "মেয়াদ (মাস)",
        purpose: "ঋণের উদ্দেশ্য",
        selectType: "ঋণ��র ধরন নির্বাচন করুন",
        selectTenure: "মেয়াদ নির্বাচন করুন",
        enterAmount: "পরিমাণ লি���ুন",
        describePurpose: "ঋণের উদ্দেশ্য বর্ণনা করুন"
      },
      loanTypes: {
        instant: "তাৎক্ষণিক মাইক্রোলোন",
        salary: "বেতনভোগী ঋণ", 
        consumer: "ভোক্তা ঋণ",
        business: "ব্যবসায়িক মাইক্রোলোন"
      },
      personalInfo: {
        title: "ব্যক্তিগত তথ্য",
        name: "পূর্ণ নাম",
        phone: "মোবাইল নম্বর",
        email: "ইমেইল (ঐচ্ছিক)",
        dob: "জন্ম তারিখ",
        nid: "জাতীয় পরিচয়পত্র নম্বর",
        address: "ঠিকানা",
        enterName: "আপনার পূর্ণ নাম লিখুন",
        enterPhone: "মোবাইল নম্বর লিখুন",
        enterEmail: "ইমেইল ঠিকানা লিখুন",
        enterAddress: "সম্পূর্ণ ঠিকানা ল��খুন"
      },
      employmentInfo: {
        title: "চাকরি ও আয়ের তথ্য",
        type: "চাকরির ধরন",
        employer: "প্রতিষ্ঠানের নাম",
        income: "মাসিক আয় (টাকা)",
        existingLoans: "বর্তমান ঋণ (টাকা)",
        selectEmployment: "চাকরির ধরন নির্বাচন করুন",
        enterEmployer: "প্রতিষ্ঠানের নাম লিখুন",
        enterIncome: "মাসিক আয় লিখুন",
        enterExistingLoans: "বর্তমান ঋণের পরিমাণ লিখুন (যদি থাকে)"
      },
      employmentTypes: {
        salaried: "বেতনভোগী কর্মচারী",
        business: "ব্যবসায়ী",
        freelancer: "ফ্রিল্যান্সার",
        other: "অন্যান্য"
      },
      calculator: {
        title: "ঋণ ক্যালকুলেটর",
        subtitle: "আপনার মাসিক কিস্তি এবং মোট পরিশোধের পরিমাণ দেখুন",
        principal: "মূল অর্থ",
        rate: "সুদের হার (বার্ষিক)",
        emi: "মাসিক কিস্তি",
        total: "মোট পরিশোধ",
        interest: "মো�� সুদ",
        calculate: "গণনা করুন"
      },
      review: {
        title: "আবেদন পর্যালোচনা",
        subtitle: "জমা দেওয়ার আগে আপনার তথ্য যাচাই করুন",
        loanInfo: "ঋণের তথ্য",
        personalInfo: "ব্যক্তিগত তথ্য",
        employmentInfo: "চাকরির তথ্য",
        calculatedEmi: "গণনাকৃত EMI"
      },
      buttons: {
        next: "পরবর্তী",
        previous: "পূর্ববর্তী",
        submit: "আবেদন জমা দিন",
        calculate: "গণনা করুন"
      },
      validation: {
        required: "এই ক্ষেত্রটি আবশ্যক",
        invalidPhone: "সঠিক মোবাইল নম্বর দিন",
        invalidEmail: "সঠিক ইমেইল ঠিকানা দিন",
        invalidAmount: "সঠিক পরিমাণ দিন"
      }
    },
    en: {
      title: "Loan Application",
      subtitle: "Complete your loan application in simple steps",
      steps: {
        loan: "Loan Details",
        personal: "Personal Info",
        employment: "Employment Info",
        review: "Review"
      },
      loanDetails: {
        title: "Loan Details",
        type: "Loan Type",
        amount: "Loan Amount (৳)",
        tenure: "Tenure (Months)",
        purpose: "Loan Purpose",
        selectType: "Select loan type",
        selectTenure: "Select tenure",
        enterAmount: "Enter amount",
        describePurpose: "Describe loan purpose"
      },
      loanTypes: {
        instant: "Instant Microloan",
        salary: "Salary Loan",
        consumer: "Consumer Loan", 
        business: "Business Microloan"
      },
      personalInfo: {
        title: "Personal Information",
        name: "Full Name",
        phone: "Mobile Number",
        email: "Email (Optional)",
        dob: "Date of Birth",
        nid: "National ID Number",
        address: "Address",
        enterName: "Enter your full name",
        enterPhone: "Enter mobile number",
        enterEmail: "Enter email address",
        enterAddress: "Enter complete address"
      },
      employmentInfo: {
        title: "Employment & Income Information",
        type: "Employment Type",
        employer: "Employer Name",
        income: "Monthly Income (৳)",
        existingLoans: "Existing Loans (৳)",
        selectEmployment: "Select employment type",
        enterEmployer: "Enter employer name",
        enterIncome: "Enter monthly income",
        enterExistingLoans: "Enter existing loan amount (if any)"
      },
      employmentTypes: {
        salaried: "Salaried Employee",
        business: "Business Owner",
        freelancer: "Freelancer",
        other: "Other"
      },
      calculator: {
        title: "Loan Calculator",
        subtitle: "See your monthly EMI and total repayment amount",
        principal: "Principal Amount",
        rate: "Interest Rate (Annual)",
        emi: "Monthly EMI",
        total: "Total Repayment",
        interest: "Total Interest",
        calculate: "Calculate"
      },
      review: {
        title: "Application Review",
        subtitle: "Verify your information before submission",
        loanInfo: "Loan Information",
        personalInfo: "Personal Information", 
        employmentInfo: "Employment Information",
        calculatedEmi: "Calculated EMI"
      },
      buttons: {
        next: "Next",
        previous: "Previous", 
        submit: "Submit Application",
        calculate: "Calculate"
      },
      validation: {
        required: "This field is required",
        invalidPhone: "Please enter a valid mobile number",
        invalidEmail: "Please enter a valid email address",
        invalidAmount: "Please enter a valid amount"
      }
    }
  };

  const currentText = text[language];

  const calculateLoan = () => {
    const principal = parseFloat(formData.amount);
    const annualRate = getInterestRate(formData.loanType);
    const months = parseInt(formData.tenure);

    if (principal && annualRate && months) {
      const monthlyRate = annualRate / 100 / 12;
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayable = emi * months;
      const totalInterest = totalPayable - principal;

      setCalculation({
        principal,
        interestRate: annualRate,
        months,
        emi: Math.round(emi),
        totalPayable: Math.round(totalPayable),
        totalInterest: Math.round(totalInterest)
      });
    }
  };

  const getInterestRate = (loanType: string) => {
    const rates = {
      instant: 18,
      salary: 15,
      consumer: 16,
      business: 20
    };
    return rates[loanType as keyof typeof rates] || 18;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate when amount or tenure changes
    if (field === 'amount' || field === 'tenure' || field === 'loanType') {
      setTimeout(calculateLoan, 100);
    }
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.loanType && formData.amount && formData.tenure && formData.purpose;
      case 2:
        return formData.name && formData.phone && formData.dob && formData.nid && formData.address;
      case 3:
        return formData.employmentType && formData.employer && formData.monthlyIncome;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare submission data
      const applicationData = {
        ...formData,
        calculation,
        applicationId: `LB${Date.now()}`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        language
      };

      // Store in localStorage for demo purposes (in real app, this would be an API call)
      const existingApplications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      existingApplications.push(applicationData);
      localStorage.setItem('loanApplications', JSON.stringify(existingApplications));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success page component
  if (submitSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {language === 'bn' ? 'আবেদন সফলভাবে জমা হয়েছে!' : 'Application Submitted Successfully!'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'bn'
                ? 'আপনার ঋণের আবেদন আমাদের কাছে পৌঁছে���ে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
                : 'Your loan application has been received. We will contact you shortly.'}
            </p>
            <div className="bg-muted rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">
                {language === 'bn' ? 'আবেদন নম্বর:' : 'Application ID:'}
              </h3>
              <p className="text-2xl font-mono">{`LB${Date.now()}`.slice(0, 12)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => {
                setSubmitSuccess(false);
                setStep(1);
                setFormData({
                  loanType: '',
                  amount: '',
                  tenure: '',
                  purpose: '',
                  name: '',
                  phone: '',
                  email: '',
                  dob: '',
                  nid: '',
                  address: '',
                  employmentType: '',
                  employer: '',
                  monthlyIncome: '',
                  existingLoans: ''
                });
                setCalculation({
                  principal: 0,
                  interestRate: 0,
                  months: 0,
                  emi: 0,
                  totalPayable: 0,
                  totalInterest: 0
                });
              }}>
                <CreditCard className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'নতুন আবেদন' : 'New Application'}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {currentText.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`h-1 w-full mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentText.steps.loan}</span>
            <span>{currentText.steps.personal}</span>
            <span>{currentText.steps.employment}</span>
            <span>{currentText.steps.review}</span>
          </div>
          
          <Progress value={(step / 4) * 100} className="mt-4" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {step === 1 && <CreditCard className="w-5 h-5 mr-2" />}
                    {step === 2 && <User className="w-5 h-5 mr-2" />}
                    {step === 3 && <Building className="w-5 h-5 mr-2" />}
                    {step === 4 && <FileText className="w-5 h-5 mr-2" />}
                    {step === 1 && currentText.loanDetails.title}
                    {step === 2 && currentText.personalInfo.title}
                    {step === 3 && currentText.employmentInfo.title}
                    {step === 4 && currentText.review.title}
                  </CardTitle>
                  <CardDescription>
                    {step === 4 ? currentText.review.subtitle : `${language === 'bn' ? 'ধাপ' : 'Step'} ${step} ${language === 'bn' ? 'এর' : 'of'} 4`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Loan Details */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="loanType">{currentText.loanDetails.type}</Label>
                        <Select value={formData.loanType} onValueChange={(value) => handleInputChange('loanType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={currentText.loanDetails.selectType} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instant">{currentText.loanTypes.instant}</SelectItem>
                            <SelectItem value="salary">{currentText.loanTypes.salary}</SelectItem>
                            <SelectItem value="consumer">{currentText.loanTypes.consumer}</SelectItem>
                            <SelectItem value="business">{currentText.loanTypes.business}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="amount">{currentText.loanDetails.amount}</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder={currentText.loanDetails.enterAmount}
                          value={formData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="tenure">{currentText.loanDetails.tenure}</Label>
                        <Select value={formData.tenure} onValueChange={(value) => handleInputChange('tenure', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={currentText.loanDetails.selectTenure} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                            <SelectItem value="12">12 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                            <SelectItem value="18">18 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                            <SelectItem value="24">24 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                            <SelectItem value="36">36 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                            <SelectItem value="48">48 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                            <SelectItem value="60">60 {language === 'bn' ? 'মাস' : 'months'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="purpose">{currentText.loanDetails.purpose}</Label>
                        <Textarea
                          id="purpose"
                          placeholder={currentText.loanDetails.describePurpose}
                          value={formData.purpose}
                          onChange={(e) => handleInputChange('purpose', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Personal Information */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">{currentText.personalInfo.name}</Label>
                        <Input
                          id="name"
                          placeholder={currentText.personalInfo.enterName}
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">{currentText.personalInfo.phone}</Label>
                        <Input
                          id="phone"
                          placeholder={currentText.personalInfo.enterPhone}
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">{currentText.personalInfo.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={currentText.personalInfo.enterEmail}
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="dob">{currentText.personalInfo.dob}</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob}
                          onChange={(e) => handleInputChange('dob', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="nid">{currentText.personalInfo.nid}</Label>
                        <Input
                          id="nid"
                          placeholder="1234567890123"
                          value={formData.nid}
                          onChange={(e) => handleInputChange('nid', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">{currentText.personalInfo.address}</Label>
                        <Textarea
                          id="address"
                          placeholder={currentText.personalInfo.enterAddress}
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Employment Information */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="employmentType">{currentText.employmentInfo.type}</Label>
                        <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={currentText.employmentInfo.selectEmployment} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salaried">{currentText.employmentTypes.salaried}</SelectItem>
                            <SelectItem value="business">{currentText.employmentTypes.business}</SelectItem>
                            <SelectItem value="freelancer">{currentText.employmentTypes.freelancer}</SelectItem>
                            <SelectItem value="other">{currentText.employmentTypes.other}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="employer">{currentText.employmentInfo.employer}</Label>
                        <Input
                          id="employer"
                          placeholder={currentText.employmentInfo.enterEmployer}
                          value={formData.employer}
                          onChange={(e) => handleInputChange('employer', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="monthlyIncome">{currentText.employmentInfo.income}</Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          placeholder={currentText.employmentInfo.enterIncome}
                          value={formData.monthlyIncome}
                          onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="existingLoans">{currentText.employmentInfo.existingLoans}</Label>
                        <Input
                          id="existingLoans"
                          type="number"
                          placeholder={currentText.employmentInfo.enterExistingLoans}
                          value={formData.existingLoans}
                          onChange={(e) => handleInputChange('existingLoans', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">{currentText.review.loanInfo}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{currentText.loanDetails.type}:</span>
                            <p className="font-medium">{currentText.loanTypes[formData.loanType as keyof typeof currentText.loanTypes]}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.loanDetails.amount}:</span>
                            <p className="font-medium">{formatCurrency(parseFloat(formData.amount))}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.loanDetails.tenure}:</span>
                            <p className="font-medium">{formData.tenure} {language === 'bn' ? 'মাস' : 'months'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.loanDetails.purpose}:</span>
                            <p className="font-medium">{formData.purpose}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-lg mb-3">{currentText.review.personalInfo}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{currentText.personalInfo.name}:</span>
                            <p className="font-medium">{formData.name}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.personalInfo.phone}:</span>
                            <p className="font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.personalInfo.dob}:</span>
                            <p className="font-medium">{formData.dob}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.personalInfo.nid}:</span>
                            <p className="font-medium">{formData.nid}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-lg mb-3">{currentText.review.employmentInfo}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{currentText.employmentInfo.type}:</span>
                            <p className="font-medium">{currentText.employmentTypes[formData.employmentType as keyof typeof currentText.employmentTypes]}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.employmentInfo.employer}:</span>
                            <p className="font-medium">{formData.employer}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.employmentInfo.income}:</span>
                            <p className="font-medium">{formatCurrency(parseFloat(formData.monthlyIncome))}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{currentText.employmentInfo.existingLoans}:</span>
                            <p className="font-medium">{formData.existingLoans ? formatCurrency(parseFloat(formData.existingLoans)) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={prevStep} 
                      disabled={step === 1}
                      className="flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentText.buttons.previous}
                    </Button>

                    {step < 4 ? (
                      <Button 
                        onClick={nextStep} 
                        disabled={!validateStep(step)}
                        className="flex items-center"
                      >
                        {currentText.buttons.next}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        className="flex items-center"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                            {language === 'bn' ? 'জমা দেওয়া হচ্ছে...' : 'Submitting...'}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {currentText.buttons.submit}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    {currentText.calculator.title}
                  </CardTitle>
                  <CardDescription>
                    {currentText.calculator.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calculation.emi > 0 && (
                    <div className="space-y-4">
                      <div className="bg-primary/5 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{currentText.calculator.emi}</p>
                          <p className="text-2xl font-bold text-primary">{formatCurrency(calculation.emi)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{currentText.calculator.principal}</p>
                          <p className="font-medium">{formatCurrency(calculation.principal)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{currentText.calculator.rate}</p>
                          <p className="font-medium">{calculation.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{currentText.calculator.total}</p>
                          <p className="font-medium">{formatCurrency(calculation.totalPayable)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{currentText.calculator.interest}</p>
                          <p className="font-medium">{formatCurrency(calculation.totalInterest)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {calculation.emi === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{language === 'bn' ? 'ঋণের তথ্য পূরণ করুন গণনার জন্য' : 'Fill loan details to calculate'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    {language === 'bn' ? 'সাহায্য প্রয়োজন?' : 'Need Help?'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'bn' 
                      ? 'আমাদের বিশেষজ্ঞ দল আপনাকে সাহায্য করতে প্রস্তুত।' 
                      : 'Our expert team is ready to help you.'}
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      017xxxxxxxx
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      support@loanbondhu.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
