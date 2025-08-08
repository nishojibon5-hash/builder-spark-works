import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, LoginRequest, LoginResponse, RegisterRequest, ApiResponse } from "../types/database";

// Mock database - In production, replace with actual database
let users: User[] = [
  {
    user_id: 1,
    name: "Admin User",
    phone: "01650074073",
    password_hash: "$2b$10$rZ8VZfgDlDKGhYzfJj3QdOv7QKY8FHhJQ9FfkKKqZxXhEHQH6JYzS", // "admin123"
    role: "admin",
    dob: new Date("1990-01-01"),
    address: "Dhaka, Bangladesh",
    created_at: new Date(),
  },
  {
    user_id: 2,
    name: "মোহাম্মদ রহিম",
    phone: "01712345678",
    password_hash: "$2b$10$rZ8VZfgDlDKGhYzfJj3QdOv7QKY8FHhJQ9FfkKKqZxXhEHQH6JYzS", // "user123"
    role: "user",
    dob: new Date("1990-05-15"),
    address: "House 123, Road 5, Dhanmondi, Dhaka",
    created_at: new Date(),
  }
];

let userIdCounter = 3;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Utility functions
const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      userId: user.user_id, 
      phone: user.phone, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// POST /auth/login - User login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password, otp }: LoginRequest = req.body;

    if (!phone) {
      res.status(400).json({
        success: false,
        message: "Phone number is required"
      } as ApiResponse);
      return;
    }

    // Find user by phone
    const user = users.find(u => u.phone === phone);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid phone number or password"
      } as ApiResponse);
      return;
    }

    // For OTP login (simplified - in production, implement proper OTP verification)
    if (otp) {
      if (otp === "123456") { // Mock OTP
        const token = generateToken(user);
        const { password_hash, ...userWithoutPassword } = user;
        
        res.json({
          success: true,
          token,
          user: userWithoutPassword,
          message: "Login successful"
        } as LoginResponse);
        return;
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid OTP"
        } as ApiResponse);
        return;
      }
    }

    // For password login
    if (!password) {
      res.status(400).json({
        success: false,
        message: "Password is required"
      } as ApiResponse);
      return;
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid phone number or password"
      } as ApiResponse);
      return;
    }

    const token = generateToken(user);
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: "Login successful"
    } as LoginResponse);

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// POST /auth/admin-login - Admin login (restricted to specific phone)
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password }: LoginRequest = req.body;

    // Only allow admin phone number
    if (phone !== "01650074073") {
      res.status(403).json({
        success: false,
        message: "Admin access denied"
      } as ApiResponse);
      return;
    }

    // Find admin user
    const admin = users.find(u => u.phone === phone && u.role === "admin");
    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Admin not found"
      } as ApiResponse);
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: "Password is required"
      } as ApiResponse);
      return;
    }

    const isValidPassword = await verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      } as ApiResponse);
      return;
    }

    const token = generateToken(admin);
    const { password_hash, ...adminWithoutPassword } = admin;
    
    res.json({
      success: true,
      token,
      user: adminWithoutPassword,
      message: "Admin login successful"
    } as LoginResponse);

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// POST /auth/logout - Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, you might want to blacklist the token
    res.json({
      success: true,
      message: "Logged out successfully"
    } as ApiResponse);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// POST /auth/register - User registration
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, password, dob, address }: RegisterRequest = req.body;

    // Validation
    if (!name || !phone || !password || !dob || !address) {
      res.status(400).json({
        success: false,
        message: "All fields are required"
      } as ApiResponse);
      return;
    }

    // Check if phone already exists
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Phone number already registered"
      } as ApiResponse);
      return;
    }

    // Validate phone number (Bangladesh format)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({
        success: false,
        message: "Invalid Bangladesh phone number"
      } as ApiResponse);
      return;
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create new user
    const newUser: User = {
      user_id: userIdCounter++,
      name,
      phone,
      password_hash,
      role: "user",
      dob: new Date(dob),
      address,
      created_at: new Date(),
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);
    const { password_hash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
      message: "Registration successful"
    } as LoginResponse);

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /auth/profile - Get user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId; // From auth middleware
    
    const user = users.find(u => u.user_id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    } as ApiResponse);

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /auth/profile - Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId; // From auth middleware
    const { name, dob, address } = req.body;
    
    const userIndex = users.findIndex(u => u.user_id === userId);
    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Update user
    if (name) users[userIndex].name = name;
    if (dob) users[userIndex].dob = new Date(dob);
    if (address) users[userIndex].address = address;
    users[userIndex].updated_at = new Date();

    const { password_hash, ...userWithoutPassword } = users[userIndex];
    
    res.json({
      success: true,
      data: userWithoutPassword,
      message: "Profile updated successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: any): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token required"
    } as ApiResponse);
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "Invalid or expired token"
      } as ApiResponse);
      return;
    }

    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    (req as any).userPhone = decoded.phone;
    next();
  });
};

// Middleware to check admin role
export const requireAdmin = (req: Request, res: Response, next: any): void => {
  const userRole = (req as any).userRole;
  
  if (userRole !== 'admin' && userRole !== 'subadmin') {
    res.status(403).json({
      success: false,
      message: "Admin access required"
    } as ApiResponse);
    return;
  }
  
  next();
};

// Export users for other modules (in production, this would be database access)
export { users };
