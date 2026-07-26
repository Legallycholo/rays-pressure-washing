/** Small helpers shared by the service × city matrix pages. */
import { services, getService, serviceSlugs, type Service } from "./services";
import type { Location } from "./locations";

export { getService, serviceSlugs };

/** Sibling services to cross-link on a matrix page: the city's other top
 *  services first, padded from the full catalogue, excluding the current one. */
export function getServicesForCityPage(loc: Location, excludeSlug: string): Service[] {
  const top = loc.topServices
    .filter((s) => s !== excludeSlug)
    .map(getService)
    .filter((s): s is Service => Boolean(s));
  const pad = services.filter(
    (s) => s.segment === "residential" && s.slug !== excludeSlug && !loc.topServices.includes(s.slug),
  );
  return [...top, ...pad].slice(0, 3);
}
