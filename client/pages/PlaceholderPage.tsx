import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Construction, ArrowLeft, MessageCircle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestions?: string[];
}

export default function PlaceholderPage({ 
  title, 
  description, 
  suggestions = [] 
}: PlaceholderPageProps) {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  const text = {
    bn: {
      comingSoon: "শীঘ্রই আসছে",
      inDevelopment: "এই পৃষ্ঠাটি বর্তমানে উন্নয়নাধীন রয়েছে।",
      backToHome: "হোমে ফিরুন",
      requestFeature: "এ��� ফিচারটি চান?",
      requestDescription: "আমাদের জানান যে আপনি এই পৃষ্ঠাটি দেখতে চান এবং আমরা এটি অগ্রাধিকার দেব।",
      requestButton: "ফিচার অনুরোধ করুন",
      suggestedPages: "প্রস্তাবিত পৃষ্ঠাসমূহ"
    },
    en: {
      comingSoon: "Coming Soon",
      inDevelopment: "This page is currently under development.",
      backToHome: "Back to Home",
      requestFeature: "Want this feature?",
      requestDescription: "Let us know you'd like to see this page and we'll prioritize it.",
      requestButton: "Request Feature",
      suggestedPages: "Suggested Pages"
    }
  };

  const currentText = text[language];

  const defaultSuggestions = [
    { path: "/", label: language === 'bn' ? "হোমপেজ" : "Homepage" },
    { path: "/apply", label: language === 'bn' ? "ঋণের আবেদন" : "Loan Application" },
    { path: "/calculator", label: language === 'bn' ? "ঋণ ক্যালকুলেটর" : "Loan Calculator" }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="w-12 h-12 text-muted-foreground" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-2">
              {description}
            </p>
            
            <p className="text-muted-foreground">
              {currentText.inDevelopment}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentText.backToHome}
              </Link>
            </Button>
            
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              {currentText.requestButton}
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{currentText.requestFeature}</CardTitle>
              <CardDescription>
                {currentText.requestDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                {currentText.requestButton}
              </Button>
            </CardContent>
          </Card>

          {(suggestions.length > 0 || defaultSuggestions.length > 0) && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">{currentText.suggestedPages}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {[...suggestions.map(s => ({ path: s, label: s })), ...defaultSuggestions].map((suggestion, index) => (
                  <Button key={index} variant="outline" size="sm" asChild>
                    <Link to={suggestion.path}>
                      {suggestion.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
