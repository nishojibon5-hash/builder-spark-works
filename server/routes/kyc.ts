import { Request, Response } from "express";
import { KYC, KYCUploadRequest, ApiResponse } from "../types/database";
import { users } from "./auth";

// Mock KYC database
let kycRecords: KYC[] = [
  {
    kyc_id: 1,
    user_id: 2,
    document_type: "NID",
    document_number: "1234567890123",
    document_image_url: "/uploads/kyc/nid_front_1.jpg",
    document_image_back_url: "/uploads/kyc/nid_back_1.jpg",
    status: "verified",
    reviewed_by: 1,
    reviewed_at: new Date(),
    created_at: new Date(),
  }
];

let kycIdCounter = 2;

// POST /kyc/upload - Upload KYC documents
export const uploadKYC = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { document_type, document_number, front_image, back_image }: KYCUploadRequest = req.body;

    // Validation
    if (!document_type || !document_number || !front_image) {
      res.status(400).json({
        success: false,
        message: "Document type, number, and front image are required"
      } as ApiResponse);
      return;
    }

    // Check if user exists
    const user = users.find(u => u.user_id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Check if KYC already exists for this user
    const existingKYC = kycRecords.find(k => k.user_id === userId);
    if (existingKYC && existingKYC.status === "verified") {
      res.status(409).json({
        success: false,
        message: "KYC already verified for this user"
      } as ApiResponse);
      return;
    }

    // Validate document number format
    if (document_type === "NID") {
      const nidRegex = /^[0-9]{10}$|^[0-9]{13}$|^[0-9]{17}$/;
      if (!nidRegex.test(document_number)) {
        res.status(400).json({
          success: false,
          message: "Invalid NID format"
        } as ApiResponse);
        return;
      }
    }

    // In production, save images to file system or cloud storage
    const frontImagePath = `/uploads/kyc/${document_type.toLowerCase()}_front_${userId}_${Date.now()}.jpg`;
    const backImagePath = back_image ? `/uploads/kyc/${document_type.toLowerCase()}_back_${userId}_${Date.now()}.jpg` : undefined;

    // Create or update KYC record
    if (existingKYC) {
      // Update existing record
      existingKYC.document_type = document_type;
      existingKYC.document_number = document_number;
      existingKYC.document_image_url = frontImagePath;
      existingKYC.document_image_back_url = backImagePath;
      existingKYC.status = "pending";
      existingKYC.reviewed_by = undefined;
      existingKYC.reviewed_at = undefined;
      existingKYC.rejection_reason = undefined;
      existingKYC.updated_at = new Date();

      res.json({
        success: true,
        data: existingKYC,
        message: "KYC documents updated successfully"
      } as ApiResponse);
    } else {
      // Create new KYC record
      const newKYC: KYC = {
        kyc_id: kycIdCounter++,
        user_id: userId,
        document_type,
        document_number,
        document_image_url: frontImagePath,
        document_image_back_url: backImagePath,
        status: "pending",
        created_at: new Date(),
      };

      kycRecords.push(newKYC);

      res.status(201).json({
        success: true,
        data: newKYC,
        message: "KYC documents uploaded successfully"
      } as ApiResponse);
    }

  } catch (error) {
    console.error("KYC upload error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /kyc/status/:userId - Get KYC status
export const getKYCStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requesterId = (req as any).userId;
    const requesterRole = (req as any).userRole;

    // Users can only view their own KYC, admins can view any
    if (parseInt(userId) !== requesterId && requesterRole !== 'admin' && requesterRole !== 'subadmin') {
      res.status(403).json({
        success: false,
        message: "Access denied"
      } as ApiResponse);
      return;
    }

    const kycRecord = kycRecords.find(k => k.user_id === parseInt(userId));
    
    if (!kycRecord) {
      res.status(404).json({
        success: false,
        message: "KYC record not found"
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: kycRecord
    } as ApiResponse);

  } catch (error) {
    console.error("Get KYC status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /kyc/verify/:userId - Admin verifies KYC
export const verifyKYC = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const adminId = (req as any).userId;
    const { notes } = req.body;

    const kycRecord = kycRecords.find(k => k.user_id === parseInt(userId));
    
    if (!kycRecord) {
      res.status(404).json({
        success: false,
        message: "KYC record not found"
      } as ApiResponse);
      return;
    }

    if (kycRecord.status === "verified") {
      res.status(409).json({
        success: false,
        message: "KYC already verified"
      } as ApiResponse);
      return;
    }

    // Update KYC record
    kycRecord.status = "verified";
    kycRecord.reviewed_by = adminId;
    kycRecord.reviewed_at = new Date();
    kycRecord.updated_at = new Date();

    // Log admin action (in production, save to audit_logs table)
    console.log(`Admin ${adminId} verified KYC for user ${userId}. Notes: ${notes || 'None'}`);

    res.json({
      success: true,
      data: kycRecord,
      message: "KYC verified successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Verify KYC error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /kyc/reject/:userId - Admin rejects KYC
export const rejectKYC = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const adminId = (req as any).userId;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      } as ApiResponse);
      return;
    }

    const kycRecord = kycRecords.find(k => k.user_id === parseInt(userId));
    
    if (!kycRecord) {
      res.status(404).json({
        success: false,
        message: "KYC record not found"
      } as ApiResponse);
      return;
    }

    // Update KYC record
    kycRecord.status = "rejected";
    kycRecord.reviewed_by = adminId;
    kycRecord.reviewed_at = new Date();
    kycRecord.rejection_reason = reason;
    kycRecord.updated_at = new Date();

    // Log admin action
    console.log(`Admin ${adminId} rejected KYC for user ${userId}. Reason: ${reason}`);

    res.json({
      success: true,
      data: kycRecord,
      message: "KYC rejected"
    } as ApiResponse);

  } catch (error) {
    console.error("Reject KYC error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /kyc/all - Admin gets all KYC records
export const getAllKYC = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filteredKYC = [...kycRecords];
    
    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredKYC = filteredKYC.filter(k => k.status === status);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedKYC = filteredKYC.slice(startIndex, endIndex);

    // Add user details to KYC records
    const kycWithUsers = paginatedKYC.map(kyc => {
      const user = users.find(u => u.user_id === kyc.user_id);
      return {
        ...kyc,
        user_name: user?.name,
        user_phone: user?.phone,
      };
    });

    res.json({
      success: true,
      data: kycWithUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredKYC.length,
        totalPages: Math.ceil(filteredKYC.length / limitNum)
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get all KYC error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// Export KYC records for other modules
export { kycRecords };
