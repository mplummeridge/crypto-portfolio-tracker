import AddHoldingButton from "@/components/add-holding-button";
import CryptoCard from "@/components/crypto-card";
import HoldingForm from "@/components/holding-form";
import PriceChart from "@/components/price-chart";
import type { OHLCData } from "@/lib/types/chart";
import type { CryptoHolding } from "@/types/holding";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Define ExtendedCryptoHolding locally for test
interface ExtendedCryptoHolding extends CryptoHolding {
  changePct24h?: number;
  image?: string;
  changeAbs24h?: number;
  high24h?: number;
  low24h?: number;
  marketCap?: number;
  volume24h?: number;
}

// Mock the hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/store", () => ({
  usePortfolioStore: () => ({
    holdings: [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        quantity: 2.5,
        currentPrice: 50000,
      },
    ],
    availableCryptos: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", currentPrice: 50000 },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", currentPrice: 3000 },
    ],
    removeHolding: jest.fn(),
    addHolding: jest.fn(),
    updateHolding: jest.fn(),
    fetchAvailableCryptos: jest.fn(),
    fetchPrices: jest.fn(),
    loading: false,
  }),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock Recharts components
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    ComposedChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="composed-chart">{children}</div>
    ),
    Line: () => <div data-testid="line" />,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Brush: () => <div data-testid="brush" />,
    Scatter: () => <div data-testid="scatter" />,
    Cell: () => <div data-testid="cell" />,
    ReferenceArea: () => <div data-testid="reference-area" />,
  };
});

expect.extend(toHaveNoViolations);

describe("Accessibility Tests", () => {
  it("CryptoCard has no accessibility violations", async () => {
    const mockHolding: ExtendedCryptoHolding = {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      quantity: 2.5,
      currentPrice: 50000,
      purchasePrice: 45000,
      changePct24h: 1.5,
      image: "/mock-image.png",
    };

    const { container } = render(<CryptoCard holding={mockHolding} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("HoldingForm has no accessibility violations", async () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <HoldingForm />
      </QueryClientProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("PriceChart has no accessibility violations", async () => {
    const mockData: OHLCData[] = [
      {
        timestamp: new Date("2023-01-01T00:00:00Z").getTime(),
        open: 49500,
        high: 50500,
        low: 49000,
        close: 50000,
      },
      {
        timestamp: new Date("2023-01-02T00:00:00Z").getTime(),
        open: 50000,
        high: 51500,
        low: 49800,
        close: 51000,
      },
    ];

    const { container } = render(
      <PriceChart
        data={mockData}
        type="line"
        loading={false}
        enableZoom={false}
        symbol="BTC"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("AddHoldingButton has no accessibility violations", async () => {
    const { container } = render(<AddHoldingButton onClick={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
