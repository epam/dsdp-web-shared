export type FormFunctionsEvalContext = {
  getUserLanguage: () => string,
  getRegistryLanguage: () => string,
  getRegistrySupportedLanguages: () => string[],
};
