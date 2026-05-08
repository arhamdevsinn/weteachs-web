// @ts-nocheck
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
const getReputation = async (userId: string) => {


  const reputationRef = collection(
    db,
    "LimboUserMode",
    userId,
    "Reputation"
  );

  const snapshot = await getDocs(reputationRef);

  if (!snapshot.empty) {
    // Get first document
    const docData = snapshot.docs[0].data();

    console.log(docData);

    // Reputation value
    // console.log(docData.Reputation);

    return docData.Reputation;
  }

  return null;
};
const getRating = async (teacherId: string) => {


  const ratingRef = collection(
    db,
    "TeacherDetails",
    teacherId,
    "TeacherReviews"
  );

  const snapshot = await getDocs(ratingRef);

  if (!snapshot.empty) {
    // Get first document
    const docData = snapshot.docs[0].data();

    console.log(docData);

    // Reputation value
    console.log("Ratings:",docData.ratings);

    return docData.ratings;
  }

  return null;
};
export const getAllCategories = async (): Promise<[]> => {
  try {
    const q = query(collection(db, "Categories"), orderBy("upload_time", "desc"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // resolve teacher_ref for each category in parallel
    const enriched = await Promise.all(
      items.map(async (cat) => {
        let teacher = null;
        let limbo = null;
        try {
          const tr = cat.teacher_ref;
          let likes = null;
          const whoCreatedRef = cat.who_created_ref;
          if (typeof whoCreatedRef === "object" && whoCreatedRef.path) {
            const whoCreatedSnap = await getDoc(whoCreatedRef);
            if (whoCreatedSnap.exists()) {
              const whoCreatedData = whoCreatedSnap.data();
              if (whoCreatedData) {
                likes = await getReputation(whoCreatedSnap.id);
                cat.likes = likes; // attach likes to category for easy access
              }
            }
          }



          if (tr) {
            // handle DocumentReference or string path
            if (typeof tr === "object" && tr.path) {
              const teacherSnap = await getDoc(tr);
              if (teacherSnap.exists()) {
                teacher = { id: teacherSnap.id, ...teacherSnap.data() };
                const rating = await getRating(teacherSnap.id);
                cat.rating = rating; // attach rating to category for easy access
              }
            } else if (typeof tr === "string") {
              const parts = tr.split("/").filter(Boolean);
              if (parts.length >= 2) {
                const teacherDocRef = doc(db, ...parts);
                const teacherSnap = await getDoc(teacherDocRef);
                if (teacherSnap.exists()) teacher = { id: teacherSnap.id, ...teacherSnap.data() };
              }
            }
          }
          // Resolve limbo/limbo_ref on the teacher object (if present)
          try {
            const limboRef = teacher?.limbo_ref || teacher?.limboRef || teacher?.limbo_ref_path;
            if (limboRef) {
              if (typeof limboRef === "object" && limboRef.path) {
                const limboSnap = await getDoc(limboRef);
                if (limboSnap.exists()) limbo = { id: limboSnap.id, ...limboSnap.data() };
              } else if (typeof limboRef === "string") {
                const parts = limboRef.split("/").filter(Boolean);
                if (parts.length >= 2) {
                  const limboDocRef = doc(db, ...parts);
                  const limboSnap = await getDoc(limboDocRef);
                  if (limboSnap.exists()) limbo = { id: limboSnap.id, ...limboSnap.data() };
                }
              }
            }
          } catch (e) {
            console.error("Failed to resolve limbo_ref for teacher", cat.id, e);
          }
        } catch (err) {
          console.error("Failed to resolve teacher_ref for category", cat.id, err);
        }
        // attach resolved limbo object on teacher if available
        if (teacher && limbo) teacher.limbo = limbo;
        return { ...cat, teacher };
      })
    );

    return enriched;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
};

// Optional: simple paginated fetch (keeps teacher resolution)
export const getCategoriesPage = async ({
  limit = 20,
  startAfterDoc = null,
}: {
  limit?: number;
  startAfterDoc?: null;
} = {}) => {
  try {
    const col = collection(db, "Categories");
    const q = query(col, orderBy("upload_time", "desc"));
    // Note: add startAfter handling if needed for real pagination
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const enriched = await Promise.all(
      items.map(async (cat) => {
        let teacher = null;
        let limbo = null;
        try {
          const tr = cat.teacher_ref;
          if (tr) {
            // handle DocumentReference or string path
            if (typeof tr === "object" && tr.path) {
              const teacherSnap = await getDoc(tr);
              if (teacherSnap.exists()) teacher = { id: teacherSnap.id, ...teacherSnap.data() };
            } else if (typeof tr === "string") {
              const parts = tr.split("/").filter(Boolean);
              if (parts.length >= 2) {
                const teacherDocRef = doc(db, ...parts);
                const teacherSnap = await getDoc(teacherDocRef);
                if (teacherSnap.exists()) teacher = { id: teacherSnap.id, ...teacherSnap.data() };
              }
            }
          }
          // Resolve limbo/limbo_ref on the teacher object (if present)
          try {
            const limboRef = teacher?.limbo_ref || teacher?.limboRef || teacher?.limbo_ref_path;
            if (limboRef) {
              if (typeof limboRef === "object" && limboRef.path) {
                const limboSnap = await getDoc(limboRef);
                if (limboSnap.exists()) limbo = { id: limboSnap.id, ...limboSnap.data() };
              } else if (typeof limboRef === "string") {
                const parts = limboRef.split("/").filter(Boolean);
                if (parts.length >= 2) {
                  const limboDocRef = doc(db, ...parts);
                  const limboSnap = await getDoc(limboDocRef);
                  if (limboSnap.exists()) limbo = { id: limboSnap.id, ...limboSnap.data() };
                }
              }
            }
          } catch (e) {
            console.error("Failed to resolve limbo_ref for teacher", cat.id, e);
          }
        } catch (err) {
          console.error("Failed to resolve teacher_ref for category", cat.id, err);
        }
        // attach resolved limbo object on teacher if available
        if (teacher && limbo) teacher.limbo = limbo;
        return { ...cat, teacher };
      })
    );

    return {
      items: enriched,
      lastDoc: snap.docs[snap.docs.length - 1] || null,
    };
  } catch (err) {
    console.error("Failed to fetch categories page:", err);
    return { items: [], lastDoc: null };
  }
};