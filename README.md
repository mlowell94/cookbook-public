# Recipe Book

This is a copy of a full-stack app I built in a week as a Christmas present for a family member. This version is not an exact 1:1 copy, but retains the core functionality of the orginal. The user can create, 
update, and delete recipes, as well as sort them in a variety of ways using what I've called collections. It uses Node, Express, React, and MySQL.

## How to run

1. Run the commands found in schema.sql in a database within your MySQL shell
2. Provide yourself with a password using SHA-256 and insert the hash into the passwords table
3. Run npm install
4. Ensure the credentials needed to connect to your database are correct (lines 31 through 37 in backend/index.js)
5. Open a terminal in backend and run ```npm start``` to start the server (it defaults to localhost:8800)
6. Open a terminal in client and run ```npm start``` to launch the front end on localhost:3000
7. Login using the unhashed password you created in step 2
8. Begin uploading recipes

### Features

* Create recipes, and provide data about them
** ex. When it was last eaten, calories, macronutrients, steps, pictures
* Create Collections and group recipes by things they have in common
* Search for a recipe with a custom set of criteria

### Challenges

Going into this, I'd intended to build it using local storage since my user only uses their mobile phone most of the time, and I was largely unfamiliar with the back-end. 
However, I thought this would be a good opportunity to get my feet wet with working on full-stack applications and it would ultimately be more useful if you could access the app on more devices. 
I'd like to stress that **I knew next to nothing about the backend prior to this project**. My knowledge was limited to knowing how fetch requests worked. Outside of the React components and React Router, everything I learned was the result of hours of research.
I also placed a deadline on myself to have it done before Christmas (which at the time was a little over a week away), so not only did I have to learn how to do a lot of things unfamiliar to me, I had to learn in a short amount of time.

Overall, I found the most challenging part of building this to be the image upload/delete functionality. It had worked locally, but the live version (hosted elsewhere) would not work. Eventually I figured out the issue had to do with the live server and how it was pathing to images. I solved this by specifying the root as __dirname.

Another issue I found challenging was preparing SQL queries for the database. I converted user input into strings, but the whole time I was wondering if there might be a better way.

I feel that it is still a work in progress, but I'm proud that I was able to get core functionality working in such a short amount of time given what little information I had going in.

### Notable Takeaways

* Learned how to query a database from the frontend
* Learned how allow for user file uploads
* Learned how to have a third-party host a full-stack application
