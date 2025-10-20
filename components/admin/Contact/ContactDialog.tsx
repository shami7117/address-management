"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";

// Local Contact type for dialog props — keep in sync with app/(dashboard)/admin/contacts/page.tsx
interface LocalContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo?: string;
  active: boolean;
}

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: LocalContact | null;
  onSave: (contact: Omit<LocalContact, "id"> & { id?: string }) => void;
}

export function ContactDialog({
  open,
  onOpenChange,
  contact,
  onSave,
}: ContactDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    photo: "",
    active: true,
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [cropMode, setCropMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        title: contact.title,
        email: contact.email,
        phone: contact.phone,
        photo: contact.photo || "",
        active: contact.active,
      });
      setPhotoPreview(contact.photo || "");
    } else {
      setFormData({
        name: "",
        title: "",
        email: "",
        phone: "",
        photo: "",
        active: true,
      });
      setPhotoPreview("");
    }
    setErrors({ name: "", email: "", phone: "" });
    setCropMode(false);
  }, [contact, open]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (20 MB max)
    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be less than 20 MB");
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      alert("Only JPG and PNG files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCropMode(true);
        
        // Auto-crop to circular preview
        const canvas = canvasRef.current;
        if (canvas) {
          const size = Math.min(img.width, img.height);
          canvas.width = 200;
          canvas.height = 200;
          
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, 200, 200);
            
            // Create circular clip
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            
            // Draw image centered
            const sourceX = (img.width - size) / 2;
            const sourceY = (img.height - size) / 2;
            ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, 200, 200);
            
            const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
            setPhotoPreview(croppedDataUrl);
            setFormData((prev) => ({ ...prev, photo: croppedDataUrl }));
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setFormData((prev) => ({ ...prev, photo: "" }));
    setCropMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    onSave({
      ...(contact?.id && { id: contact.id }),
      ...formData,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {contact ? "Edit Contact" : "New Contact"}
            </DialogTitle>
            <DialogDescription>
              {contact
                ? "Update the contact information below."
                : "Add a new contact to your master list."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={photoPreview} />
                    <AvatarFallback>
                      {formData.name ? getInitials(formData.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemovePhoto}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  JPG or PNG, max 20 MB. Image will be cropped to circular format.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Software Engineer"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="john.doe@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="active" className="cursor-pointer">
                  Active Status
                </Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, active: checked }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Contact</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for image cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}