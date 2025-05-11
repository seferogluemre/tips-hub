import { Static } from "elysia";
import { tagCreateDto, tagResponseDto, tagShowDto, tagUpdateDto } from "./dtos";

// CREATE
export type TagCreatePayload = Static<(typeof tagCreateDto)["body"]>;

// UPDATE
export type TagUpdatePayload = Static<(typeof tagUpdateDto)["body"]>;

// GET /:id
export type TagShowParams = Static<(typeof tagShowDto)["params"]>;

// RESPONSE
export type TagResponse = Static<typeof tagResponseDto>;

// DELETE /:id (aynı param)
export type TagDeleteParams = TagShowParams;
