/**
 * Base class interface
 *
 * @export
 * @interface ISongBase
 */
export interface ISongBase {
  key: string;
  artistKey?: string;
  genre: Array<string>;
  hapticPath?: string;
  path?: string;
  title?: string;
  venues: any;
}

/**
 * Song response interface
 *
 * @export
 * @interface ISongResponse
 */
export interface ISongResponse {
  success: boolean;
  message?: string;
  class: ISongBase;
}

/**
 * Songs response interface
 *
 * @export
 * @interface ISongsResponse
 */
export interface ISongsResponse {
  success: boolean;
  message?: string;
  classes: Array<ISongBase>;
}

/**
 * Song search request interface
 *
 * @export
 * @interface ISongSearchRequest
 */
export interface ISongSearchRequest {
  songKey?: string;
  title?: string;
}

/**
 * Song create request interface
 *
 * @export
 * @interface ISongCreateRequest
 */
export interface ISongCreateRequest {
  artistKey?: string;
  genre: Array<string>;
  hapticPath?: string;
  path?: string;
  title?: string;
  venues: any;
}

/**
 * Song update request interface
 *
 * @export
 * @interface ISongUpdateRequest
 */
export interface ISongUpdateRequest {
  key: string;
  artistKey?: string;
  genre: Array<string>;
  hapticPath?: string;
  path?: string;
  title?: string;
  venues: any;
}
