import { useEffect, useState } from "react";

import { useReload } from "../hooks/useReload";
import { Product } from "../../domain/Product.interface";
import { GetProducts } from "../../domain/GetProducts.usecase";

export function useProducts(getProducts: GetProducts) {
    const [products, setProducts] = useState<Product[]>([]);
    const [reloadKey, reload] = useReload();

    useEffect(() => {
        getProducts.execute().then( products =>{
            console.log("Reloading", reloadKey)
            setProducts(products)
        })
    }, [reloadKey, getProducts]);

    return {
        products,
        reload,
    };
}


