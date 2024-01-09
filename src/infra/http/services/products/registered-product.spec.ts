import { inMemoryProductrRepository } from '@test/repositories/in-memory-product-repository';
import { ProductService } from './products.service';

describe('Product', () => {
  it('should register a new product', async () => {
    const productRepository = new inMemoryProductrRepository();
    const productService = new ProductService(productRepository);

    const newProduct = {
      name: 'any_name',
      price: 10,
      description: 'any_description',
      image: 'any_image',
      quantity: 10,
    };

    const product = await productService.createProduct(newProduct);

    expect(productRepository.products[0]).toBe(product);
  });
});
