Coding Temple - Capstone Project

Name of App: TrekTracker - find biking trails anywhere in the country and document your journey. It’s basically an app that a user will be able to find 
Biking trails, save them to their profile and make notes about them. They are able to update their notes and delete trails they don’t care for.
My ultimate goal was to combine a little bit of everything I’ve learned into one app. 

Front end: React with Typescript (and I guess node.js). I picked React because it was the freshest in memory and seemed to be the most dynamic.

Back end: Google Firebase, Firestore database and Storage for image upload

The back end has two tables - users and trails. The trails get saved via a user id. The user can only save a specific trail once but many users can save the same trails.
Everyone who is registered can upload pictures to the universal gallery. I originally wanted this to be a user profile but it did not work out the way I wanted so
I resorted to this. I think this way gives it a sense of community. The only downside is that everyone has the ability to delete pics whether they originally
Posted the pic or not. This is something I’d like to fix in the future. (And maybe add the user profile capability).

API’s used: TrailAPI to pull trail data, OpenWeatherMap and Google Maps

Issues I had: Google Maps API is very challenging to use and it took a lot of research to figure out how to make all 3 api’s work together with one user input.
Thankfully I had my weather app from a weekend assignment that I could reference for help. 
TypeScript was very TypeScripty lol. Enough said.

Things I'd like to change/work on: 
- User profile
- Not having everyone delete pics lol
- Better functionality of the google map

link to functioning app: https://trektracker-app.web.app/