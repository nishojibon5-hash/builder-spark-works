import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera,
  CameraOff,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Shield,
  Scan,
  X,
  Eye,
  Download,
  Upload,
  FileImage,
  Settings,
  HelpCircle
} from "lucide-react";

interface NIDData {
  nidNumber: string;
  name: string;
  dateOfBirth: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  bloodGroup?: string;
  verified: boolean;
  confidence: number;
}

interface NIDCameraCaptureProps {
  onCapture: (nidData: NIDData, imageData: string) => void;
  onError: (error: string) => void;
  language: 'bn' | 'en';
  disabled?: boolean;
}

export default function NIDCameraCapture({ onCapture, onError, language, disabled }: NIDCameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [nidData, setNidData] = useState<NIDData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'upload'>('camera');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = {
    bn: {
      title: "জাতীয় পরিচয়পত্র যাচাইকরণ",
      subtitle: "ক্যামেরা দিয়ে আপনার এনআইডি কার্ড স্ক্যান করুন",
      startCamera: "ক্যামেরা ��ালু করুন",
      stopCamera: "ক্যামেরা বন্ধ করুন",
      capture: "ছবি তুলুন",
      retake: "আবার তুলুন",
      verify: "যাচাই করুন",
      verifying: "যাচাই করা হচ্ছে...",
      verified: "সফলভাবে যাচাই হয়েছে",
      failed: "যাচাই ব্যর্থ হয়েছে",
      instructions: {
        position: "আপনার এনআইডি কার্ডটি ক্যামেরার সামনে রাখুন",
        lighting: "ভালো আলোতে রাখুন",
        steady: "স্থির রাখুন",
        visible: "পুরো কার্ড দেখা যাচ্ছে কিনা নিশ্চিত করুন"
      },
      errors: {
        cameraPermission: "ক্যামেরা অনুমতি প্রয়োজন",
        cameraNotFound: "ক্যামেরা পাওয়া যায়নি",
        nidNotDetected: "এনআইডি কার্ড সনাক্ত করা যায়নি",
        poorQuality: "ছবির মান ভালো নয়",
        verificationFailed: "যাচাইকর��� ব্যর্থ হয়েছে"
      },
      fields: {
        nidNumber: "এনআইডি নম্বর",
        name: "নাম",
        dateOfBirth: "জন্ম তারিখ",
        fatherName: "পিতার নাম",
        motherName: "মাতার নাম",
        address: "ঠিকানা",
        bloodGroup: "রক্তের গ্রুপ"
      },
      confidence: "নির্ভুলতা",
      preview: "প্রিভিউ দেখুন",
      accept: "গ্রহণ করুন"
    },
    en: {
      title: "National ID Verification",
      subtitle: "Scan your NID card using the camera",
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      capture: "Capture Photo",
      retake: "Retake Photo",
      verify: "Verify NID",
      verifying: "Verifying...",
      verified: "Successfully Verified",
      failed: "Verification Failed",
      uploadOption: "Upload Photo Instead",
      useCamera: "Use Camera Instead",
      selectFile: "Select NID Photo",
      troubleshoot: "Camera Not Working?",
      instructions: {
        position: "Position your NID card in front of the camera",
        lighting: "Ensure good lighting",
        steady: "Keep it steady",
        visible: "Make sure the entire card is visible"
      },
      errors: {
        cameraPermission: "Camera permission required",
        cameraNotFound: "Camera not found",
        nidNotDetected: "NID card not detected",
        poorQuality: "Poor image quality",
        verificationFailed: "Verification failed"
      },
      fields: {
        nidNumber: "NID Number",
        name: "Name",
        dateOfBirth: "Date of Birth",
        fatherName: "Father's Name",
        motherName: "Mother's Name",
        address: "Address",
        bloodGroup: "Blood Group"
      },
      confidence: "Confidence",
      preview: "Preview",
      accept: "Accept"
    }
  };

  const currentText = text[language];

  // Start camera stream
  const startCamera = async () => {
    try {
      setError('');
      setCameraError('');
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Prefer back camera for better quality
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMessage = currentText.errors.cameraPermission;
      
      if (err.name === 'NotFoundError') {
        errorMessage = currentText.errors.cameraNotFound;
      } else if (err.name === 'NotAllowedError') {
        errorMessage = currentText.errors.cameraPermission;
      }
      
      setCameraError(errorMessage);
      onError(errorMessage);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setIsCaptured(true);
    
    // Stop camera after capture
    stopCamera();
  };

  // Simulate NID verification (in real app, this would call an AI service)
  const verifyNID = async () => {
    if (!capturedImage) return;

    setIsVerifying(true);
    setVerificationProgress(0);
    setError('');

    try {
      // Simulate verification progress
      const progressInterval = setInterval(() => {
        setVerificationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      clearInterval(progressInterval);
      setVerificationProgress(100);

      // Simulate NID verification result (in real app, this would be from OCR/AI service)
      const mockNIDData: NIDData = {
        nidNumber: generateMockNID(),
        name: language === 'bn' ? 'মোহাম্মদ রহিম উদ্দিন' : 'Mohammad Rahim Uddin',
        dateOfBirth: '1990-05-15',
        fatherName: language === 'bn' ? 'আব্দুল করিম' : 'Abdul Karim',
        motherName: language === 'bn' ? 'ফাতেমা খাতুন' : 'Fatema Khatun',
        address: language === 'bn' ? 'গ্রাম: কমলাপুর, উপজেলা: ঢাকা, জেলা: ঢাকা' : 'Village: Komolapur, Upazila: Dhaka, District: Dhaka',
        bloodGroup: 'B+',
        verified: true,
        confidence: Math.floor(Math.random() * 15) + 85 // 85-99% confidence
      };

      // Simulate occasional verification failure
      if (Math.random() < 0.1) {
        throw new Error(currentText.errors.nidNotDetected);
      }

      setNidData(mockNIDData);
      
      // Call parent callback with verified data
      onCapture(mockNIDData, capturedImage);

    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || currentText.errors.verificationFailed);
      onError(err.message || currentText.errors.verificationFailed);
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate mock NID number
  const generateMockNID = () => {
    const year = Math.floor(Math.random() * 30) + 1970;
    const serial = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `${year}${serial}123`;
  };

  // Reset all states
  const reset = () => {
    setIsCaptured(false);
    setIsVerifying(false);
    setVerificationProgress(0);
    setNidData(null);
    setCapturedImage('');
    setError('');
    setCameraError('');
    stopCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          {currentText.title}
        </CardTitle>
        <CardDescription>
          {currentText.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Display */}
        {(error || cameraError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || cameraError}
            </AlertDescription>
          </Alert>
        )}

        {/* Camera Instructions */}
        {!isCaptured && !nidData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'নির্দেশাবলী:' : 'Instructions:'}
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {currentText.instructions.position}</li>
              <li>• {currentText.instructions.lighting}</li>
              <li>• {currentText.instructions.steady}</li>
              <li>• {currentText.instructions.visible}</li>
            </ul>
          </div>
        )}

        {/* Camera View */}
        {isStreaming && !isCaptured && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg border shadow-lg"
              style={{ maxHeight: '400px' }}
            />
            
            {/* Camera overlay frame */}
            <div className="absolute inset-4 border-2 border-white rounded-lg shadow-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                  {language === 'bn' ? 'এনআইডি কার্ড এখানে রাখুন' : 'Place NID card here'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured Image Preview */}
        {isCaptured && capturedImage && !nidData && (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured NID" 
                className="w-full rounded-lg border shadow-lg"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
              <Badge className="absolute top-2 right-2 bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                {language === 'bn' ? 'ক্যাপচার সম্পন্ন' : 'Captured'}
              </Badge>
            </div>
          </div>
        )}

        {/* Verification Progress */}
        {isVerifying && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <Scan className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="font-medium mb-2">{currentText.verifying}</h3>
              <Progress value={verificationProgress} className="mb-2" />
              <p className="text-sm text-muted-foreground">{verificationProgress}%</p>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {nidData && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">{currentText.verified}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {currentText.confidence}: {nidData.confidence}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{currentText.fields.nidNumber}:</span>
                  <p className="font-medium font-mono">{nidData.nidNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{currentText.fields.name}:</span>
                  <p className="font-medium">{nidData.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{currentText.fields.dateOfBirth}:</span>
                  <p className="font-medium">{nidData.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{currentText.fields.bloodGroup}:</span>
                  <p className="font-medium">{nidData.bloodGroup}</p>
                </div>
                {nidData.fatherName && (
                  <div>
                    <span className="text-muted-foreground">{currentText.fields.fatherName}:</span>
                    <p className="font-medium">{nidData.fatherName}</p>
                  </div>
                )}
                {nidData.motherName && (
                  <div>
                    <span className="text-muted-foreground">{currentText.fields.motherName}:</span>
                    <p className="font-medium">{nidData.motherName}</p>
                  </div>
                )}
              </div>

              {nidData.address && (
                <div className="mt-4">
                  <span className="text-sm text-muted-foreground">{currentText.fields.address}:</span>
                  <p className="font-medium">{nidData.address}</p>
                </div>
              )}
            </div>
            
            {/* Captured Image Thumbnail */}
            {capturedImage && (
              <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={capturedImage} 
                    alt="NID Thumbnail" 
                    className="w-16 h-10 object-cover rounded border"
                  />
                  <div>
                    <p className="text-sm font-medium">{language === 'bn' ? 'এনআইডি ছবি' : 'NID Image'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? 'সফলভাবে ক্যাপচার হয়েছে' : 'Successfully captured'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  {currentText.preview}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isStreaming && !isCaptured && !nidData && (
            <Button 
              onClick={startCamera} 
              disabled={disabled}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              {currentText.startCamera}
            </Button>
          )}

          {isStreaming && !isCaptured && (
            <>
              <Button 
                onClick={capturePhoto}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                {currentText.capture}
              </Button>
              <Button 
                variant="outline" 
                onClick={stopCamera}
              >
                <CameraOff className="w-4 h-4 mr-2" />
                {currentText.stopCamera}
              </Button>
            </>
          )}

          {isCaptured && !isVerifying && !nidData && (
            <>
              <Button 
                onClick={verifyNID}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                {currentText.verify}
              </Button>
              <Button 
                variant="outline" 
                onClick={reset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {currentText.retake}
              </Button>
            </>
          )}

          {nidData && (
            <Button 
              variant="outline" 
              onClick={reset}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {currentText.retake}
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">
                {language === 'bn' ? 'নিরাপত্তা নোটিস:' : 'Security Notice:'}
              </p>
              <p>
                {language === 'bn' 
                  ? 'আপনার এনআইডি তথ্য এনক্রিপ্ট করা হয় এবং নিরাপদে সংরক্ষণ করা হয়। আমরা আপনার গোপনীয়তা রক্ষা করি।'
                  : 'Your NID information is encrypted and stored securely. We protect your privacy.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
