import { IUserBase } from '@app/core/models/user.interface';

/**
 * Auth
 *
 * @export
 * @interface Auth
 */
export interface AuthRequest {
  email: string;
  password: string;
  auth_type: string;
}

/**
 * AuthResponse
 *
 * @export
 * @interface AuthResponse
 */
export interface AuthResponse {
  user: IUserBase;
  success: boolean;
}
