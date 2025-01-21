import { Product } from "./Product.interface";
import { ProductRepository } from "./ProductRepository";

export class GetProducts {
    constructor(private productRepository: ProductRepository) {}

    async execute(): Promise<Product[]> {
        return this.productRepository.getAll()
    }
}

