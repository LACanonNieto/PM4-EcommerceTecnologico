import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Put(':productId')
  @UseInterceptors(FileInterceptor('file')) //metadata intercepta lo que recibe y lo guarda temporal en req.file
  @UseGuards(AuthGuard)
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'File must be maz 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|gif|webp|svg|bmp|tiff)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File, //upliadfile lo saca de la metadata y lo guarda como objeto en  multer
    @Param('productId', ParseUUIDPipe) productId: string, // buscar con decorador el ID
  ) {
    return this.fileUploadService.uploadImage(file, productId); //retorna la imagen cargada con id
  }
}
