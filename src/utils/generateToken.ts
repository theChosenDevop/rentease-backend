import jwt from "jsonwebtoken";
import type{ SignOptions, Secret } from "jsonwebtoken";

export const generateToken = (
  userId: string,
  email: string,
  role: string
): string => {
  const secret: Secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const options: SignOptions = { expiresIn } as any;

  return jwt.sign(
    { id: userId, email, role },
    secret,
    options
  );
};
