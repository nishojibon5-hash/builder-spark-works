import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Camera, 
  Zap, 
  Eye, 
  Lock, 
  CheckCircle2,
  Scan,
  UserCheck
} from "lucide-react";

interface SecurityFeaturesProps {
  language: 'bn' | 'en';
}

export default function SecurityFeatures({ language }: SecurityFeaturesProps) {
  const text = {
    bn: {
      title: "নিরাপত্তা বৈশিষ্ট্য",
      subtitle: "আপনার নিরাপত্তা আমাদের অগ্রাধিকার",
      features: [
        {
          icon: Camera,
          title: "রিয়েল-টাইম ক্যামেরা ভেরিফিকেশন",
          description: "সরাসরি ক্যামেরা দিয়ে এনআইডি স্ক্যান করুন - কোনো আপলোড নেই",
          badge: "লাইভ ক্যাপচার"
        },
        {
          icon: Scan,
          title: "এআই-চালিত ডকুমেন্ট স্ক্যানিং",
          description: "উন্নত OCR প্রযুক্তি দিয়ে তাৎক্ষণিক এনআইডি যাচাইকরণ",
          badge: "তাৎক্ষণিক"
        },
        {
          icon: Shield,
          title: "জাল ডকুমেন্ট প্রতিরোধ",
          description: "রিয়েল-টাইম ক্যাপচার জাল বা স্ক্যান করা ডকুমেন্ট প্রতিরোধ করে",
          badge: "জাল-বিরোধী"
        },
        {
          icon: UserCheck,
          title: "পরিচয় যাচাইকরণ",
          description: "সরকারী ডাটাবেস থেকে তথ্য ক্র��-ভেরিফিকেশন",
          badge: "৯৫%+ নির্ভুলতা"
        },
        {
          icon: Lock,
          title: "এনক্রিপ্টেড ডেটা স্টোরেজ",
          description: "আপনার সকল তথ্য উচ্চ-মানের এনক্রিপশন দিয়ে সুরক্ষিত",
          badge: "256-বিট এনক্রিপশন"
        },
        {
          icon: Eye,
          title: "গোপনীয়তা সুরক্ষা",
          description: "GDPR ও স্থানীয় গোপনীয়তা আইন অনুসরণ",
          badge: "সম্মতিপূর্ণ"
        }
      ]
    },
    en: {
      title: "Security Features",
      subtitle: "Your security is our priority",
      features: [
        {
          icon: Camera,
          title: "Real-time Camera Verification",
          description: "Scan your NID directly with camera - no uploads required",
          badge: "Live Capture"
        },
        {
          icon: Scan,
          title: "AI-Powered Document Scanning",
          description: "Advanced OCR technology for instant NID verification",
          badge: "Instant"
        },
        {
          icon: Shield,
          title: "Fake Document Prevention",
          description: "Real-time capture prevents fake or scanned documents",
          badge: "Anti-Fraud"
        },
        {
          icon: UserCheck,
          title: "Identity Verification",
          description: "Cross-verification with government databases",
          badge: "95%+ Accuracy"
        },
        {
          icon: Lock,
          title: "Encrypted Data Storage",
          description: "All your information is protected with high-grade encryption",
          badge: "256-bit Encryption"
        },
        {
          icon: Eye,
          title: "Privacy Protection",
          description: "GDPR and local privacy law compliance",
          badge: "Compliant"
        }
      ]
    }
  };

  const currentText = text[language];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <Shield className="w-6 h-6 mr-2 text-primary" />
          {currentText.title}
        </CardTitle>
        <CardDescription className="text-base">
          {currentText.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentText.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {feature.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Guarantee */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-900">
              {language === 'bn' ? 'নিরাপত্তা গ্যারান্টি' : 'Security Guarantee'}
            </span>
          </div>
          <p className="text-sm text-center text-green-800">
            {language === 'bn' 
              ? 'আমরা ব্যাংক-গ্রেড নিরাপত্তা ব্যবহার করি এবং আপনার ব্যক্তিগত তথ্য কখনো তৃতীয় পক্ষের সাথে শেয়ার করি না।'
              : 'We use bank-grade security and never share your personal information with third parties.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
