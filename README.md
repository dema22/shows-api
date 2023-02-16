# Shows-api

This project contains the back end source code for the 

# Pre-Requisites

In order to run The Tv Shows Reminder Api, you will need:

1. Docker-compose
2. A Movie db api key

# Running The Tv Shows Reminder Api

1. cd into the shows-api
2. Create a .env file in the root directory.
3. Create a MovieDB account. Follow the # How to Create Your Own TMDB API Key section.
4. Set a variable name 'PRIVATE_KEY' and 'PUBLIC_KEY' in the .env, both variables should be a character string literal, randomly generated. You can refer to 
   the # Generate Private and Public key for authentication feature.
6. Set a variable name 'MONGODB_URI' in the .env, with the following value: mongodb://mongo_db:27017 , this is the connection string to the mongo database container.
7. Set a variable name 'PORT' in the .env, with the 1337 numeric value, we are going to use this port for our express api.
8. If you want to request the /api/tvShows endpoints, you MUST import the tv_series_ids_01_10_2023.json file.
   You can do this by connecting to mongodb://localhost:27018 (this is the connection string you can use to connect to the mongodb image).
9. Do docker compose build.
10. Do docker compose up.
11. You can import the postman collection to start sending request to the API.

# How to Create Your Own TMDB API Key

1. Go to the TMDB website (https://www.themoviedb.org/) and sign up for a free account.
2. Once you are logged in, click your Profile Icon in the top right corner and then select Settings.
3. On the left side menu click API and then click Create Here in the middle of your screen, in the Request an API Key section.
4. Fill out this form asking you for your address, phone number, and other personal information. You can use real or fake information, it doesn’t matter. At the end of this screen when you submit the information, you will be given a TMDB API Key.
5. Set a variable with the name 'APIKEY_MOVIEDB' in the .env and use the api key you obtain in step 4.

# Generate Private and Public key for authentication feature.

1. Generate new keys: https://travistidwell.com/jsencrypt/demo/
2. Base64 encode the keys: https://www.base64encode.org/


# .env format:
    PRIVATE_KEY="YOUR PRIVATE KEY GOES HERE"
    PUBLIC_KEY="YOUR PUBLIC KEY GOES HERE"
    MONGODB_URI="mongodb://mongo_db:27017"
    PORT=1337
    APIKEY_MOVIEDB="YOUR TMDB API KEY GOES HERE"