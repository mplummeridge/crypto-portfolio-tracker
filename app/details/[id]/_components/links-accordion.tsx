import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { cn } from "@/lib/utils";
import type { ExtendedCryptoDetails } from "@/types/crypto";
import {
  ExternalLink,
  Facebook,
  FileText,
  Github,
  Globe,
  Link2,
  Linkedin,
  MessageSquare,
  Search,
  Send,
  Twitter,
} from "lucide-react";
import React from "react";

interface LinksAccordionProps {
  details: ExtendedCryptoDetails;
  coinId: string;
}

// --- Helper Functions ---

const formatDocumentType = (type: string | undefined | null): string => {
  if (!type) return "Document";
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const filterValidUrls = (urls: string[] | undefined): string[] => {
  return urls?.filter((url): url is string => !!url?.trim()) || [];
};

const filterValidSocials = (
  socials: Array<{ NAME: string; URL: string }> | undefined,
): Array<{ NAME: string; URL: string }> => {
  return (
    socials?.filter(
      (social): social is { NAME: string; URL: string } =>
        !!social?.URL?.trim(),
    ) || []
  );
};

const filterValidDocs = (
  docs: Array<{ TYPE: string; URL: string }> | undefined,
): Array<{ TYPE: string; URL: string }> => {
  return (
    docs?.filter(
      (doc): doc is { TYPE: string; URL: string } => !!doc?.URL?.trim(),
    ) || []
  );
};

const getSocialIcon = (name: string): React.ElementType => {
  const upperName = name?.toUpperCase();
  switch (upperName) {
    case "TWITTER":
      return Twitter;
    case "FACEBOOK":
      return Facebook;
    case "LINKEDIN":
      return Linkedin;
    case "REDDIT":
      return ExternalLink;
    case "TELEGRAM":
      return Send;
    default:
      return ExternalLink;
  }
};

const LinkButton: React.FC<{
  url?: string;
  label: string;
  icon?: React.ElementType;
}> = ({ url, label, icon: Icon = ExternalLink }) => {
  if (!url || !label) return null;
  const displayLabel =
    label.startsWith("http") && label.length > 30
      ? `${label.substring(0, 27)}...`
      : label;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "flex items-center justify-start text-left gap-2 w-full",
      )}
      title={label}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{displayLabel}</span>
    </a>
  );
};

const DocButton: React.FC<{ url?: string; title: string }> = ({
  url,
  title,
}) => {
  if (!url || !title) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "flex items-center justify-start text-left gap-2 w-full",
      )}
      title={title}
    >
      <FileText className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{title}</span>
    </a>
  );
};

const LinkSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const hasContent = React.Children.toArray(children).some(
    (child) => child !== null && child !== undefined,
  );
  if (!hasContent) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{children}</div>
    </div>
  );
};

/**
 * Server Component: Renders official links and documents within an accordion inside a DataCard.
 */
export function LinksAccordion({ details, coinId }: LinksAccordionProps) {
  const {
    links,
    ASSET_ALTERNATIVE_IDS,
    OTHER_SOCIAL_NETWORKS,
    WHITE_PAPER_URL,
    OTHER_DOCUMENT_URLS,
    CODE_REPOSITORIES,
  } = details;

  const officialLinks = {
    websites: filterValidUrls(links?.homepage),
    forum: filterValidUrls(links?.official_forum_url)?.[0],
  };

  const cgId = ASSET_ALTERNATIVE_IDS?.find((id) => id.NAME === "CG")?.ID;
  const cmcId = ASSET_ALTERNATIVE_IDS?.find((id) => id.NAME === "CMC")?.ID;
  const platforms = {
    coingecko: cgId
      ? `https://www.coingecko.com/en/coins/${cgId}`
      : `https://www.coingecko.com/en/coins/${coinId}`,
    coinmarketcap: cmcId
      ? `https://coinmarketcap.com/currencies/${cmcId}`
      : undefined,
  };

  const githubRepos = (CODE_REPOSITORIES ?? [])
    .filter((repo) => repo.URL?.includes("github.com"))
    .map((repo) => repo.URL);
  if (githubRepos.length === 0 && links?.repos_url?.github) {
    githubRepos.push(...filterValidUrls(links.repos_url.github));
  }

  const twitterUrl = links?.twitter_screen_name
    ? `https://twitter.com/${links.twitter_screen_name}`
    : undefined;
  const redditUrl = links?.subreddit_url;
  const otherSocials = filterValidSocials(OTHER_SOCIAL_NETWORKS);

  const whitepaperUrl = WHITE_PAPER_URL?.trim() ? WHITE_PAPER_URL : undefined;
  const otherDocs = filterValidDocs(OTHER_DOCUMENT_URLS);

  const typeCounts: { [key: string]: number } = {};
  const typeTotals: { [key: string]: number } = {};
  for (const doc of otherDocs) {
    const formattedType = formatDocumentType(doc.TYPE);
    typeTotals[formattedType] = (typeTotals[formattedType] || 0) + 1;
  }
  const processedDocs = otherDocs.map((doc) => {
    const formattedType = formatDocumentType(doc.TYPE);
    typeCounts[formattedType] = (typeCounts[formattedType] || 0) + 1;
    const displayTitle =
      typeTotals[formattedType] > 1
        ? `${formattedType} ${typeCounts[formattedType]}`
        : formattedType;
    return { url: doc.URL, title: displayTitle };
  });

  const hasContent = !!(
    officialLinks.websites.length > 0 ||
    officialLinks.forum ||
    platforms.coingecko ||
    platforms.coinmarketcap ||
    githubRepos.length > 0 ||
    twitterUrl ||
    redditUrl ||
    otherSocials.length > 0 ||
    whitepaperUrl ||
    processedDocs.length > 0
  );

  if (!hasContent) {
    return null;
  }

  const cardTitle = (
    <div className="flex items-center gap-2">
      <Link2 className="h-4 w-4" />
      Resources & Links
    </div>
  );

  return (
    <DataCard contentClassName="p-0" cardClassName="overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="links" className="border-b-0">
          <AccordionTrigger className="hover:no-underline p-4 group">
            <div className="flex items-center gap-2 flex-grow">{cardTitle}</div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-4 px-4">
            <div className="space-y-4 pt-3">
              <LinkSection title="Official">
                {officialLinks.websites.map((url, index) => (
                  <LinkButton
                    key={url}
                    url={url}
                    label={
                      officialLinks.websites.length > 1
                        ? `Website ${index + 1}`
                        : "Website"
                    }
                    icon={Globe}
                  />
                ))}
                <LinkButton
                  url={officialLinks.forum}
                  label="Forum"
                  icon={MessageSquare}
                />
              </LinkSection>

              <LinkSection title="Platforms">
                <LinkButton
                  url={platforms.coingecko}
                  label="View on CoinGecko"
                />
                <LinkButton
                  url={platforms.coinmarketcap}
                  label="View on CoinMarketCap"
                />
              </LinkSection>

              <LinkSection title="Social & Community">
                <LinkButton url={twitterUrl} label="Twitter" icon={Twitter} />
                <LinkButton
                  url={redditUrl}
                  label="Reddit"
                  icon={ExternalLink}
                />
                {otherSocials.map((social) => (
                  <LinkButton
                    key={social.URL}
                    url={social.URL}
                    label={formatDocumentType(social.NAME)}
                    icon={getSocialIcon(social.NAME)}
                  />
                ))}
              </LinkSection>

              <LinkSection title="Repositories">
                {githubRepos.map((url, index) => (
                  <LinkButton
                    key={url}
                    url={url}
                    label={
                      githubRepos.length > 1 ? `GitHub ${index + 1}` : "GitHub"
                    }
                    icon={Github}
                  />
                ))}
              </LinkSection>

              <LinkSection title="Documents">
                <DocButton url={whitepaperUrl} title="Whitepaper" />
                {processedDocs.map((doc) => (
                  <DocButton key={doc.url} url={doc.url} title={doc.title} />
                ))}
              </LinkSection>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DataCard>
  );
}
