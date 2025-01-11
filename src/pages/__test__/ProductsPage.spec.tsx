import { render, RenderResult, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, test } from "vitest";
import { ProductsPage } from "../ProductsPage";
import { AppProvider } from "../../context/AppProvider";
import { ReactNode } from "react";
import { MockWebServer } from "../../tests/MockWebServer";
import productResponse from "./data/productResponse.json"

const mockWebServer = new MockWebServer()

describe("ProductsPage", () => {

    beforeAll(()=> mockWebServer.start())
    afterEach(()=> mockWebServer.resetHandlers())
    afterAll(()=> mockWebServer.close())

    givenAProducts()

    test("Loads and displays title", async () => {
        RenderComponent(<ProductsPage />);
    
        await screen.findAllByRole("heading", { name: "Product price updater" });
    });

})

function givenAProducts(){
    mockWebServer.addRequestHandlers([{
        method: "get",
        endpoint: "https://fakestoreapi.com/products",
        response: productResponse,
        httpStatusCode: 200
    }])

}



function RenderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
