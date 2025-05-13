import { tipService } from "@/services/tip.service";
import { ApiResponse, GetTipsParams, Tip } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTips = (params?: GetTipsParams) => {
  return useQuery<ApiResponse<Tip[]>, Error>({
    queryKey: [
      "tips",
      params?.tag,
      params?.tags,
      params?.sort,
      params?.search,
      params?.page,
    ],
    queryFn: () => tipService.getTips(params),
  });
};
