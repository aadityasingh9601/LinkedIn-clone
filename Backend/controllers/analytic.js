import User from "../models/User.js";
import Analytic from "../models/Analytics.js";
import Post from "../models/Post.js";

const logEvent = async (req, res) => {
  console.log("inside log event on backend.");

  const { eventData } = req.body;

  //console.log(eventData);

  //Now we have to save the post_impression information in the database for every post along with the user.

  //If the eventType is post_impression,only then --
  if (eventData.eventType === "post_impression") {
    //For every postId,
    for (let p of eventData.postIds) {
      //Find the owner of each post.
      const post = await Post.findById(p);

      console.log(req.user._id);
      console.log(post.createdBy);

      if (req.user._id.toString() === post.createdBy.toString()) {
        res.send("You can't log event for yourself!");
        return;
      }

      //Store the data into analytics now.

      const analytic = new Analytic({
        user: post.createdBy,
        triggeredBy: req.user._id,
        eventType: "post_impression",
        metaData: {
          postId: p,
        },
      });

      await analytic.save();
      console.log(analytic);
      res.status(201).send("Data logged successfully!");
      return;
    }
  }

  //Using for of loop to store all the users that appeared in the search sequentially one by one
  //We could've also used await Promise.all() with map for parallel execution, but that way our data doesn't
  //get stored in order in the database.
  else if (eventData.eventType === "search_appearance") {
    for (let u of eventData.users) {
      if (req.user._id.toString() === u) {
        res.send("You can't log event for yourself!");
        return;
      }

      const analytic = new Analytic({
        user: u,
        triggeredBy: req.user._id,
        eventType: "search_appearance",
      });

      await analytic.save();
      console.log(analytic);
      res.status(200).send("Data logged in successfully!");
      return;
    }

    //We've not used forEacch or map because they don't support async & await inside them, so database queries
    //won't happen as expected, so we've used for of loop as shown above.
    // const users =  eventData.users.forEach((u)=>{

    //   const analytic = new Analytic({
    //     user: u,
    //     triggeredBy: req.user._id,
    //     eventType: eventData.eventType,
    //   });

    //   await analytic.save();
    //   console.log(analytic);

    // })
  } else {
    if (req.user._id === eventData.userId) {
      res.send("You can't log event for yourself!");
      return;
    }

    const analytic = new Analytic({
      user: eventData.userId,
      triggeredBy: req.user._id,
      eventType: eventData.eventType,
    });

    await analytic.save();
    console.log(analytic);
    res.status(200).send("Data logged in successfully!");
    return;
  }
};

const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.user._id;

    const event = req.query.q1;

    const range = req.query.q2;

    console.log(range);

    const eventType = event
      .substring(0, event.length - 1)
      .toLowerCase()
      .split(" ")
      .join("_");

    const user = await User.findById(userId);
    const signupDate = user.signupDate;
    console.log(signupDate);

    let startDate;

    // console.log(signupDate);

    let endDate = new Date(); //Pass today's date.
    console.log("I am end date" + endDate);
    //In case , user is logged in just 5 days ago, but wanna see the earlier analytics too, so to handle that
    //fix the startDate to signupDate.

    if (startDate > signupDate || range === "all" || range === "365") {
      //The issue that was occuring was , out database stores the date in UTC format, but our backend means
      //node.js uses local IST (Indian Standard Time) so when you were trying to assign startDate = signupDate
      //it was getting assigned in IST format , not UTC format, and that caused problem because time shifts
      //occured that displaced the whole date range, so from now on use UTC whenever u have to also store
      //dates in databases also, to ensure no overlap, shifts or problem occurs.
      startDate = new Date(
        Date.UTC(
          signupDate.getUTCFullYear(),
          signupDate.getUTCMonth(),
          signupDate.getUTCDate(),
          0,
          0,
          0
        )
      );
      console.log("I am the start date" + startDate);
    } else {
      let today = new Date();
      startDate = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        )
      );
      startDate.setUTCDate(startDate.getUTCDate() - (range - 1));
      console.log("I am the start date" + startDate);
    }

    //console.log(startDate);
    //console.log(new Date());

    //CREATE AN AGGREGATION PIPELINE HERE, TO DO COMPLEX OPERATIONS AND GET ANALYTICS DATA ACCORDINGLY.
    //KEEP THIS PIPELINE DYNAMIC TO ENSURE IT HANDLES DIFFERENT KIND OF EVENTS PROPERLY.

    const data = await Analytic.aggregate([
      //1.First filter data according to userId,eventType and date range.
      {
        $match: {
          user: userId,
          eventType: eventType,
          date: {
            $gte: startDate,
            $lt: new Date(),
          },
        },
      },

      //Grouping the selected data.
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    const properData = data.map((e) => {
      return { date: e._id, count: e.count };
    });
    console.log(data);
    console.log(properData);

    //What we're doing here is that , suppose there is no analytics data for a certain data in the database,
    //what would we show on the graph for that day? nothing? no, we would be needing a full range of data to
    //be shown on the graph , and because of this we're taking our data from the database and mergin that with
    //the complete range of dates generated or selected by the user.
    const generateDateRange = (start, end) => {
      //console.log(start, end);

      const dates = [];
      const current = new Date(start);

      while (current <= end) {
        dates.push(new Date(current)); // push a copy of the date
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }; //It generates the complete range of date.

    const formatDate = (date) => date.toISOString().split("T")[0];

    const formatDate2 = (date) => {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC", // Ensures no timezone shift
        //Because initially u haven't wrote this, date shifts were occuring for the "All" range & 365 days
        //range it was showing 12 Oct on frontend but 11Oct on backend, because of which the count for mar 1
        //was showing 0.
      });
    };

    // Set the date range

    const fullRange = generateDateRange(startDate, endDate);
    // console.log(fullRange);

    // Map the full range and merge with fetched data to have complete data for us to display.
    const completeData = fullRange.map((date) => {
      const formatted = formatDate(date);
      const formatted2 = formatDate2(date);
      const dataForDay = properData.find((item) => item.date === formatted);
      return {
        date: formatted2,
        count: dataForDay ? dataForDay.count : 0,
      };
    });

    console.log(completeData.length);

    res.status(200).send(completeData);
  } catch (e) {
    console.log(e);
    res.send("Already logged for the day.");
  }
};

export default { logEvent, getAnalyticsData };
