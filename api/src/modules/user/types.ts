import { Static } from "elysia";
import {
  userCreateDto,
  userResponseDto,
  userShowDto,
  userUpdateDto,
} from "./dtos";

// CREATE
export type UserCreatePayload = Static<(typeof userCreateDto)["body"]>;

// UPDATE
export type UserUpdatePayload = Static<(typeof userUpdateDto)["body"]>;

// GET /:id
export type UserShowParams = Static<(typeof userShowDto)["params"]>;

// RESPONSE
export type UserResponse = Static<typeof userResponseDto>;

// DELETE /:id
export type UserDeleteParams = UserShowParams;
