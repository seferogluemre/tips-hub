"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function TipDetailPage({ params }: { params: { id: string } }) {
  // In a real implementation, we would fetch the tip data using the params.id
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Zeynep Kaya",
      avatar: "ZK",
      date: "1 gün önce",
      content:
        "Harika bir ipucu! useEffect hook'unu kullanırken dependency array'i doğru şekilde kullanmak gerçekten çok önemli. Benim de karşılaştığım birçok performans sorununu çözdü.",
      likes: 8,
    },
    {
      id: 2,
      author: "Ahmet Yılmaz",
      avatar: "AY",
      date: "1 gün önce",
      content:
        "Katılıyorum. Ayrıca useCallback ve useMemo kullanımı da bu tür sorunları önlemede çok etkili.",
      likes: 3,
    },
    {
      id: 3,
      author: "Mehmet Demir",
      avatar: "MD",
      date: "12 saat önce",
      content:
        "Cleanup fonksiyonları hakkında daha fazla örnek görmek isterim. Özellikle WebSocket bağlantıları ve event listener'lar için nasıl kullanılabilir?",
      likes: 5,
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Hata",
        description: "Yorum alanı boş olamaz.",
        variant: "destructive",
      });
      return;
    }

    const comment = {
      id: comments.length + 1,
      author: "Kullanıcı",
      avatar: "K",
      date: "Şimdi",
      content: newComment,
      likes: 0,
    };

    setComments([...comments, comment]);
    setNewComment("");

    toast({
      title: "Başarılı",
      description: "Yorumunuz eklendi.",
    });
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const similarTips = [
    {
      id: 1,
      author: "Zeynep Kaya",
      avatar: "ZK",
      date: "3 gün önce",
      title: "React useMemo Hook'u ile Performans Optimizasyonu",
      tags: ["React", "Hooks", "+1"],
    },
    {
      id: 2,
      author: "Mehmet Demir",
      avatar: "MD",
      date: "1 hafta önce",
      title: "React useCallback Hook'u Kullanım Örnekleri",
      tags: ["React", "Hooks", "+1"],
    },
    {
      id: 3,
      author: "Ayşe Yıldız",
      avatar: "AY",
      date: "2 hafta önce",
      title: "React Custom Hook Oluşturma Rehberi",
      tags: ["React", "Hooks", "+1"],
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Tip Content Section */}
      <div className="bg-card rounded-lg shadow-sm border p-6">
        {/* Author Info and Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>AY</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Ahmet Yılmaz</p>
              <p className="text-sm text-muted-foreground">
                Senior React Developer
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <div>Paylaşım: 2 gün önce</div>
            <div>Güncelleme: 1 gün önce</div>
          </div>
        </div>

        {/* Tip Title */}
        <h1 className="text-2xl font-bold mb-4">
          React useEffect Hook&apos;unu Optimize Etme Teknikleri
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/dashboard/tips?tag=React"
            className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
          >
            React
          </Link>
          <Link
            href="/dashboard/tips?tag=Hooks"
            className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
          >
            Hooks
          </Link>
          <Link
            href="/dashboard/tips?tag=Performance"
            className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
          >
            Performance
          </Link>
          <Link
            href="/dashboard/tips?tag=JavaScript"
            className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
          >
            JavaScript
          </Link>
          <Link
            href="/dashboard/tips?tag=Frontend"
            className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
          >
            Frontend
          </Link>
        </div>

        {/* Tip Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            React uygulamalarında performans optimizasyonu yaparken useEffect
            hook&apos;unun doğru kullanımı çok önemlidir. İşte bazı önemli
            ipuçları:
          </p>

          <ol className="space-y-4 mt-4">
            <li>
              <strong>Dependency Array&apos;i Doğru Kullanın:</strong>{" "}
              useEffect&apos;in ikinci parametresi olan dependency array,
              effect&apos;in ne zaman çalışacağını belirler. Boş bir array ([])
              component mount olduğunda sadece bir kez çalışmasını sağlar.
            </li>
            <li>
              <strong>Gereksiz Render&apos;ları Önleyin:</strong> Effect içinde
              kullandığınız tüm değişkenleri dependency array&apos;e ekleyin,
              ancak gereksiz render&apos;ları önlemek için useMemo ve
              useCallback kullanmayı düşünün.
            </li>
            <li>
              <strong>Cleanup Fonksiyonu Kullanın:</strong> Effect&apos;in
              return değeri olarak bir cleanup fonksiyonu döndürerek memory
              leak&apos;leri önleyebilirsiniz.
            </li>
          </ol>

          <p className="mt-4">İşte bir örnek:</p>

          <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-4">
            <code>
              {`import { useState, useEffect, useCallback } from 'react';

const ExampleComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  
  // useCallback ile fonksiyonu memoize ediyoruz
  const fetchUserData = useCallback(async () => {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    setUserData(data);
  }, [userId]);
  
  useEffect(() => {
    fetchUserData();
    
    // Cleanup fonksiyonu
    return () => {
      // Burada gerekli temizlik işlemleri yapılabilir
      console.log('Component unmounted');
    };
  }, [fetchUserData]);
  
  if (!userData) return <div>Loading...</div>;
  
  return <div>{userData.name}</div>;
};`}
            </code>
          </pre>
        </div>
      </div>

      {/* Similar Tips Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Benzer İpuçları</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {similarTips.map((tip) => (
            <Link
              key={tip.id}
              href={`/dashboard/tips/${tip.id}`}
              className="bg-card rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {tip.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{tip.author}</span>
                <span className="text-xs text-muted-foreground">
                  • {tip.date}
                </span>
              </div>
              <h3 className="font-medium mb-2">{tip.title}</h3>
              <div className="flex flex-wrap gap-1 mb-1">
                {tip.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-secondary/50 text-secondary-foreground text-xs px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8" id="comments">
        <h2 className="text-xl font-bold mb-4">Yorumlar ({comments.length})</h2>

        {/* New Comment Form */}
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
            <span>Yorum Ekle</span>
          </div>
          <Textarea
            placeholder="Düşüncelerinizi paylaşın..."
            className="min-h-24 mb-4"
            value={newComment}
            onChange={handleCommentChange}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment}>Gönder</Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card rounded-lg shadow-sm border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{comment.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {comment.date}
                  </span>
                </div>
                <button className="text-sm text-muted-foreground">•••</button>
              </div>
              <p className="text-sm">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground"
                >
                  <span className="mr-1">{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground"
                >
                  Yanıtla
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
