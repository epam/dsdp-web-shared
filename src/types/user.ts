export interface CurrentUser {
  sub: string,
  email_verified: boolean,
  name: string,
  preferred_username: string,
  given_name: string,
  family_name: string,
  email: string,
  roles: string[],
  drfo?: string,
  edrpou?: string,
  fullName?: string,
}

export interface LoginOptions {
  redirectUri?: string,
}
