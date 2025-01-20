import { render, RenderResult, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { ProductsPage } from "../../ProductsPage";
import { AppProvider } from "../../../context/AppProvider";
import { ReactNode } from "react";
import { MockWebServer } from "../../../tests/MockWebServer";
import {
    changePrice,
    changeUserRole,
    givenAProducts,
    givenThereAreNoProducts,
    openDialogToEditPrice,
    tryOpenDialog,
    typePrice,
    verifyDialog,
    verifyProductStatus,
    verifyRows,
    verifyValidations,
    waitToTableIsLoad,
} from "./ProductPage.fixture";
import { verifyHeader } from "./ProductPage.helpers";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", async () => {
        givenAProducts(mockWebServer);
        RenderComponent(<ProductsPage />);

        await screen.findAllByRole("heading", { name: "Product price updater" });
    });

    describe("Table", () => {
        test("should show an empty table", async () => {
            givenThereAreNoProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            const rows = await screen.findAllByRole("row");

            expect(rows.length).toBe(1);

            verifyHeader(rows[0]);
        });

        test("should show expected header and rows in the table", async () => {
            const products = givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const allRows = await screen.findAllByRole("row");

            const [header, ...rows] = allRows;

            verifyHeader(header);

            verifyRows(rows, products);
        });
    });

    describe("Edit price", async () => {
        test("Should show dialog with the prouct", async () => {
            const products = givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(0);

            verifyDialog(dialog, products[0]);
        });

        test("Should show error for negative prices", async () => {
            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "-4");

            await verifyValidations(dialog, "Invalid price format");
        });

        test("Should show error for no number characters", async () => {
            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "abc");

            await verifyValidations(dialog, "Only numbers are allowed");
        });

        test("Should show error for numbers greater than 999.99", async () => {
            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "1000");

            await verifyValidations(dialog, "The max possible price is 999.99");
        });

        test("Should change price", async () => {
            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(0);

            await changePrice(dialog, "33");
        });

        test("Should be active when price is greater than 0", async () => {
            const index = 0;

            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(index);

            await changePrice(dialog, "50");

            const allRows = await screen.findAllByRole("row");

            const [, ...rows] = allRows;

            verifyProductStatus(rows[index], "active");
        });

        test("Should be inactive when prince is 0", async () => {
            const index = 0;

            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            const dialog = await openDialogToEditPrice(index);

            await changePrice(dialog, "0");

            const allRows = await screen.findAllByRole("row");

            const [, ...rows] = allRows;

            verifyProductStatus(rows[index], "inactive");
        });

        test("Should show an error when is non admin", async () => {

            givenAProducts(mockWebServer);

            RenderComponent(<ProductsPage />);

            await waitToTableIsLoad();

            await changeUserRole()

            await tryOpenDialog(0)

            await screen.findByText(/only admin users can edit the price of a product/i)

        });
    });
});

function RenderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
