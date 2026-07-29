import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Built on native <details>/<summary>: keyboard accessible, screen-reader
 * correct, and works with JavaScript disabled, no client component, no state,
 * no hydration cost. `name` groups items so only one opens at a time.
 */
export function Accordion({
  items,
  className,
  singleOpen = false,
  groupName = "faq",
}: {
  items: { id: string; question: string; answer: string }[];
  className?: string;
  singleOpen?: boolean;
  groupName?: string;
}) {
  return (
    <div className={cn("divide-y divide-ink-100 overflow-hidden rounded-card bg-white ring-1 ring-ink-900/5", className)}>
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          name={singleOpen ? groupName : undefined}
          className="group"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-semibold text-ink-900 transition-colors hover:bg-sand-50 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <Icon
              name="chevron"
              className="h-5 w-5 shrink-0 text-harbor-600 transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="px-5 pb-5 -mt-1">
            <p className="leading-relaxed text-ink-500">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
