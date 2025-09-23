import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import Image from "next/image";

export default function TeacherGallery({ teacherId }: { teacherId: string }) {
  const [gallery, setGallery] = useState<{ id: string; url: string }[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const galleryRef = collection(
          db,
          "TeacherDetails",
          teacherId,
          "TeacherGalleryCollection"
        );

        const snapshot = await getDocs(galleryRef);

        const items = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: data.url || "", // 👈 make sure your doc has `url` field
          };
        });

        setGallery(items);
        console.log("gallery items:", items);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    if (teacherId) {
      fetchGallery();
    }
  }, [teacherId]);

  return (
    <div className="text-sm">
      <div className="font-bold text-gray-800 mb-2">Recent Work Samples</div>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={item.url}
                alt={`gallery-${item.id}`}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          No images uploaded yet.
        </div>
      )}
    </div>
  );
}
