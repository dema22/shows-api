import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { TvShowDetails } from "../models/tvshowDetails.models";
import TvShowReminderModel, {
  TvShowReminderDocument,
  TvShowReminderInput,
  TvShowReminderRes,
} from "../models/tvshowReminder.model";
import { getTvShowDetails } from "./tvshowDetails.service";

export async function createTvShowReminder(
  userId: string,
  inputReminder: TvShowReminderInput
) {
  try {

    // te falta checkear que el tvShow exista

    // First we check if there is not a reminder already created for the tv show
    /*
      Esto esta bien pero solo para que sepas que en caso de que tengas uno o mas campos como unique
      e intentes crear un elemento que tenga alguno de los campos la query te tira un error con un codigo especifico
      y en el catch podes usar eso para saber si el error se dio por ya existia un elemento con esos valores 
      y tirar un error custom
    */
    await checkTvShowReminderExistence(userId, inputReminder);

    // Save the reminder information in the DB.
    const tvShowReminder = await TvShowReminderModel.create({
      ...inputReminder,
      user: userId,
    });

    // Get the details of tv show.
    const tvShowDetails: TvShowDetails | undefined = await getTvShowDetails(
      inputReminder.tvShow.id
    );

    // Return reminder with tv show details.
    return {
      reminderId: tvShowReminder._id,
      tvShowDetails,
      completed: tvShowReminder.completed,
      currentSeason: tvShowReminder.currentSeason,
      currentEpisode: tvShowReminder.currentEpisode,
      personalRating: tvShowReminder.personalRating,
    };
  } catch (e: any) {

    /*
      Ejemplo de lo del error. Lo estoy haciendo medio de memoria
      Si te interesa hacerlo bien tira un par de console.logs para ver bien como se llaman los campos y cual es el
      codigo correcto
      if(e.code === 11000) {
        throw new Error("Reminder already exists.");
      }
    */
    throw new Error(e);
  }
}

//  Return all the reminders of the user.
export async function getTvShowsReminder(
  query: FilterQuery<TvShowReminderDocument>
) {
  let remindersRes: TvShowReminderRes[] = [];
  // Find all reminders of the user.
  const reminders: TvShowReminderDocument[] = await TvShowReminderModel.find(
    query
  ).lean();

  // I build the final response with the tv show details of each reminder.
  // Aca podes usar el populate de mongo para no tener que recorrer todos los elementos uno por uno
  // y si vas a retornar un array podes usar el metodo map de los arrays
  for (const reminder of reminders) {
    console.log(reminder);
    const tvShowDetails: TvShowDetails | undefined = await getTvShowDetails(
      reminder.tvShow.id
    );
    let tempReminder = {
      reminderId: reminder._id,
      tvShowDetails,
      completed: reminder.completed,
      currentSeason: reminder.currentSeason,
      currentEpisode: reminder.currentEpisode,
      personalRating: reminder.personalRating,
    };
    remindersRes.push(tempReminder);
  }

  return remindersRes;
}

//  Return all the reminders of the user with pagination.
// no esta mal hacer la paginacion a mano pero existen plugins para hacer la paginacion, aunque hay veces que es 
// mejor hacerlo a mano
export async function getTvShowsReminders(page: any, query: {}) {
  let remindersResponse: TvShowReminderRes[] = [];
  const ITEMS_PER_PAGE = 10;

  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Aca podes hacer el await a las queries directamente y te ahorras el Promise.all
    const countPromise = TvShowReminderModel.countDocuments(query);
    const remindersPromise = TvShowReminderModel.find(query)
      .limit(ITEMS_PER_PAGE)
      .skip(skip);
    // Esta bien el promise.all si queres que se corte en caso de que falle alguna, pero solo para que sepas
    // existe el Promise.allSettled que ejecuta todas no importa el resultado y despues te devuelve un array con
    // con como resulto la promise y la respuesta de la misma
    const [count, reminders] = await Promise.all([
      countPromise,
      remindersPromise,
    ]);
    const pageCount = Math.ceil(count / ITEMS_PER_PAGE); // Divide the number of items in the collection by the items per page, and weround this number up to the nearest integer.
    remindersResponse = await buildRemindersWithDetails(
      remindersResponse,
      reminders
    );

    return {
      pagination: {
        count,
        pageCount,
      },
      remindersResponse,
    };
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
}

async function buildRemindersWithDetails(
  remindersResponse: TvShowReminderRes[],
  reminders: TvShowReminderDocument[]
) {
  // I build the final response with the tv show details of each reminder.
  //Si vas a retornar un array podes usar el metodo map de los arrays
  for (const reminder of reminders) {
    // Acordate de sacar todos los console.logs
    console.log(reminder);
    const tvShowDetails: TvShowDetails | undefined = await getTvShowDetails(
      reminder.tvShow.id
    );
    let tempReminder = {
      reminderId: reminder._id,
      tvShowDetails,
      completed: reminder.completed,
      currentSeason: reminder.currentSeason,
      currentEpisode: reminder.currentEpisode,
      personalRating: reminder.personalRating,
    };
    remindersResponse.push(tempReminder);
  }

  return remindersResponse;
}

// Update a single reminder and return the reminder updated.
export async function updateTvShowReminder(
  filterQuery: FilterQuery<TvShowReminderDocument>,
  update: UpdateQuery<TvShowReminderDocument>,
  options: QueryOptions
) {
  // Cuando retornas inmediatamente la query no hace falta poner el await (esto estoy segura que funciona en
  // nestjs que es un framework de express, pero nose si en express pelado funciona tambien pero no perdes nada 
  // por saberlo)
  return await TvShowReminderModel.findOneAndUpdate(
    filterQuery,
    update,
    options
  );
}

// Deletes a single reminder
export async function deleteTvShowReminder(
  query: FilterQuery<TvShowReminderDocument>
) {
  return await TvShowReminderModel.deleteOne(query);
}

// Return a single reminder based on the filter query.
export async function findTvShowReminder(
  query: FilterQuery<TvShowReminderDocument>
) {
  return await TvShowReminderModel.findOne(query).lean();
}

// Check if a reminder already exists looking by the id of the tv show document.
export async function checkTvShowReminderExistence(
  userId: string,
  inputReminder: TvShowReminderInput
) {
  const reminder = await findTvShowReminder({
    "tvShow._id": inputReminder.tvShow._id,
    "user": userId 
  });

  if (reminder) {
    throw new Error("Reminder already exists.");
  }
}
