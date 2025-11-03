// @ts-nocheck
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Upload, User } from "lucide-react";
import Image from "next/image";

export const CreateTeacherDialog = ({
  open,
  setOpen,
  formData,
  setFormData,
  handleProfileSubmit,
  loading,
  handleImage,
  preview,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-semibold">
            Create Teacher Profile
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Fill your details to become an expert.
          </DialogDescription>
        </DialogHeader>

        {/* Upload Image */}
        <div className="flex flex-col items-center mt-6 space-y-3">
          <label
            htmlFor="profile-upload"
            className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-primary/40 shadow-md flex items-center justify-center cursor-pointer transition-all hover:border-primary"
          >
            {preview && preview !== "/placeholder-avatar.png" ? (
              <Image src={preview} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                <User className="w-14 h-14 text-gray-400 mb-2" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
              <Upload className="text-white w-6 h-6 mb-1" />
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full shadow-md">
                Change Photo
              </span>
            </div>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e)}
            />
          </label>
          <p className="text-xs text-gray-500 text-center">
            Click or drag to upload your profile picture
          </p>
        </div>

        {/* Profile Fields */}
        <div className="space-y-3 mt-4">
          <label className="text-sm font-medium text-gray-700">Display Name</label>
          <Input
            placeholder="Your display name"
            onChange={(e) =>
              setFormData({ ...formData, display_name: e.target.value, usernameT: e.target.value })
            }
          />

          <label className="text-sm font-medium text-gray-700">Bio</label>
          <Input
            placeholder="Write a short bio"
            onChange={(e) => setFormData({ ...formData, bio_T: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">Birthday</label>
          <Input
            type="date"
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
          />

          <label className="text-sm font-medium text-gray-700">
            How did you hear about us?
          </label>
          <Select
            onValueChange={(val) => setFormData({ ...formData, Howd_you_here_of_us: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Reddit">Reddit</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full mt-5 bg-primary text-white"
          onClick={handleProfileSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Profile"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
