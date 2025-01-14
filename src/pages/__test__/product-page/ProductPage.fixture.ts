import { waitFor, within } from "@testing-library/dom";
import { RemoteProduct } from "../../../api/StoreApi";
import { MockWebServer } from "../../../tests/MockWebServer";
import productResponse from "./data/productResponse.json";
import { screen } from "@testing-library/react";
import { expect } from "vitest";

export function givenAProducts(mockWebServer: MockWebServer): RemoteProduct[] {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            response: productResponse,
            httpStatusCode: 200,
        },
    ]);

    return productResponse;
}

export function givenThereAreNoProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            response: [],
            httpStatusCode: 200,
        },
    ]);
}

export async function waitToTableIsLoad(){
    await waitFor(async()=> expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1))
}

export function verifyRows( rows: HTMLElement[], products: RemoteProduct[] ){

    expect(rows.length).toBe(products.length)

    rows.forEach((row, index) =>{
        const rowScope = within(row);
        const cells = rowScope.getAllByRole("cell")

        expect(cells.length).toBe(6)

        const product = products[index]

        within(cells[0]).getByText(product.id);
        within(cells[1]).getByText(product.title);

        const image: HTMLImageElement = within(cells[2]).getByRole("img");
        expect(image.src).toBe(product.image)

        within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
        within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");

    })
}