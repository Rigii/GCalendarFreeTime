import React from "react";
import "./App.css";
import { gapi } from "gapi-script";

var GOOGLE_API_KEY = "AIzaSyDwddE4lkoGUeKsw4aBFJP7mCKw3xdyNJs";
var CALENDAR_ID = "u62lnkro6vul3ucjpht02vijn8@group.calendar.google.com";

const App = () => {
  const startTimeLimit = new Date(2020, 3, 22, 8);
  const endTimeLimit = new Date(2020, 3, 22, 19);

  const getEvents = () => {
    const start = async () => {
      gapi.client.init({ apiKey: GOOGLE_API_KEY });
      try {
        const events = await gapi.client.request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?maxResults=11&orderBy=updated&timeMin=${startTimeLimit.toISOString()}&timeMax=${endTimeLimit.toISOString()}`,
        });
        const resultItems = events.result.items;
        const items = resultItems.sort((a: any, b: any) => {
          return (
            new Date(a.start.dateTime).getTime() -
            new Date(b.start.dateTime).getTime()
          );
        });
        const freeIntervals: Date[][] = [];
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          const nextItem = items[index + 1];
          if (nextItem) {
            freeIntervals.push([
              new Date(item.end.dateTime),
              new Date(nextItem.start.dateTime),
            ]);
          } else if (
            endTimeLimit.getTime() > new Date(item.end.dateTime).getTime()
          ) {
            freeIntervals.push([new Date(item.end.dateTime), endTimeLimit]);
          }
        }
        const firstResult = new Date(resultItems[0].start.dateTime);
        startTimeLimit.getTime() < firstResult.getTime() &&
          freeIntervals.unshift([startTimeLimit, firstResult]);
        console.log(freeIntervals);
      } catch (error) {
        console.log(error);
      }
    };
    gapi.load("client", start);
  };

  return (
    <div>
      <h1>Get google time</h1>
      <button onClick={getEvents}>Get time</button>
    </div>
  );
};

export default App;
