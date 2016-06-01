# Introductions
* You can start the server normally with visual studio
* Admin is at /admin
* Use email : root@gmail.com and password : admintest


# Setup development (only if you're going to develop frontend)

* Install packages for the the frontend app with ```npm install```

* Run the app ``npm run dev```
* Wait for it to bundle

* Open visual studio
* Open index.html in Home directory
* Read the comments
* ***If you're developing*** the react application make sure the link start with http:localhost:3000/static
* This is because .NET server takes the content from our node.js server
* This server is a hot reloading server, ***if you're not developing do not touch anything!***

* Start the server and go to localhost:8000, you should see the react app.
* If you do changes in the app folder (src folder), you'll see that your browser updates without refresh
* Now you can develop this application.
* Profit

* When you're done with the app ```npm run build``` to bundle everything together. Results will be in dist folder.
* Put those folder in Style and Scripts folder in paperfeed_server
