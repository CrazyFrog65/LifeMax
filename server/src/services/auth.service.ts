import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_lifemax";

export const authService = {
  register: async (data: { email: string; passwordHash: string; name: string }) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.passwordHash, salt); // wait, parameter name is passwordHash but it holds raw password at first? Let's check naming. Let's make it accept raw password and hash it.

    const user = await userRepository.create({
      email: data.email,
      passwordHash: hash,
      name: data.name,
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { user, token };
  },

  login: async (email: string, rawPassword: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { user, token };
  },

  verifyToken: (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  },
};
