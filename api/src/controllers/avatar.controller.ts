import fs from "fs";
import multer from "multer";
import path from "path";
import {
  Authorized,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  NotFoundError,
  Param,
  Put,
  Res,
  UploadedFile,
  JsonController,
} from "routing-controllers";
import { Service } from "typedi";
import { UserDTO } from "../dtos";
import { UserService } from "../services/user.service";
import { randomUUID } from "crypto";

export const AVATARS_DIR = process.env.AVATARS_DIR ?? "/data/avatars";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
    cb(null, AVATARS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const multerOptions = {
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
};

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

@Service()
@JsonController()
export class AvatarController {
  constructor(private userService: UserService) {}

  @Get("/avatars/:filename")
  async getAvatar(@Param("filename") filename: string, @Res() res: any) {
    // Prevent path traversal
    const safeName = path.basename(filename);
    const filePath = path.resolve(AVATARS_DIR, safeName);

    if (!filePath.startsWith(path.resolve(AVATARS_DIR))) {
      throw new ForbiddenError();
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError();
    }

    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.setHeader("X-Content-Type-Options", "nosniff");

    await new Promise<void>((resolve, reject) => {
      res.sendFile(filePath, (err: Error) => {
        if (err) reject(err);
        else resolve();
      });
    });
    return res;
  }

  @Authorized()
  @Put("/users/:id/avatar")
  async updateAvatar(
    @Param("id") id: string,
    @CurrentUser() currentUser: UserDTO,
    @UploadedFile("avatar", { options: multerOptions }) file: Express.Multer.File,
    @Res() res: any,
  ) {
    if (currentUser.id !== id) {
      if (file) fs.unlinkSync(file.path);
      throw new ForbiddenError();
    }

    // Remove old avatar file if present
    const existingUser = await this.userService.getUserById(id);
    if (existingUser?.avatarUrl) {
      const oldFilename = path.basename(existingUser.avatarUrl);
      const oldPath = path.resolve(AVATARS_DIR, oldFilename);
      if (oldPath.startsWith(path.resolve(AVATARS_DIR)) && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const avatarUrl = `/avatars/${file.filename}`;
    const updated = await this.userService.updateAvatar(id, avatarUrl);
    return res.json({ avatarUrl: updated.avatarUrl });
  }

  @Authorized()
  @Delete("/users/:id/avatar")
  async resetAvatar(
    @Param("id") id: string,
    @CurrentUser() currentUser: UserDTO,
    @Res() res: any,
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenError();
    }

    const existingUser = await this.userService.getUserById(id);
    if (existingUser?.avatarUrl) {
      const oldFilename = path.basename(existingUser.avatarUrl);
      const oldPath = path.resolve(AVATARS_DIR, oldFilename);
      if (oldPath.startsWith(path.resolve(AVATARS_DIR)) && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await this.userService.updateAvatar(id, null);
    return res.json({ avatarUrl: null });
  }
}
