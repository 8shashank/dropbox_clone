# Review of Chris Su by Edward Yun

## Overview

This code adds Twitter and Facebook integration. If an upload file has the extension ".gif", ".png", ".webp", or ".jpeg", the code will upload the media on Twitter.

There are plans to extend this functionality to Facebook later on. 

## Suggested Reading Materials

## Suggested Improvements

1. It is unclear whether or not changing a media file will upload the file to Twitter/FB. If not, it could be a good feature to implement.

2. You required 'fb' twice in your facebook.js file. I removed the duplication for you.

3. Perhaps you can add in functionality that allows you to select which extensions you want to upload to your social media accounts.

4. You should use semi-colons to better format your code.

5. This code seems to only work with hard-coded access tokens. It may be better to allow your user to log in with their accounts from the command line. 