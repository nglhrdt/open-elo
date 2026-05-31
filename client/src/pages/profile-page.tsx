import { useDeleteAvatar, useGetProfile, useUploadAvatar } from '@/api/hooks/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AvatarCropDialog } from '@/components/avatar-crop-dialog';
import { RenameUserDialog } from '@/features/player/player-header/rename-user-dialog';
import { CameraIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function ProfilePage() {
  const { data: profile } = useGetProfile();
  const uploadAvatar = useUploadAvatar(profile?.id ?? '');
  const deleteAvatar = useDeleteAvatar(profile?.id ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  if (!profile) return null;

  const avatarSrc = profile.avatarUrl ? `${API_BASE}${profile.avatarUrl}` : undefined;
  const initials = profile.username.slice(0, 2).toUpperCase();
  const isMutating = uploadAvatar.isPending || deleteAvatar.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    e.target.value = '';
  };

  const handleCrop = (blob: Blob) => {
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
    uploadAvatar.mutate(file);
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const handleCancelCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  return (
    <div className="flex flex-col gap-6 grow shrink">
      <div className="flex items-center justify-between gap-4 lg:gap-8 shrink-0">
        <div className="flex items-center gap-4 grow shrink">
          <div className="relative shrink-0">
            <Avatar className="size-16">
              <AvatarImage src={avatarSrc} alt={profile.username} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              aria-label="Upload avatar"
              disabled={isMutating}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              <CameraIcon className="size-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center justify-between gap-4 grow shrink">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <RenameUserDialog userId={profile.id} />
          </div>
        </div>
      </div>

      {profile.avatarUrl && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isMutating}
            onClick={() => deleteAvatar.mutate()}
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon className="size-4 mr-1" />
            Remove avatar
          </Button>
        </div>
      )}

      {cropSrc && (
        <AvatarCropDialog
          imageSrc={cropSrc}
          open={true}
          onCrop={handleCrop}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  );
}

