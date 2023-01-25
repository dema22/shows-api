import { Request, Response } from "express";
import { getTvShowDetails } from "../service/tvshowDetails.service";

export async function getTvShowDetailsHandler(req: Request, res: Response) {
  try {
    const tvShowId: string = req.params.id;

    // Get tv show details based on id.
    const tvshow = await getTvShowDetails(tvShowId);

    return res.send(tvshow);
  } catch (e: any) {
    console.error(e);
    return res.status(404).send({ message: e.message });
  }
}
