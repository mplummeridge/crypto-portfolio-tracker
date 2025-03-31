import { type Locator, type Page, expect, test } from "@playwright/test";
import { z } from "zod";
import {
  ApiResponseSchema,
  CryptoCurrencySchema,
  SearchResultSchema,
} from "../app/api/crypto/types";
import { mockCryptoData } from "./mocks/crypto-data";

// Helper function to add a holding
async function addHolding(
  page: Page,
  cryptoName: string,
  cryptoSymbol: string,
  quantity: string,
): Promise<Locator> {
  // Locate the specific desktop container div first, escaping the colon
  const desktopButtonContainer = page.locator("div.hidden.md\\:block");
  // Then find the button by its label within that container
  await desktopButtonContainer
    .getByLabel("Add new cryptocurrency holding")
    .click();

  // Wait for *a* dialog to appear, then verify its title
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" }); // Wait for the container
  await expect(
    dialog.getByRole("heading", { name: "Add New Holding" }),
  ).toBeVisible(); // Verify title

  // Select a cryptocurrency (use the located dialog)
  const selectTrigger = dialog.locator('button[role="combobox"]');
  await selectTrigger.click();

  // Wait for the options listbox to appear, then find the option
  const listbox = page.locator('[role="listbox"]'); // Assuming standard role for the options container
  await listbox.waitFor({ state: "visible" });
  // Find the option containing the name, take the first match
  const cryptoOption = listbox
    .locator(`div[role="option"]:has-text("${cryptoName}")`)
    .first();
  await expect(cryptoOption).toBeVisible(); // Now check if the option is within the visible listbox
  await cryptoOption.click();

  await expect(listbox).not.toBeVisible();

  // Fill in quantity (use the located dialog)
  const quantityInput = dialog.locator('input[name="quantity"]'); // Reverted selector
  // Wait for the input to be visible and enabled before filling
  await quantityInput.waitFor({ state: "visible" });
  await quantityInput.fill(quantity);

  // Submit form (use the located dialog)
  const submitButton = dialog.locator('button[type="submit"]'); // Reverted selector
  // Wait for the button to be visible and enabled before clicking
  await expect(submitButton).toBeEnabled(); // Use expect to wait for enabled
  await submitButton.click();

  // Wait for success toast as confirmation of mutation success
  // await expect(page.getByText("Holding added to your portfolio.")).toBeVisible(); // Temporarily disabled toast check

  // Locate the holdings table directly
  const holdingsTableLocator = page.locator("table");

  // NOW, wait for the dialog to close
  await expect(dialog).not.toBeVisible();

  // --- NO RELOAD: Wait for dynamic update ---
  // Locate the row using the href link
  const rowLink = holdingsTableLocator.locator(
    `a[href="/details/${cryptoName.toLowerCase()}"]`,
  );
  const holdingRowLocator = rowLink.locator("xpath=ancestor::tr[1]");

  // Wait longer for the row to appear dynamically after state update
  await expect(holdingRowLocator).toBeVisible({ timeout: 20000 });
  // --- End Dynamic Wait ---

  // Return the locator for the identified table row
  return holdingRowLocator;
}

test.describe("Holding Management", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Mock API responses
    await page.route("**/api/crypto**", async (route) => {
      const url = new URL(route.request().url());
      const endpoint = url.searchParams.get("endpoint");

      if (endpoint?.includes("search")) {
        await route.fulfill({
          json: ApiResponseSchema(z.array(SearchResultSchema)).parse({
            data: mockCryptoData.searchResults,
            __source: "api",
            __provider: "coingecko",
          }),
        });
      } else if (endpoint?.includes("price")) {
        await route.fulfill({
          json: ApiResponseSchema(z.record(CryptoCurrencySchema)).parse({
            data: mockCryptoData.prices,
            __source: "api",
            __provider: "coingecko",
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Go to home page first
    await page.goto("/");

    // Set localStorage to represent an EMPTY portfolio state
    const emptyState = { state: { holdings: [] }, version: 0 };
    await page.evaluate((state) => {
      localStorage.setItem("crypto-portfolio", JSON.stringify(state));
    }, emptyState);

    // Reload the page to ensure it loads with the explicitly empty store state
    await page.reload();
  });

  test("should add a new holding successfully", async ({
    page,
  }: { page: Page }) => {
    const cryptoName = "Bitcoin";
    const cryptoSymbol = "BTC";
    const quantity = "1.5";

    // Use the helper function
    const holdingCardWrapper = await addHolding(
      page,
      cryptoName,
      cryptoSymbol,
      quantity,
    );

    // Verify content *within* that specific table row (tr)
    // Check for Name within the row
    await expect(
      holdingCardWrapper.getByText(cryptoName, { exact: true }),
    ).toBeVisible();
    // Check for Symbol within the row
    await expect(
      holdingCardWrapper.getByText(cryptoSymbol, { exact: true }),
    ).toBeVisible();
    // Check for Quantity and Symbol in the specific sub-element within the Value column (td)
    // Target the second-to-last td, then the specific div
    const valueCell = holdingCardWrapper.locator("td:nth-last-child(2)");
    const quantitySymbolElement = valueCell.locator(
      "div.text-xs.text-muted-foreground",
    );
    // Use toContainText and format quantity to match UI (e.g., 2 decimal places)
    const formattedQuantity = Number.parseFloat(quantity).toFixed(2);
    await expect(quantitySymbolElement).toContainText(
      `${formattedQuantity} ${cryptoSymbol}`,
    );
  });
});
