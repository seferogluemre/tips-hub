import { Static } from "elysia";
import {
  commentCreateDto,
  commentResponseDto,
  commentShowDto,
  commentUpdateDto,
} from "./dtos";

// CREATE
export type CommentCreatePayload = Static<(typeof commentCreateDto)["body"]>;

// UPDATE
export type CommentUpdatePayload = Static<(typeof commentUpdateDto)["body"]>;

// GET /:id
export type CommentShowParams = Static<(typeof commentShowDto)["params"]>;

// RESPONSE
export type CommentResponse = Static<typeof commentResponseDto>;

// DELETE /:id
export type CommentDeleteParams = CommentShowParams;
