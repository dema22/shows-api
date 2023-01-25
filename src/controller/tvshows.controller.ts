import { Request, Response } from "express";
import { findTvShowsByName } from "../service/tvshows.service";

export async function getTvShowsByNameHandler(req: Request, res: Response) {
  try {
    // Access name from query parameters.
    let tvshowName = req.query.tvShowName;

    // Get results that match the name.
    const tvShowsList = await findTvShowsByName(tvshowName);
    
    if (!tvShowsList.length) {
      return res.status(404).send({message: "There are no tv shows that match your search"});
    }

    return res.send(tvShowsList);
  } catch (e: any) {
    console.log(e);
    return res.status(404).send({message: e.message});
  }
}
