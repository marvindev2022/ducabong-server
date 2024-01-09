import { ProductRepository } from '@app/repositories/Product/product';
import Product from '@domain/Product/product';
import { BadRequestException, NotFoundException } from '@nestjs/common';


export class inMemoryProductrRepository implements ProductRepository {
  public products: Product[] = [];
  


    async getProducts(): Promise<any[]> {
        return this.products;
    }

    async getProductById(id: string): Promise<any> {
        const product = this.products.find(product => product.props.id === id);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async createProduct(product: any): Promise<any> {
        this.products.push(product);

        return product;
    }

    async updateProduct(id: string, product: any): Promise<any> {
        const productIndex = this.products.findIndex(product => product.props.id === id);

        if (productIndex < 0) {
            throw new NotFoundException('Product not found');
        }

        Object.assign(this.products[productIndex].props, product);

        return this.products[productIndex];
    }

    async deleteProduct(id: string): Promise<any> {
        const productIndex = this.products.findIndex(product => product.props.id === id);

        if (productIndex < 0) {
            throw new NotFoundException('Product not found');
        }

        this.products.splice(productIndex, 1);

        return this.products;
    }


}