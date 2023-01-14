import mongoose from "mongoose";

export interface TvShowDocument extends mongoose.Document {
  id: string;
  originalName: string;
}

const tvShowSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true
    },
    original_name: {
        type: String,
        require: true
    }
});

const TvShowModel = mongoose.model<TvShowDocument>("TvShow", tvShowSchema);
export default TvShowModel;