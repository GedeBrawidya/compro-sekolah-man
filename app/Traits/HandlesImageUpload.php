<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\storage;
use Illuminate\Support\Str;
use Intervention\image\Laravel\Facades\image;

trait HandlesImageUpload
{
    /**
     * @param UploadedFile $file
     * @param string $folder
     * @param int $quality
     * @param int|null $maxWidth
     * @param string $disk
     * @return string
     */

    public function uploadAndCompressWebp(
        UploadedFile $file,
        string $folder,
        int $quality = 80,
        ?int $maxWidth = 1920,
        string $disk = 'public'
    ): string {
        $filename = Str::uuid().'.webp';
        $relativePath = trim($folder, '/').'/'.$filename;

        $image = Image::read($file);

        if ($maxWidth !== null && $image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        $encoded = $image->toWebp($quality);

        Storage::disk($disk)->put($relativePath, (string) $encoded);

        return $relativePath;
    }

    /**
     * @param string|null $path
     * @param string $disk
     * @return bool
     */

    public function deleteImage(?string $path, string $disk = 'public'): bool
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }
}
