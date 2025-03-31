import { DataCard } from "@/components/ui/data-card";

interface AboutAssetProps {
  descriptionHtml: string | undefined;
  assetName: string;
}

/**
 * Server Component: Displays the asset description summary.
 */
export function AboutAsset({ descriptionHtml, assetName }: AboutAssetProps) {
  if (!descriptionHtml) {
    return null;
  }

  return (
    <DataCard
      title={`About ${assetName}`}
      contentClassName="p-4 pt-0 pb-6 max-h-72 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
    >
      <div
        className="prose prose-sm dark:prose-invert max-w-none [&_p:last-child]:mb-0 pt-2"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </DataCard>
  );
}
