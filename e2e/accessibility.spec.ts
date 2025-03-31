import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test("Home page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Add holding page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/add");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Details page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    // First add a holding
    await page.goto("/");
    await page.getByRole("button", { name: "Add New Holding" }).click();
    await page.getByRole("combobox").click();
    await page.getByText("Bitcoin (BTC)").click();
    await page.getByLabel("Quantity").fill("2.5");
    await page.getByRole("button", { name: "Add Holding" }).click();

    // Open the dropdown menu
    await page.getByRole("button", { name: "Open menu" }).click();

    // Click View Details
    await page.getByText("View Details").click();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Edit holding page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    // First add a holding
    await page.goto("/");
    await page.getByRole("button", { name: "Add New Holding" }).click();
    await page.getByRole("combobox").click();
    await page.getByText("Bitcoin (BTC)").click();
    await page.getByLabel("Quantity").fill("2.5");
    await page.getByRole("button", { name: "Add Holding" }).click();

    // Open the dropdown menu
    await page.getByRole("button", { name: "Open menu" }).click();

    // Click Edit
    await page.getByText("Edit").click();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Keyboard navigation works correctly", async ({ page }) => {
    await page.goto("/");

    // Add a holding using keyboard navigation
    await page.keyboard.press("Tab"); // Focus on Add New Holding button
    await page.keyboard.press("Enter");

    // Verify we're on the add page
    await expect(page).toHaveURL(/\/add/);

    // Tab to the cryptocurrency dropdown
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter"); // Select first option (Bitcoin)

    // Tab to quantity input
    await page.keyboard.press("Tab");
    await page.keyboard.type("2.5");

    // Tab to Add Holding button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // Skip Cancel button
    await page.keyboard.press("Enter");

    // Verify we're back on the portfolio page
    await expect(page).toHaveURL("/");

    // Verify the holding is added
    await expect(page.getByText("Bitcoin (BTC)")).toBeVisible();
  });
});
