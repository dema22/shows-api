import { Request, Response } from "express";

export async function getTvShowDetailsHandler(
    req: Request,
    res: Response
  ) {
    try {
      console.log("Get tv show deatils handler");
      return res.send("Get tv show deatils handler");
    } catch (e: any) {
      console.error(e);
      return res.status(404).send(e.message);
    }
  }
  