import { Static } from "elysia";
import { loginDto, registerDto } from "./dtos";

// LOGIN
export type LoginPayload = Static<(typeof loginDto)["body"]>;

// REGISTER
export type RegisterPayload = Static<(typeof registerDto)["body"]>;

// SESSION
export interface Session {
  id: string;
  email: string;
  name?: string | null;
}
