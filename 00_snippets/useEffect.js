// =========================================================================
// op wijzigingen in de state mooi zichtbaar te krijgen
// daarmee krijg je een console.log elke keer als de state aangepast wordt.
// =========================================================================

useEffect(() => {
    console.log("state activeFilters is changed:", activeFilters)
  });