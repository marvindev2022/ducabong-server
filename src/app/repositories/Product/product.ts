

export abstract class ProductRepository {

    abstract  getProducts(): Promise<any[]>;
    abstract  getProductById(id: string): Promise<any>;
    abstract  createProduct(product: any): Promise<any>;
    abstract  updateProduct(id: string, product: any): Promise<any>;
    abstract  deleteProduct(id: string): Promise<any>;

}