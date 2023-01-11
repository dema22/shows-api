import axios, { AxiosResponse } from "axios";
import { TvShowDetails } from "../models/tvshowDetails.models";
import { TvShowsDetailsFromAPI } from "../models/tvshowDetailsFromApi.models";

export async function getTvShowDetails(tvShowId :string) {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/" + tvShowId + "?api_key=e5fa1b7231771db70b84a998344fe4e3&language=en-US&append_to_response=videos,images&include_image_language=en,null"
    );
    //console.log(response.data);
    const responseTvShow: TvShowDetails = buildTvShowDetailsResponse(
      response.data
    );
    return responseTvShow;
  } catch (error) {
    console.log(error);
  }
}

function buildTvShowDetailsResponse(tvshow: TvShowsDetailsFromAPI) {
  const customTvShow: TvShowDetails = {
    backdropPath: tvshow.backdrop_path,
    episodeRunTime: tvshow.episode_run_time,
    genres: [],
    name: tvshow.name,
    numberOfEpisodes: tvshow.number_of_episodes,
    numberOfSeasons: tvshow.number_of_seasons,
    originalLanguage: tvshow.original_language,
    overview: tvshow.overview,
    posterPath: tvshow.poster_path,
    status: tvshow.status,
    tagline: tvshow.tagline,
    type: tvshow.type,
    trailersURL: [],
  };
  populateGenres(customTvShow, tvshow);
  buildCompleImageURL(customTvShow, tvshow);
  buildTrailers(customTvShow,tvshow);
  return customTvShow;
}

// We are going to store the genres we get from the api into our custom response.
function populateGenres(
  customTvShow: TvShowDetails,
  tvShow: TvShowsDetailsFromAPI
) {
  tvShow.genres.forEach((genre) => {
    customTvShow.genres.push(genre.name);
  });
}

function buildCompleImageURL(
  customTvShow: TvShowDetails,
  tvShow: TvShowsDetailsFromAPI
) {
  const baseImageURL: string = "https://image.tmdb.org/t/p/original";
  if (tvShow.backdrop_path !== null) {
    customTvShow.backdropPath = baseImageURL + tvShow.backdrop_path;
  }
  if (tvShow.poster_path !== null) {
    customTvShow.posterPath = baseImageURL + tvShow.poster_path;
  }
}

// We are going to filter all the videos that are trailers and build their complete url to that video.
function buildTrailers(
  customTvShow: TvShowDetails,
  tvShow: TvShowsDetailsFromAPI
) {
  const youtubeBaseURL: string = "https://www.youtube.com/watch?v=";
  const vimeoBaseURL: string = "https://vimeo.com/";
  let trailersURL : string [] = [];
  let completeURL: string;

  tvShow.videos.results.forEach((video) => {
    if (video.site === "YouTube" && video.type === "Trailer") {
      completeURL = youtubeBaseURL + video.key;
	  completeURL = completeURL.replace("watch?v=", "embed/");
      trailersURL.push(completeURL);
    }

    if (video.site === "Vimeo" && video.type === "Trailer") {
      completeURL = vimeoBaseURL + video.key;
      trailersURL.push(completeURL);
    }
  });
  customTvShow.trailersURL = trailersURL;
}
