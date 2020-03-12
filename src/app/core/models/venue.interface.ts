/**
 * Base class interface
 *
 * @export
 * @interface IVenueBase
 */
export interface IVenueBase {
  key: string;
  address?: string;
  city: string;
  description?: string;
  imagebig?: string;
  imagesmall?: string;
  lat: number;
  long: number;
  name: string;
  recordings: Array<string>;
  website?: string;
}

/**
 * Venue response interface
 *
 * @export
 * @interface IVenueResponse
 */
export interface IVenueResponse {
  success: boolean;
  message?: string;
  class: IVenueBase;
}

/**
 * Venues response interface
 *
 * @export
 * @interface IVenuesResponse
 */
export interface IVenuesResponse {
  success: boolean;
  message?: string;
  classes: Array<IVenueBase>;
}

/**
 * Venue search request interface
 *
 * @export
 * @interface IVenueSearchRequest
 */
export interface IVenueSearchRequest {
  venueKey?: string;
  name?: string;
  address?: string;
}

/**
 * Venue create request interface
 *
 * @export
 * @interface IVenueCreateRequest
 */
export interface IVenueCreateRequest {
  address?: string;
  city: string;
  description?: string;
  imagebig?: string;
  imagesmall?: string;
  lat: number;
  long: number;
  name: string;
  recordings: Array<string>;
  website?: string;
}

/**
 * Venue update request interface
 *
 * @export
 * @interface IVenueUpdateRequest
 */
export interface IVenueUpdateRequest {
  key: string;
  address?: string;
  city: string;
  description?: string;
  imagebig?: string;
  imagesmall?: string;
  lat: number;
  long: number;
  name: string;
  recordings: Array<string>;
  website?: string;
}
