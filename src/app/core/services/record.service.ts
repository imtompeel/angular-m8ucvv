import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  public genres: string[] = [
    'Poetry',
    'Spoken Word',
    'Prose',
    'Short Story'
  ]

  constructor(
    private db: AngularFireDatabase,
  ) {
  }

  /**
   * Load all Artsits 
   */
  public loadArtists(cityId?: string) {
    if (cityId) {
      return this.db.list(`/artists`, ref => ref.orderByChild('city').equalTo(cityId))
    } else {
      return this.db.list(`/artists`);
    }
  }

  /**
   * Load all Songs
   */
  public loadSongs() {
    return this.db.list(`/recordings`);
  }

  /**
   * Load a song information by song id
   * 
   * @param {string} songId song identifier name
   */
  public loadSong(songId: string) {
    return this.db.object(`/recordings/${songId}`);
  }

  public searchSongForVenue(venueId: string) {
    return this.db.list(`/recordings`, ref =>
      venueId ? ref.orderByChild('venues').equalTo(venueId) : ref
    )
  }

  /**
   * Create song object
   * 
   * @param data Song data
   * @param songId unique song id or null, if it is null will generate auto key
   */
  public createSong(data: any, songId: string = null): string {
    if (songId === null) {
      return this.db.list(`/recordings`).push(data).key;
    } else {
      this.db.object(`/recordings/${songId}`).set(data);
      return songId;
    }
  }

  /**
   * Update song values
   * 
   * @param data Updated values
   * @param songId Song id for updating
   */
  public updateSong(data: any, songId: string) {
    this.db.object(`/recordings/${songId}`).update(data);
  }

  /**
   * Update artist id for song 
   * 
   * @param songId song id
   * @param artistId new artist id
   */
  public updateArtistIdForSong(songId: string, artistId: string) {
    this.updateSong({ artist: artistId }, songId);
  }

  /**
   * Create artist object
   * 
   * @param data Artist data
   * @param artistId unique artist id or null, if it is null will generate auto key
   */
  public createArtist(data: any, artistId: string = null) {
    if (artistId === null) {
      return this.db.list(`/artists`).push(data).key;
    } else {
      this.db.object(`/artists/${artistId}`).set(data);
      return artistId;
    }
  }

  /**
   * Update artist values
   * 
   * @param data Updated values
   * @param artistId Artist id for updating
   */
  public updateArtist(data: any, artistId: string) {
    this.db.object(`/artists/${artistId}`).update(data);
  }

  public deleteArtist(artist: any) {
    var deletes = {};
    deletes[`/artists/${artist.key}`] = null;
    deletes[`/recordings/${artist.recordings[0]}`] = null;
    return this.db.object('/').update(deletes);
  }

}
