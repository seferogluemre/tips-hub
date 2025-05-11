"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTips } from "@/hooks/use-tips";
import { useTipFilterStore } from "@/store/tip-filter.store";
import { MessageSquare, Search, Share2, ThumbsUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TipsPage() {
  const router = useRouter();

  // Zustand store'dan filtreleme durumunu al
  const { search, tag, sort, setSearch, setTag, setSort, resetFilters } =
    useTipFilterStore();

  const [searchQuery, setSearchQuery] = useState(search);

  const {
    data: tips,
    isLoading,
    refetch,
  } = useTips({
    search,
    tag,
    sort,
  });

  // Komponent mount olduğunda lokal state'i store'dan gelen değerle güncelle
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  // URL'i filtrelere göre güncelle
  const updateUrl = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    if (sort) params.set("sort", sort);

    router.push(`/dashboard/tips?${params.toString()}`);
  };

  useEffect(() => {
    updateUrl();
    refetch();
  }, [search, tag, sort]);

  // Arama formunun gönderilmesi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchQuery);
  };

  // Tag'e tıklandığında
  const handleTagClick = (selectedTag: string) => {
    setTag(selectedTag);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tüm İpuçları</h1>
        <p className="text-muted-foreground">
          Yazılım ipuçlarını incele, filtrele ve keşfet
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm space-x-2"
        >
          <Input
            placeholder="İpuçlarını ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sıralama:</span>
          <select
            className="p-2 bg-background border rounded-md text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "popular")}
          >
            <option value="newest">En Yeni</option>
            <option value="popular">En Popüler</option>
          </select>
        </div>

        {tag && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Filtre:</span>
            <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => setTag("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-3/4 bg-muted rounded mt-4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3 border-t">
                <div className="flex gap-3">
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="h-5 w-5 bg-muted rounded"></div>
                </div>
                <div className="h-5 w-5 bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {tips && tips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Sonuç bulunamadı.</p>
              <Button
                variant="link"
                onClick={() => {
                  resetFilters();
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips?.data?.map((tip) => (
                <Card key={tip.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        {tip?.author?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{tip?.author?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tip?.createdAt}
                        </p>
                      </div>
                    </div>
                    <CardTitle className="mt-3 text-lg">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {tip?.content}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tip?.tags?.map((tag) => (
                        <button
                          key={tag}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{tip?.likes}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{tip?.comments}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
