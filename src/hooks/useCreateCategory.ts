import { CategoryAPI } from "@/src/lib/api/createCategory";
import { useState } from "react";

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const createCategory = async (teacherId: string, data: any) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await CategoryAPI.createTeacherCategory(teacherId, data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error, success };
}
