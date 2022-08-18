
# Canary
## The Incognito mode for Twitter

Canary is a cross-platform mobile application that lets you discover and save content via Twitter APIs without any account or log-in info. All data is private and stored on the user's own device with no tracking parameters.


<img src="https://user-images.githubusercontent.com/86605635/185108384-b635c432-6f7a-43c6-909f-a10ff8e550a8.gif" style="width: 50%;"/>


## Features

- Personalise your tweet feed from all your favorite topics.
- Stay up-to-date with tweets from your favorite users with the help of _Lists_.
- Revisit your favorite tweets and organise them however you want with _Archives_.
- Discover trending topics from all over the world.
- Access threads to learn more about any tweet.
- Search by keywords, mentions, usernames, hashtags, etc.
- Filter search results by popularity or recency.
- Support for playing videos, viewing images, and playing GIFs. 
- Share tweets with your social circles.

All of these features without sharing your data or getting tracked by anyone -- Not even us.

## What it does

Canary is a privacy-focused app that lets users discover personalized public content without needing an account. The user can browse the home feed based on their preferences, search for specific topics, stay up to date with their favorite users, and archive tweets into multiple groups for the future. 

Users can discover trending topics all around the world by choosing any country from a list of countries. 
The user can also opt to browse the most popular or most recent tweets on the topics or user accounts from the search results.

To make the app's content more relevant, we have reverse engineered and implemented Twitter's Lists feature. In addition, we have improved Twitter's Bookmarks feature by enabling users to create multiple archives with custom names that will store tweets. So, while browsing through the Canary app, the user can add any of their favorite tweets to any archive. 

Users can view media like GIFs, images and videos right in the applications and also share tweets among their social circles. Moreover, we offer a choice that redirects the user to Twitter in order to allow them to interact with tweets.

## Preview


|   |   |
| - | - |
|  ![All data is stored in device, and none to us](https://user-images.githubusercontent.com/86605635/185335268-13dff02d-b564-41c3-9bd5-8319ded8612f.jpg) | ![Archive tweets for the future](https://user-images.githubusercontent.com/86605635/185335287-5b3cb8d3-7285-46b5-af66-c2dfa81315cb.jpg)  |

|   |   |   |
| - | - | - |
|  ![Make your feed hyper-personalised](https://user-images.githubusercontent.com/86605635/185335292-3f80008f-8807-465d-83b5-39e4fcaa8601.jpg) | ![Search for specific topics](https://user-images.githubusercontent.com/86605635/185335297-304155d2-bd8b-44f1-b8ed-73ae14fe66d0.jpg) | ![Stay up-to-date from users via Lists](https://user-images.githubusercontent.com/86605635/185335301-cd667380-241a-422b-99b2-a00f68dda935.jpg) | 


## Installation
- Create a Twitter Developer account and generate Bearer Token by following [these](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens) steps. Note: To access all features of this app, you will need elevated access which you can get by applying [here](https://developer.twitter.com/en/portal/products/elevated).
- Clone the project.
- Create `.env` file in the root directory of the project and paste the following lines.
```sh
TWITTER_BEARER_TOKEN={BEARER_TOKEN}
```
Install the dependencies and dev dependencies.

```sh
cd canary
npm i
```

for iOS.
```sh
cd ios
pod install
```

To run the app on android.
```sh
npx react-native run-android
```

To run the app on iOS.
```sh
npx react-native run-ios
```

## Try it out!

You can download the app [here](https://drive.google.com/drive/folders/1OCA8czAIVEaGfU-F6EUL8fMwdnRerKdP?usp=sharing).

## Future Enhancements

- Exporting existing lists from Twitter and letting users save it
- Creating and restoring backups
- Sharing of Lists and Archives across users
- Support for Dark Mode

## Contributors

- [Mohit Charkha](https://github.com/mohitcharkha)
- [Harsh Siriah](https://github.com/harshsiri110)
- [Vinay Harwani](https://github.com/vinayharwani13)
