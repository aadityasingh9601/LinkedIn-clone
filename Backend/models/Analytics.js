import mongoose from "mongoose";

const { Schema } = mongoose;

const analyticsSchema = new Schema({
  //The profile_visits, search appearances, etc are related to which user, kis user ke analytics h ye?
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //We need to store this, as it'll help us know & differenciate unique entries & avoid duplicate ones.
  triggeredBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //We changed the type of timestamp from Date to String, because we wanted to store date in the database
  //in a proper format (yyyy-mm-dd) , but mongoDB stores type:Date in the mixed format, no matter what the
  //default value is , so to ensure that the date is stored properly , we've changed the type to String.
  //But doing so maybe be bad, as storing dates like this,would result in harder queries on the database
  //sorting and filtering also gets harder, the only disadvantage of the default format of Date stored in
  //database is that it's not human readable, that too can be fixed by converting the date into proper format
  //at the time of displaying on the frontend.So, for now just store the date as it is and format later.
  //by using this way  () => new Date().toISOString().split("T")[0],
  date: {
    type: Date,
    default: () => {
      //We've wrote like this to ensure only dates not time gets stored in the database & the unique index
      //can work properly to ensure no two duplicate entries on the same day.
      const now = new Date();
      return new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
      ); // Truncates time
    },
  },
  eventType: {
    type: String,
    enum: ["profile_view", "search_appearance", "follower", "post_impression"],
    required: true,
  },
  //metadata, U can also store this field later in ur schema, if u switch to more advanced analytics.
  //It's optional, if there's some metadata store it, else leave it empty.
  metaData: {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
});

//Creating an index to ensure duplicate entries doesn't get stored in the database, only there must be one
//entry per user per day.

analyticsSchema.index(
  { user: 1, triggeredBy: 1, eventType: 1, date: 1, metadata: { postId: 1 } },
  { unique: true }
);

const Analytic = mongoose.model("Analytic", analyticsSchema);

export default Analytic;
