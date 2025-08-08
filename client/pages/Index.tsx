import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { 
  CreditCard, 
  Calculator, 
  Shield, 
  Clock, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Smartphone,
  ArrowRight,
  Star,
  Phone,
  FileText,
  Banknote
} from "lucide-react";

export default function Index() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentSlide, setCurrentSlide] = useState(0);

  const text = {
    bn: {
      hero: {
        title: "আপনার স্বপ্ন পূরণের জন্য ঋণ",
        subtitle: "দ্রুত, নিরাপদ এবং স্বচ্ছ ঋণ প্রক্রিয়া। ১০ মিনিটেই পূর্ব-অনুমোদন পান।",
        cta: "এখনই আবেদন করুন",
        calculate: "ঋণ গণনা করুন",
        minAmount: "সর্বনিম্ন ৫,০০০ টাকা থেকে",
        fastApproval: "দ্রুত অনুমোদন"
      },
      products: {
        title: "আমাদের ঋণ পণ্য",
        subtitle: "আপনার প্রয়োজন অনুযায়ী বিভিন্ন ধরনের ঋণ",
        instant: {
          title: "তাৎক্ষণিক মাইক্রোলোন",
          description: "জরুরি প্রয়োজনের জন্য দ্রুত ছোট ঋণ",
          amount: "৫,০০০ - ৫০,০০০ টাকা",
          tenure: "১-১২ মাস",
          rate: "১৮% বার্ষিক",
          features: ["তাৎক্ষণিক অনুমোদন", "কোনো জামানত প্রয়োজন নেই", "অনলাইন আবেদন"]
        },
        salary: {
          title: "বেতনভোগী ঋণ", 
          description: "চাকরিজীবীদের জন্য বিশেষ ঋণ সুবিধা",
          amount: "৫০,০০০ - ১০,০০,০০০ টাকা",
          tenure: "১২-৬০ মাস",
          rate: "১৫% বার্ষিক",
          features: ["কম সুদের হার", "নমনীয় পরিশোধ", "কর্মসংস্থান ভিত্তিক"]
        },
        consumer: {
          title: "ভোক্তা ঋণ",
          description: "ব্যক্তিগত প্রয়োজনের জন্য বড় ঋণ",
          amount: "১,০০,০০০ - ২০,০০,০০০ টাকা", 
          tenure: "২৪-৮৪ মাস",
          rate: "১৬% বার্ষিক",
          features: ["বড় পরিমাণ", "দীর্ঘমেয়াদী", "প্রতিযোগিতামূলক হার"]
        },
        business: {
          title: "ব্যবসায়িক মাইক্রোলোন",
          description: "ছোট ব্যবসার জন্য কার্যকরী মূলধন",
          amount: "২৫,০০০ - ৫,০০,০০০ টাকা",
          tenure: "৬-৩৬ মাস",
          rate: "২০% বার্ষিক", 
          features: ["ব্যবসায়িক বৃদ্ধি", "নমনীয় পরিশোধ", "দ্রুত প্রক্রিয়াকরণ"]
        }
      },
      features: {
        title: "কেন আমাদের বেছে নিন",
        subtitle: "আমরা আপনার আর্থিক লক্ষ্য অর্জনে সহায়তা করি",
        fast: {
          title: "দ্রুত অনুমোদন",
          description: "স্বয়ংক্রিয় প্রক্রিয়ার মাধ্যমে ১০ মিনিটেই পূর্ব-অনুমোদন"
        },
        secure: {
          title: "নিরাপদ ও নির্ভরযোগ্য",
          description: "ব্যাংক-স্তরের নিরাপত্তা এবং সম্পূর্ণ ডেটা সুরক্ষা"
        },
        transparent: {
          title: "স্বচ্ছ ফি",
          description: "কোনো লুকানো চার্জ নেই, সব খরচ আগেই জানান হয়"
        },
        support: {
          title: "২৪/৭ সহায়তা",
          description: "যেকোনো সময় আমাদের বিশেষজ্ঞ দল আপনার সেবায়"
        }
      },
      process: {
        title: "সহজ আবেদন প্রক্রিয়া",
        subtitle: "মাত্র ৩টি সহজ ধাপে আপনার ঋণ পান",
        step1: {
          title: "আবেদন করুন",
          description: "অনলাইনে দ্রুত ফর্ম পূরণ করুন"
        },
        step2: {
          title: "অনুমোদন পান",
          description: "তাৎক্ষণিক পূর্ব-অনুমোদন সিদ্ধান্ত"
        },
        step3: {
          title: "টাকা পান",
          description: "অনুমোদনের পর ২৪ ঘন্টায় টাকা পান"
        }
      },
      stats: {
        customers: "৫০,০০০+",
        customersLabel: "সন্তুষ্ট গ্রাহক",
        loans: "১০ কোটি+",
        loansLabel: "ঋণ বিতরণ",
        approval: "৮৫%",
        approvalLabel: "অনুমোদনের হার",
        time: "১০ মিনিট",
        timeLabel: "গড় প্রক্রিয়াকরণ সময়"
      },
      cta: {
        title: "আজই আপনার ঋণের জন্য আবেদন করুন",
        subtitle: "দ্রুত, নিরাপদ এবং নির্ভরযোগ্য ঋণ সেবা",
        apply: "আবেদন শুরু করুন",
        call: "ফোন করুন"
      }
    },
    en: {
      hero: {
        title: "Loans to Fulfill Your Dreams",
        subtitle: "Fast, secure, and transparent loan process. Get pre-approved in just 10 minutes.",
        cta: "Apply Now",
        calculate: "Calculate Loan",
        minAmount: "Starting from ৳5,000",
        fastApproval: "Fast Approval"
      },
      products: {
        title: "Our Loan Products",
        subtitle: "Different types of loans tailored to your needs",
        instant: {
          title: "Instant Microloan",
          description: "Quick small loans for urgent needs",
          amount: "৳5,000 - ৳50,000",
          tenure: "1-12 months",
          rate: "18% per annum",
          features: ["Instant approval", "No collateral required", "Online application"]
        },
        salary: {
          title: "Salary Loan",
          description: "Special loan facility for salaried professionals",
          amount: "৳50,000 - ৳10,00,000",
          tenure: "12-60 months", 
          rate: "15% per annum",
          features: ["Low interest rate", "Flexible repayment", "Employment based"]
        },
        consumer: {
          title: "Consumer Loan",
          description: "Large loans for personal needs",
          amount: "৳1,00,000 - ৳20,00,000",
          tenure: "24-84 months",
          rate: "16% per annum",
          features: ["Large amounts", "Long term", "Competitive rates"]
        },
        business: {
          title: "Business Microloan",
          description: "Working capital for small businesses",
          amount: "৳25,000 - ৳5,00,000",
          tenure: "6-36 months",
          rate: "20% per annum",
          features: ["Business growth", "Flexible repayment", "Fast processing"]
        }
      },
      features: {
        title: "Why Choose Us",
        subtitle: "We help you achieve your financial goals",
        fast: {
          title: "Fast Approval",
          description: "Get pre-approved in 10 minutes through automated process"
        },
        secure: {
          title: "Secure & Reliable", 
          description: "Bank-level security and complete data protection"
        },
        transparent: {
          title: "Transparent Fees",
          description: "No hidden charges, all costs disclosed upfront"
        },
        support: {
          title: "24/7 Support",
          description: "Our expert team is at your service anytime"
        }
      },
      process: {
        title: "Simple Application Process",
        subtitle: "Get your loan in just 3 easy steps",
        step1: {
          title: "Apply",
          description: "Fill out the quick online form"
        },
        step2: {
          title: "Get Approved",
          description: "Instant pre-approval decision"
        },
        step3: {
          title: "Receive Money",
          description: "Get money within 24 hours of approval"
        }
      },
      stats: {
        customers: "50,000+",
        customersLabel: "Satisfied Customers",
        loans: "৳100+ Crore",
        loansLabel: "Loans Disbursed",
        approval: "85%",
        approvalLabel: "Approval Rate",
        time: "10 Minutes",
        timeLabel: "Average Processing Time"
      },
      cta: {
        title: "Apply for Your Loan Today",
        subtitle: "Fast, secure, and reliable loan service",
        apply: "Start Application",
        call: "Call Us"
      }
    }
  };

  const currentText = text[language];

  const heroSlides = [
    {
      title: currentText.hero.title,
      subtitle: currentText.hero.subtitle,
      highlight: currentText.hero.minAmount,
      bg: "bg-gradient-to-br from-primary/10 via-primary/5 to-background"
    },
    {
      title: language === 'bn' ? "নিরাপদ ও দ্রুত ডিজিটাল ঋণ" : "Secure & Fast Digital Loans",
      subtitle: language === 'bn' ? "সম্পূর্ণ অনলাইন প্রক্রিয়া। কাগজপত্রের ঝামেলা নেই।" : "Complete online process. No paperwork hassle.",
      highlight: language === 'bn' ? "১০০% ডিজিটাল" : "100% Digital",
      bg: "bg-gradient-to-br from-success/10 via-success/5 to-background"
    },
    {
      title: language === 'bn' ? "আপনার বিশ্বস্ত আর্থিক সাথী" : "Your Trusted Financial Partner",
      subtitle: language === 'bn' ? "৫০,০০০+ সন্তুষ্ট গ্রাহক আমাদের উপর আস্থা রেখেছেন।" : "50,000+ satisfied customers trust us.",
      highlight: language === 'bn' ? "৫ তারকা রেটিং" : "5 Star Rating",
      bg: "bg-gradient-to-br from-info/10 via-info/5 to-background"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const loanProducts = [
    {
      key: 'instant',
      icon: <Clock className="w-8 h-8 text-primary" />,
      badge: language === 'bn' ? "জনপ্রিয়" : "Popular",
      badgeColor: "bg-primary text-primary-foreground"
    },
    {
      key: 'salary', 
      icon: <Users className="w-8 h-8 text-success" />,
      badge: language === 'bn' ? "কম সুদ" : "Low Rate",
      badgeColor: "bg-success text-success-foreground"
    },
    {
      key: 'consumer',
      icon: <CreditCard className="w-8 h-8 text-info" />,
      badge: language === 'bn' ? "বড় পরিমাণ" : "Large Amount", 
      badgeColor: "bg-info text-info-foreground"
    },
    {
      key: 'business',
      icon: <TrendingUp className="w-8 h-8 text-warning" />,
      badge: language === 'bn' ? "ব্যবসায়িক" : "Business",
      badgeColor: "bg-warning text-warning-foreground"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`min-h-[90vh] ${heroSlides[currentSlide].bg} transition-all duration-1000`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="text-sm px-3 py-1">
                    {heroSlides[currentSlide].highlight}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-12 px-8 text-base" asChild>
                    <Link to="/apply">
                      {currentText.hero.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                    <Link to="/calculator">
                      <Calculator className="w-5 h-5 mr-2" />
                      {currentText.hero.calculate}
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    {currentText.hero.fastApproval}
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-success mr-2" />
                    {language === 'bn' ? 'নিরাপদ প্রক্রিয়া' : 'Secure Process'}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Smartphone className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {language === 'bn' ? 'দ্রুত ঋণ চেক' : 'Quick Loan Check'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'আপনি কত টাকা ঋণ পেতে পারেন দেখুন' : 'See how much loan you can get'}
                    </p>
                    <Button className="w-full" asChild>
                      <Link to="/eligibility">
                        {language === 'bn' ? 'যোগ্যতা চেক করুন' : 'Check Eligibility'}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Slide indicators */}
                <div className="flex justify-center space-x-2 mt-8">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{currentText.stats.customers}</div>
              <div className="text-primary-foreground/80">{currentText.stats.customersLabel}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{currentText.stats.loans}</div>
              <div className="text-primary-foreground/80">{currentText.stats.loansLabel}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{currentText.stats.approval}</div>
              <div className="text-primary-foreground/80">{currentText.stats.approvalLabel}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{currentText.stats.time}</div>
              <div className="text-primary-foreground/80">{currentText.stats.timeLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Products Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {currentText.products.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentText.products.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanProducts.map((product) => {
              const productData = currentText.products[product.key as keyof typeof currentText.products];
              return (
                <Card key={product.key} className="relative group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      {product.icon}
                      <Badge className={product.badgeColor}>{product.badge}</Badge>
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{productData.title}</CardTitle>
                      <CardDescription>{productData.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'bn' ? 'পরিমাণ:' : 'Amount:'}</span>
                        <span className="font-medium">{productData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'bn' ? 'মেয়াদ:' : 'Tenure:'}</span>
                        <span className="font-medium">{productData.tenure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'bn' ? 'সুদের হার:' : 'Interest:'}</span>
                        <span className="font-medium text-primary">{productData.rate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {productData.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link to="/apply">
                        {language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {currentText.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentText.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.features.fast.title}</h3>
              <p className="text-muted-foreground">{currentText.features.fast.description}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.features.secure.title}</h3>
              <p className="text-muted-foreground">{currentText.features.secure.description}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-info/20 transition-colors">
                <FileText className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.features.transparent.title}</h3>
              <p className="text-muted-foreground">{currentText.features.transparent.description}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/20 transition-colors">
                <Phone className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.features.support.title}</h3>
              <p className="text-muted-foreground">{currentText.features.support.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {currentText.process.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentText.process.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.process.step1.title}</h3>
              <p className="text-muted-foreground">{currentText.process.step1.description}</p>
              {/* Arrow for desktop */}
              <ArrowRight className="hidden md:block absolute top-10 -right-4 w-6 h-6 text-muted-foreground" />
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 text-success-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.process.step2.title}</h3>
              <p className="text-muted-foreground">{currentText.process.step2.description}</p>
              {/* Arrow for desktop */}
              <ArrowRight className="hidden md:block absolute top-10 -right-4 w-6 h-6 text-muted-foreground" />
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-info rounded-full flex items-center justify-center mx-auto mb-6 text-info-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">{currentText.process.step3.title}</h3>
              <p className="text-muted-foreground">{currentText.process.step3.description}</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/apply">
                {currentText.hero.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              {currentText.cta.title}
            </h2>
            <p className="text-lg text-primary-foreground/90">
              {currentText.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="h-12 px-8" asChild>
                <Link to="/apply">
                  <Banknote className="w-5 h-5 mr-2" />
                  {currentText.cta.apply}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Phone className="w-5 h-5 mr-2" />
                {currentText.cta.call}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
