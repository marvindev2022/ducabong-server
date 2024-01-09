import { ProductRepository } from '@app/repositories/Product/product';
import {
    Injectable,
  } from '@nestjs/common';

  @Injectable()
  export class ProductService {
    constructor(
      private productRepository: ProductRepository,
    ) {}
  
    async getProducts(): Promise<any[]> {
      return await this.productRepository.getProducts();
    }
  
    async getProductById(id: string): Promise<any> {
      return await this.productRepository.getProductById(id);
    }
  
    async createProduct(product: any): Promise<any> {
      return await this.productRepository.createProduct(product);
    }
  
    async updateProduct(id: string, product: any): Promise<any> {
      return await this.productRepository.updateProduct(id, product);
    }
  
    async deleteProduct(id: string): Promise<any> {
      return await this.productRepository.deleteProduct(id);
    }
  }

