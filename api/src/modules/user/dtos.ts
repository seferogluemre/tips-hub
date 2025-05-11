import { t } from "elysia";
import { ControllerHook } from "../../utils/controller-hook";
import { errorResponseDto } from "../../utils/error-response";
import {
  paginationQueryDto,
  paginationResponseDto,
} from "../../utils/pagination-helper";
import { uuidValidation } from "../../utils/uuid-validation";

// User model - name alanı nullable olarak tanımlandı (veritabanı modeline uygun olarak)
export const UserPlain = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.Optional(t.Nullable(t.String())),
  createdAt: t.Date(),
});

// User response DTO
export const userResponseDto = UserPlain;

// User create DTO - email formatı doğrulama eklendi, name zorunlu
export const UserPlainInputCreate = t.Object({
  email: t.String({
    format: "email",
    error: "Geçerli bir e-posta adresi giriniz",
    default: "",
  }),
  name: t.String({
    minLength: 2,
    error: "İsim en az 2 karakter olmalıdır",
    default: "",
  }),
  password: t.String({
    minLength: 6,
    error: "Şifre en az 6 karakter olmalıdır",
  }),
});

// User update DTO - güncelleme için her alan opsiyonel
export const UserPlainInputUpdate = t.Object({
  email: t.Optional(
    t.String({
      format: "email",
      error: "Geçerli bir e-posta adresi giriniz",
    })
  ),
  name: t.Optional(
    t.String({
      minLength: 2,
      error: "İsim en az 2 karakter olmalıdır",
    })
  ),
  password: t.Optional(
    t.String({
      minLength: 6,
      error: "Şifre en az 6 karakter olmalıdır",
    })
  ),
});

export const userIndexDto = {
  query: t.Object({
    ...paginationQueryDto.properties,
    search: t.Optional(t.String()),
  }),
  response: {
    200: paginationResponseDto(userResponseDto),
  },
  detail: {
    summary: "Index",
    description: "Returns list of users",
  },
} satisfies ControllerHook;

export const userCreateDto = {
  body: UserPlainInputCreate,
  response: { 200: userResponseDto, 422: errorResponseDto[422] },
  detail: {
    summary: "Create",
    description: "Creates a new user",
  },
} satisfies ControllerHook;

export const userUpdateDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  body: UserPlainInputUpdate,
  response: {
    200: userResponseDto,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Update",
    description: "Updates a user",
  },
} satisfies ControllerHook;

export const userShowDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  response: { 200: userResponseDto, 404: errorResponseDto[404] },
  detail: {
    summary: "Show",
    description: "Returns user details",
  },
} satisfies ControllerHook;

export const userDestroyDto = {
  ...userShowDto,
  response: {
    200: t.Object({ message: t.String() }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Destroy",
    description: "Deletes a user",
  },
} satisfies ControllerHook;
