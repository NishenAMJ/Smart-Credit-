import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface UserData {
  email: string;
  passwordHash: string;
  role: string;
  createdAt: admin.firestore.Timestamp;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, role } = registerDto;

    // Check if user already exists
    const existingUser = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!existingUser.empty) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with 10 salt rounds
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user document
    const userDoc = await admin.firestore().collection('users').add({
      email,
      passwordHash,
      role,
      createdAt: admin.firestore.Timestamp.now(),
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      uid: userDoc.id,
      email,
      role,
    });

    return {
      access_token: token,
      user: {
        uid: userDoc.id,
        email,
        role,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    // Validate input
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user by email
    const snapshot = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data() as UserData;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      uid: userDoc.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        uid: userDoc.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}