import { MockWebServer } from "../../../tests/MockWebServer";
import productResponse from "./data/productResponse.json";

export function givenAProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            response: productResponse,
            httpStatusCode: 200,
        },
    ]);
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
