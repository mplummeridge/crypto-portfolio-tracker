import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type React from "react";

interface DataCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  isLoading?: boolean;
  loadingHeight?: string;
  children: React.ReactNode;
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  isAccordionTrigger?: boolean;
}

export function DataCard({
  title,
  description,
  headerContent,
  footerContent,
  isLoading = false,
  loadingHeight = "h-32",
  children,
  cardClassName,
  headerClassName,
  contentClassName,
  footerClassName,
  isAccordionTrigger = false,
  ...props
}: DataCardProps) {
  const hasHeader = title || description || headerContent;
  const hasFooter = !!footerContent;

  const HeaderComponent = isAccordionTrigger ? "div" : CardHeader;
  const TitleComponent = isAccordionTrigger ? "div" : CardTitle;
  const DescriptionComponent = isAccordionTrigger ? "div" : CardDescription;

  return (
    <Card
      className={cn(
        "bg-background shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
        cardClassName,
      )}
      {...props}
    >
      {hasHeader && (
        <HeaderComponent
          className={cn("p-4", { "p-0": isAccordionTrigger }, headerClassName)}
        >
          <div className="flex-grow">
            {title && (
              <TitleComponent
                className={cn("text-base font-semibold", {
                  "group-hover:underline": isAccordionTrigger,
                })}
              >
                {title}
              </TitleComponent>
            )}
            {description && (
              <DescriptionComponent className="text-xs mt-1">
                {description}
              </DescriptionComponent>
            )}
          </div>
          {headerContent}
          {isAccordionTrigger && (
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground group-data-[state=open]:rotate-180 ml-auto" />
          )}
        </HeaderComponent>
      )}

      <CardContent
        className={cn(
          "p-4",
          { "pt-4": !hasHeader, "pt-0": hasHeader && !isAccordionTrigger },
          contentClassName,
        )}
      >
        {isLoading ? (
          <Skeleton className={cn("w-full rounded", loadingHeight)} />
        ) : (
          children
        )}
      </CardContent>

      {hasFooter && (
        <CardFooter
          className={cn(
            "p-4 border-t border-gray-100 dark:border-gray-800",
            footerClassName,
          )}
        >
          {isLoading ? (
            <Skeleton className={cn("w-1/2 h-6", loadingHeight)} />
          ) : (
            footerContent
          )}
        </CardFooter>
      )}
    </Card>
  );
}
