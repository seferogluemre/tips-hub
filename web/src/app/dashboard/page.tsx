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
import { MessageSquare, Share2, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: tips, isLoading } = useTips();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">İpuçları</h1>
        <Link href="/dashboard/create-tip">
          <Button>Yeni İpucu Ekle</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <Input placeholder="İpuçlarını ara..." className="max-w-sm" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sıralama</span>
          <select className="p-2 bg-background border rounded-md text-sm">
            <option value="newest">En Yeni</option>
            <option value="popular">En Popüler</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Etiket Ekle</span>
          <select className="p-2 bg-background border rounded-md text-sm">
            <option value="">Tüm Etiketler</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
                <CardTitle className="mt-3 text-lg">{tip?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  {tip?.content}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tip?.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {tag}
                    </span>
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
  );
}
