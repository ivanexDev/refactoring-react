import { waitFor, within } from "@testing-library/dom";
import { RemoteProduct } from "../../../api/StoreApi";
import { MockWebServer } from "../../../tests/MockWebServer";
import productResponse from "./data/productResponse.json";
import { screen } from "@testing-library/react";
import { expect } from "vitest";

import userEvent from "@testing-library/user-event";

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

export async function waitToTableIsLoad() {
    await waitFor(async () =>
        expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1)
    );
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]) {
    expect(rows.length).toBe(products.length);

    rows.forEach((row, index) => {
        const rowScope = within(row);
        const cells = rowScope.getAllByRole("cell");

        expect(cells.length).toBe(6);

        const product = products[index];

        within(cells[0]).getByText(product.id);
        within(cells[1]).getByText(product.title);

        const image: HTMLImageElement = within(cells[2]).getByRole("img");
        expect(image.src).toBe(product.image);

        within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
        within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");
    });
}

export async function openDialogToEditPrice(index: number): Promise<HTMLElement> {
    const allRows = await screen.findAllByRole("row");

    const [, ...rows] = allRows;

    const row = rows[index];

    const rowScope = within(row);

    await userEvent.click(rowScope.getByRole("menuitem"));

    const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });

    await userEvent.click(updatePriceMenu);

    const dialog = await screen.findByRole("dialog");

    return dialog;
}

export async function verifyDialog(dialog: HTMLElement, product: RemoteProduct) {
    const dialogScope = within(dialog);

    dialogScope.getByText(product.title);

    const header: HTMLElement = dialogScope.getByRole("heading");

    expect(header.innerHTML).toBe("Update price");

    const image: HTMLImageElement = dialogScope.getByRole("img");

    expect(image.src).toBe(product.image);

    expect(dialogScope.findByDisplayValue(product.price));
}

export async function typePrice(dialog: HTMLElement, price: string) {
    const dialogScope = within(dialog)
    const input : HTMLInputElement = dialogScope.getByRole('textbox', {  name: /price/i})
    await userEvent.clear(input)
    await userEvent.type(input, price);
}

export async function verifyValidations(dialog: HTMLElement, error: string){

    const dialogScope = within(dialog)
    dialogScope.getByText(error)
}

export async function changePrice(dialog: HTMLElement, price: string) {
    const dialogScope = within(dialog)
    const input : HTMLInputElement = dialogScope.getByRole('textbox', {  name: /price/i})
    await userEvent.clear(input)
    await userEvent.type(input, price)
    expect(input.value).toBe(price)
    const saveButton:HTMLButtonElement = dialogScope.getByRole('button', {  name: /save/i}) 
    await userEvent.click(saveButton)
}

export function verifyProductStatus(row:HTMLElement, status: string) {


        const rowScope = within(row);
        const cells = rowScope.getAllByRole("cell");
        expect(cells.length).toBe(6);
        within(cells[4]).getByText(status);
        


    
}