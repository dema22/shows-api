import TvShowModel, { TvShowDocument } from "../models/tvshow.models";

// Will return a list of results of basic tv show information that starts with the name of the show.
// We will return the first 5 results that match the name.
export async function findTvShowsByName(tvshowName: any) : Promise<TvShowDocument[]> {
  try {
    /*
      MongoDB tiene una forma de hacer regex en las queries y con eso te ahorras tener que hacerlo a mano
      https://www.mongodb.com/docs/manual/reference/operator/query/regex/
      
      Y aunque esta bien dejar el limite fijo en 5 podes hacer que sea un param y que tenga como default 5 asi
      podes reutilizar el endpoint o la funcion en algun otro lado. Para poner el default en el param es asi:
      function findTvShowsByName(tvshowName: any, limit?: number = 5)
    */
    const regexp = new RegExp("^"+ tvshowName);
    let tvShowsResult : TvShowDocument[]  = await TvShowModel.find({original_name: regexp}).limit(5);
    return tvShowsResult;
  } catch (e: any) {
    /*
      Aca lo que podes hacer es un catch global para todos los errores y podes estandarizar una respuesta,

    */
    throw new Error(e);
  }
}
