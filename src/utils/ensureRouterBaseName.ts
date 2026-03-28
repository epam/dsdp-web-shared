if (!window.location.pathname.includes(import.meta.env.BASE_URL)) {
  window.history.replaceState(
    '',
    '',
    import.meta.env.BASE_URL + window.location.pathname,
  );
}
