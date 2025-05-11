import { Static } from "elysia";
import {
  bookmarkCreateDto,
  bookmarkIndexDto,
  bookmarkResponseDto,
} from "./dtos";

// CREATE
export type BookmarkCreatePayload = Static<(typeof bookmarkCreateDto)["body"]>;

// LIST
export type BookmarkIndexQuery = Static<(typeof bookmarkIndexDto)["query"]>;

// RESPONSE
export type BookmarkResponse = Static<typeof bookmarkResponseDto>;
