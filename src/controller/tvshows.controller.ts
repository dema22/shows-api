import { Request, Response } from "express";
import { findTvShowsByName } from "../service/tvshows.service";

export async function getTvShowsByNameHandler(req: Request, res: Response) {
  try {
    
    // Todo esto deberia hacerlo el service, el controller lo dejaba para chequeos de permisos de usuarios
    // y poco mas
    
    // Access name from query parameters.
    let tvshowName = req.query.tvShowName;

    // Get results that match the name.
    const tvShowsList = await findTvShowsByName(tvshowName);
    
    if (!tvShowsList.length) {
      return res.status(204).send({message: "There are no tv shows that match your search"});
    }

    return res.send(tvShowsList);
  } catch (e: any) {

    // Sacar console.log
    console.log(e);
    /*
      Esto lo podes hacer en un middleware global en el que parses la response en base a lo que devuelve el endpoint,
      no es super importante pero no esta de mas saberlo
      https://website-development.ch/blog/node-js-express-global-error-handler
      https://www.youtube.com/watch?v=foB-h3q5PnI
    */
    return res.status(404).send({message: e.message});
  }
}
