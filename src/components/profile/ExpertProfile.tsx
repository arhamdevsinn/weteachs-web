"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";

const ExpertDialog = () => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState("/placeholder-avatar.png");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <>
            {/* Main Expert Button */}
            <Button
                onClick={() => setOpen(true)}
                className="bg-primary text-white font-medium px-8 py-2 rounded-full shadow-md hover:bg-primary transition"
            >
                Expert
            </Button>


            {/* Dialog Box */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 bg-gray-50">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center font-semibold text-primary">
                            Complete Your Expert Profile
                        </DialogTitle>
                    </DialogHeader>

                    {/* Upload Section */}
                    <div className="flex flex-col items-center mt-4">
                        <div className="relative w-32 h-32 rounded-full border-2 border-primary/40 overflow-hidden flex items-center justify-center bg-white">
                            <img
                                src={preview}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                            <label className="absolute bottom-0 bg-primary text-white text-xs py-1 px-3 rounded-t-lg cursor-pointer">
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">(Upload Image)</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 mt-6 w-full">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Display Name
                            </label>
                            <Input placeholder="Enter your display name" />
                        </div>

                        {/* Profile Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Profile Bio
                            </label>
                            <Input placeholder="Write a short bio about yourself" />
                        </div>

                        {/* Birthday */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Birthday
                            </label>
                            <Input type="date" />
                        </div>

                        {/* How did you hear of us */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                How did you hear about us?
                            </label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                    <SelectItem value="youtube">YouTube</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <Button className="w-full bg-primary text-white mt-6 hover:bg-primary">
                        Submit Profile
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ExpertDialog;
