"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DataCard } from "@/components/ui/data-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, Network } from "lucide-react";
import Link from "next/link";

interface PlatformDetails {
  BLOCKCHAIN: string;
  EXPLORER_URL?: string | null;
  TOKEN_STANDARD?: string | null;
  SMART_CONTRACT_ADDRESS?: string | null;
}

interface AvailableNetworksProps {
  platforms: PlatformDetails[];
}

/**
 * Server Component: Displays the list of networks/platforms the asset is available on
 * within a collapsible Accordion.
 */
export function AvailableNetworks({ platforms }: AvailableNetworksProps) {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  const cardTitle = (
    <div className="flex items-center gap-2">
      <Network className="h-4 w-4" />
      Available Networks
    </div>
  );

  return (
    <DataCard contentClassName="p-0" cardClassName="overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="networks" className="border-b-0">
          <AccordionTrigger className="hover:no-underline p-4 group">
            <div className="flex items-center gap-2 flex-grow">{cardTitle}</div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-4 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3">
              {platforms.map((platform, index) => (
                <TooltipProvider
                  key={`platform-${platform.BLOCKCHAIN}-${index}`}
                  delayDuration={200}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={platform.EXPLORER_URL || "#"}
                        target={platform.EXPLORER_URL ? "_blank" : undefined}
                        rel={
                          platform.EXPLORER_URL
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={`flex items-center gap-2 p-2 border rounded-md text-sm truncate ${platform.EXPLORER_URL ? "hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors" : "opacity-60 cursor-default"}`}
                        onClick={(e) =>
                          !platform.EXPLORER_URL && e.preventDefault()
                        }
                        aria-label={`View on ${platform.BLOCKCHAIN} ${platform.EXPLORER_URL ? "Explorer" : "(no link)"}`}
                      >
                        <span className="h-4 w-4 bg-muted rounded-full flex-shrink-0" />
                        <span className="truncate font-medium">
                          {platform.BLOCKCHAIN}
                        </span>
                        {platform.TOKEN_STANDARD && (
                          <Badge
                            variant="outline"
                            className="ml-auto text-xs px-1.5 py-0.5 flex-shrink-0"
                          >
                            {platform.TOKEN_STANDARD}
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                      {platform.EXPLORER_URL ? (
                        <p>View on {platform.BLOCKCHAIN} Explorer</p>
                      ) : (
                        <p>{platform.BLOCKCHAIN} (No explorer link provided)</p>
                      )}
                      {platform.SMART_CONTRACT_ADDRESS && (
                        <p className="text-xs text-muted-foreground break-all mt-1">
                          Contract: {platform.SMART_CONTRACT_ADDRESS}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DataCard>
  );
}
