import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import prisma from "../../core/prisma";
import { LoginPayload, RegisterPayload, Session } from "./types";

// Session süresi (15 dakika - milisaniye cinsinden)
const SESSION_EXPIRY = 15 * 60 * 1000;

// Session yönetimi için servis
export const SessionService = {
  // Yeni session oluşturma
  async create(userId: string): Promise<string> {
    // Rastgele token oluştur
    const token = randomBytes(64).toString("hex");

    // Mevcut kullanıcının tüm session'larını getir
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Eğer kullanıcının çok fazla session'ı varsa en eski olanları kaldır
    // (Opsiyonel: Güvenlik için çok fazla session biriktirmemek adına)
    if (sessions.length > 5) {
      // En eski oturumları silmek için ID'leri al
      const oldSessionIds = sessions
        .slice(4) // İlk 5 oturumu tut, gerisini sil
        .map((session) => session.id);

      if (oldSessionIds.length > 0) {
        await prisma.session.deleteMany({
          where: { id: { in: oldSessionIds } },
        });
      }
    }

    // Yeni session oluştur
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY);

    const session = await prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
        updatedAt: new Date(),
      },
    });

    return session.token;
  },

  // Session doğrulama
  async verify(token: string): Promise<string | null> {
    // Token'ı kullanarak session'ı bul
    const session = await prisma.session.findUnique({
      where: { token },
    });

    // Session bulunamadıysa, süresi geçtiyse veya iptal edildiyse
    if (
      !session ||
      session.expiresAt < new Date() ||
      session.revokedAt !== null
    ) {
      return null;
    }

    // Session'ı güncelle (son kullanma süresini uzat)
    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: new Date(Date.now() + SESSION_EXPIRY),
        updatedAt: new Date(),
      },
    });

    return session.userId;
  },

  // Session silme (çıkış yapma işlemi)
  async revoke(token: string): Promise<boolean> {
    try {
      await prisma.session.update({
        where: { token },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Kullanıcının tüm session'larını silme
  async revokeAll(userId: string): Promise<boolean> {
    try {
      await prisma.session.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch (error) {
      return false;
    }
  },
};

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
