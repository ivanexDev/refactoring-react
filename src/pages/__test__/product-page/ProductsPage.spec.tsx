import { render, RenderResult, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { ProductsPage } from "../../ProductsPage";
import { AppProvider } from "../../../context/AppProvider";
import { ReactNode } from "react";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenThereAreNoProducts } from "./ProductPage.fixture";
import { verifyHeader } from "./ProductPage.helpers";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    givenAProducts(mockWebServer);

    test("Loads and displays title", async () => {
        RenderComponent(<ProductsPage />);

        await screen.findAllByRole("heading", { name: "Product price updater" });
    });

    test("should show an empty table", async () => {
        givenThereAreNoProducts(mockWebServer);

        RenderComponent(<ProductsPage />);

        const rows = await screen.findAllByRole("row");

        expect(rows.length).toBe(1);

        verifyHeader(rows[0]);
    });
});

function RenderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
