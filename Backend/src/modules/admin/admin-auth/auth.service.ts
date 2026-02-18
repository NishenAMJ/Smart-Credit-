import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async adminLogin(email: string, password: string) {
    try {
      const db = admin.firestore();

      // 🔹 1️⃣ Find user by email in Firestore
      const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const userDoc = snapshot.docs[0];
      const user = userDoc.data() as any;

      // 🔹 2️⃣ Must be admin
      if (user.role !== 'admin') {
        throw new UnauthorizedException('Not an admin account');
      }

      // 🔹 3️⃣ Must have passwordHash
      if (!user.passwordHash) {
        throw new UnauthorizedException('Password not set');
      }

      // 🔹 4️⃣ Compare password using bcrypt
      const passwordMatch = await bcrypt.compare(
        password,
        user.passwordHash,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 🔹 5️⃣ Create JWT token
      const payload = {
        uid: userDoc.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        accessToken: token,
        user: payload,
      };
    } catch (error: any) {
      // If already HTTP exception, throw it
      if (error?.status) throw error;

      console.error('adminLogin error:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}








