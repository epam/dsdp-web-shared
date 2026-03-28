export const emailBlacklistValidator = (email: string, emailBlacklist: string[]): boolean => {
  const emailHost = email.split('@')[1];
  return emailBlacklist.includes(emailHost);
};
