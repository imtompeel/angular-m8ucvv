/**
 * Base class interface
 *
 * @export
 * @interface ICityBase
 */
export interface ICityBase {
  name?: string;
}

/**
 * Class response interface
 *
 * @export
 * @interface ICityResponse
 */
export interface ICityResponse {
  success: boolean;
  message?: string;
  class: ICityBase;
}

/**
 * Classes response interface
 *
 * @export
 * @interface ICitiesResponse
 */
export interface ICitiesResponse {
  success: boolean;
  message?: string;
  classes: Array<ICityBase>;
}

/**
 * Class search request interface
 *
 * @export
 * @interface ICitySearchRequest
 */
export interface ICitySearchRequest {
  name?: string;
}

/**
 * Class create request interface
 *
 * @export
 * @interface ICityCreateRequest
 */
export interface ICityCreateRequest {
  name: string;
}
