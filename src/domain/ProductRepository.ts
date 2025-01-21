import { Product } from "./Product.interface";

export interface ProductRepository{
    getAll(): Promise<Product[]>
}