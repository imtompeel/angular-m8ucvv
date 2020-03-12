/**
 * User role
 *
 * @enum {string}
 */
export enum UserRole {
  COMPANY_OWNER = 'company-owner',
  COMPANY_STAFF = 'company-staff',
  CUSTOMER = 'customer',
  SUPER_ADMIN = 'super-admin'
}

/**
 * User auth type
 *
 * @enum {string}
 */
export enum UserAuthType {
  EMAIL = 'email',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  GOOGLE = 'google',
  PHONE = 'phone'
}

/**
 * User status
 *
 * @enum {number}
 */
export enum UserStatus {
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
  ONBOARDING = 'onboarding'
}

/**
 * User base
 *
 * @export
 * @interface IUserBase
 */
export interface IUserBase {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

/**
 * User response
 *
 * @export
 * @interface IUserResponse
 */
export interface IUserResponse {
  success: boolean;
  message?: string;
  user: IUserBase;
}

/**
 * Users response
 *
 * @export
 * @interface IUsersResponse
 */
export interface IUsersResponse {
  success: boolean;
  message?: string;
  users: Array<IUserBase>;
}

/**
 * User search request
 *
 * @export
 * @interface IUserSearchRequest
 */
export interface IUserSearchRequest {
  email?: string;
}
