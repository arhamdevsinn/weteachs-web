// @ts-nocheck
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";

export const CreateCategoryDialog = ({
  open,
  setOpen,
  categoryData,
  setCategoryData,
  handleCategorySubmit,
  loading,
  handleImage,
  previewImage,
  setPreviewImage,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-white rounded-xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-semibold text-primary">
            Create Category
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Fill in details to create a new category for your expert profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <label className="text-sm font-medium text-gray-700">Category Title</label>
          <Input
            placeholder="Title"
            onChange={(e) => setCategoryData({ ...categoryData, title: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">Topic</label>
          <Input
            placeholder="Topic"
            onChange={(e) => setCategoryData({ ...categoryData, topic: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">Description</label>
          <Input
            placeholder="Description"
            onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">Rate (USD)</label>
          <Input
            type="number"
            placeholder="Rate"
            onChange={(e) => setCategoryData({ ...categoryData, category_rate: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">Experience Level</label>
          <Select
            onValueChange={(val) => setCategoryData({ ...categoryData, ExperienceLevel: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <label className="text-sm font-medium text-gray-700">Language</label>
          <Input
            placeholder="Language (e.g. English)"
            onChange={(e) => setCategoryData({ ...categoryData, Language: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">Upload Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="text-sm"
          />

          {previewImage && (
            <div className="mt-3 flex justify-center">
              <div className="relative group">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setCategoryData({ ...categoryData, image: null });
                  }}
                  className="absolute top-1 right-1 bg-white text-red-500 rounded-full shadow p-1 hover:bg-red-100"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        <Button
          className="w-full mt-5 bg-primary text-white hover:bg-primary/90"
          onClick={() => handleCategorySubmit(categoryData)}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Category"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
