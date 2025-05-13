import { Tag, TagType } from "@/types";

export const getTagString = (tag: Tag | string | null | undefined): string => {
  if (tag === null || tag === undefined) return "Etiket";
  if (typeof tag === "string") return tag;
  if ("name" in tag && typeof tag.name === "string") return tag.name;
  return "Etiket";
};

export const getTagName = (tag: TagType): string => {
  if (typeof tag === "string") {
    return tag;
  }
  return tag?.name || "Etiket";
};
