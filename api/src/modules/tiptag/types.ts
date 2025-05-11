import { Static } from "elysia";
import { tipTagCreateDto, tipTagResponseDto, tipTagShowDto } from "./dtos";

// CREATE
export type TipTagCreatePayload = Static<(typeof tipTagCreateDto)["body"]>;

// GET /:id
export type TipTagShowParams = Static<(typeof tipTagShowDto)["params"]>;

// RESPONSE
export type TipTagResponse = Static<typeof tipTagResponseDto>;

// DELETE /:id
export type TipTagDeleteParams = TipTagShowParams;
