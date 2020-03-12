/**
 * Base class interface
 *
 * @export
 * @interface IArtistBase
 */
export interface IArtistBase {
  key: string;
  description?: string;
  genre?: Array<string>;
  imagebig?: string;
  imagesmall?: string;
  name: string;
  recordings: Array<string>;
  website?: string;
}

/**
 * Artist response interface
 *
 * @export
 * @interface IArtistResponse
 */
export interface IArtistResponse {
  success: boolean;
  message?: string;
  class: IArtistBase;
}

/**
 * Artists response interface
 *
 * @export
 * @interface IArtistsResponse
 */
export interface IArtistsResponse {
  success: boolean;
  message?: string;
  classes: Array<IArtistBase>;
}

/**
 * Artist search request interface
 *
 * @export
 * @interface IArtistSearchRequest
 */
export interface IArtistSearchRequest {
  artistKey?: string;
  name?: string;
}

/**
 * Artist create request interface
 *
 * @export
 * @interface IArtistCreateRequest
 */
export interface IArtistCreateRequest {
  description?: string;
  genre?: Array<string>;
  imagebig?: string;
  imagesmall?: string;
  name: string;
  recordings: Array<string>;
  website?: string;
}

/**
 * Artist update request interface
 *
 * @export
 * @interface IArtistUpdateRequest
 */
export interface IArtistUpdateRequest {
  key: string;
  description?: string;
  genre?: Array<string>;
  imagebig?: string;
  imagesmall?: string;
  name: string;
  recordings: Array<string>;
  website?: string;
}
