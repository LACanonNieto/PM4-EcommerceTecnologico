import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { Products } from '../products/entity/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly filesUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const uploadResponse = await this.filesUploadRepository.uploadImage(file);

    await this.productsRepository.update(productId, {
      imgUrl: uploadResponse.secure_url,
    });

    return await this.productsRepository.findOneBy({ id: productId });
  }
}
