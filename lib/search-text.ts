// Söktexten i ett API-anrop är några ord; längre text kapas så att ingen skickar en jättelång (TECH-026-R2)
export const MAX_SEARCH_LENGTH = 100;

export const searchText = (params: URLSearchParams) => params.get("q")?.trim().slice(0, MAX_SEARCH_LENGTH) ?? "";
