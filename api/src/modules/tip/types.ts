import { Static } from 'elysia';
import { tipCreateDto, tipResponseDto, tipShowDto, tipUpdateDto } from './dtos';

// CREATE
export type TipCreatePayload = Static<(typeof tipCreateDto)['body']>;

// UPDATE
export type TipUpdatePayload = Static<(typeof tipUpdateDto)['body']>;

// GET /:id
export type TipShowParams = Static<(typeof tipShowDto)['params']>;

// RESPONSE
export type TipResponse = Static<typeof tipResponseDto>;

// DELETE /:id (aynı param)
export type TipDeleteParams = TipShowParams;
