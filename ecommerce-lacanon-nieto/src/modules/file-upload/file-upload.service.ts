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
    const product = await this.productsRepository.findOneBy({ id: productId }); // buscamos el producto por id

    if (!product) {
      throw new NotFoundException('Product not found'); //si no encuentro el producto
    }
    const uploadResponse = await this.filesUploadRepository.uploadImage(file); //sube a la nube

    await this.productsRepository.update(productId, {
      //actualizar el producto con la ID
      imgUrl: uploadResponse.secure_url, // sustuyo la url de la imagen por con la security url de cloudinary
    });
    //update solo actualiza y por ello debo usar el metodo find para buscar el producto que actualice para que lo retorne
    return await this.productsRepository.findOneBy({ id: productId });
  }
}
