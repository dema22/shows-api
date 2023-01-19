import TvShowModel, { TvShowDocument } from "../models/tvshow.models";

// Will return a list of results of basic tv show information that starts with the name of the show.
// We will return the first 5 results that match the name.
export async function findTvShowsByName(tvshowName: any) : Promise<TvShowDocument[]> {
  try {

    const regexp = new RegExp("^"+ tvshowName);
    let tvShowsResult  = await TvShowModel.find({original_name: regexp}).limit(5);
    return tvShowsResult;
  } catch (e: any) {
    throw new Error(e);
  }
}
