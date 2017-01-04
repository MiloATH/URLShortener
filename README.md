# URLShortener
This app allows for random and custom short urls that redirect to a desired site. The app is currently live [here](http://www.shr.host) and [here](https://urlshr.herokuapp.com/).


## Use
Create new shortened URL

JSON response with shortened link and original link

Use the shortened url
## Example
Create:
https://urlshr.herokuapp.com/new/http://www.google.com
or
http://www.shr.host/new/http://www.google.com

Response:
{"original":"http://www.google.com","short":"https://urlshr.herokuapp.com/g"}
or
{"original":"http://www.google.com","short":"http://www.shr.host/g"}

Shortened URL:
https://urlshr.herokuapp.com/g
or
http://shr.host/g
