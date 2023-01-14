import { Request, Response } from "express";
import { TvShowDocument } from "../models/tvshow.models";
import { findTvShowsByName } from "../service/tvshows.service";

export async function getTvShowsByNameHandler(req: Request, res: Response) {
  try {
    // Access name from query parameters.
    let tvshowName = req.query.tvShowName;

    // Get paginated results that match the name.
    const tvShowsList = await findTvShowsByName(tvshowName);

    if (!tvShowsList.length > 0) {
      return res.status(404).send({message: "There are no tv shows that match your search"});
    }

    return res.send(tvShowsList);
  } catch (e: any) {
    e;
    console.log(e);
    return res.status(4040).send(e.message);
  }
}
