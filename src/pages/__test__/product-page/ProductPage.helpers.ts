import { within } from "@testing-library/dom";
import { expect } from "vitest";

const tableHeaderTitles = ["ID",
"Title",
"Image",
"Price",
"Status",]

export function verifyHeader(headerRow:HTMLElement){

    const headerScope = within(headerRow)

    const cells = headerScope.getAllByRole("columnheader");

    expect(cells.length).toBe(6)

    tableHeaderTitles.forEach((title, index)=>{
        within(cells[index]).getByText(title)
    })

    // within(cells[0]).getByText("ID")
    // within(cells[1]).getByText("Title")
    // within(cells[2]).getByText("Image")
    // within(cells[3]).getByText("Price")
    // within(cells[4]).getByText("Status")


}
