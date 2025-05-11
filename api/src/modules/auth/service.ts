import bcrypt from "bcrypt";
import prisma from "../../core/prisma";
import { LoginPayload, RegisterPayload, Session } from "./types";

export const AuthService = {
  // Kullanıcı kayıt işlemi
  async register(data: RegisterPayload): Promise<Session> {
    // Email unique kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Bu e-posta adresi zaten kullanılıyor");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  // Kullanıcı girişi
  async login(data: LoginPayload): Promise<Session> {
    // Kullanıcıyı e-posta ile bul
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("E-posta veya şifre hatalı");
    }

    // Şifre kontrolü
    if (!user.password) {
      throw new Error("Kullanıcının şifresi tanımlanmamış");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("E-posta veya şifre hatalı");
    }

    // Session bilgisini döndür
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  // Mevcut kullanıcı bilgilerini getir
  async getUser(userId: string): Promise<Session | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
};
