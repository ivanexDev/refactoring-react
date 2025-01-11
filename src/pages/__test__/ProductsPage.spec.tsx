import { render, RenderResult, screen } from "@testing-library/react";
import { test } from "vitest";
import { ProductsPage } from "../ProductsPage";
import { AppProvider } from "../../context/AppProvider";
import { ReactNode } from "react";

test("Loads and displays title", async () => {
    RenderComponent(<ProductsPage />);

    await screen.findAllByRole("heading", { name: "Product price updater" });
});

function RenderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
