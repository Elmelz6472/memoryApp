# MemoryApp

## Overview

This React Native project utilizes Expo and Firebase to provide a mobile app with various features, including photo/video sharing, messaging, memories/souvenirs, countdowns, bucket lists, SMS-like features, a simple minigame, and an appointment page (RDV) with form and validation.

## Technologies Used

-   **React Native**: A framework for building mobile applications using React.
-   **Expo**: A framework and platform for universal React applications.
-   **Firebase**: Utilized for hosting and authentication.

## Features

1. Photo/Video Feature
   Users can utilize the native camera engine of the iPhone to capture photos and record videos. The captured media is saved locally to the device's gallery.

2. Messages
   The app supports messaging functionality, allowing users to send text messages, photos, and videos. It resembles a regular chat application like Messenger or iMessages. For demonstration, it is currently hard-coded to support communication between two particular users.

3. Memories/Souvenirs
   Users can view messages and souvenirs by clicking on stars present in the backdrop. This feature provides a visual representation of memorable moments captured within the app.

4. Countdown
   The app includes a countdown feature that allows users to visualize the time remaining until the next significant event. This feature is designed to build anticipation and excitement.

5. Bucket List
   Users can add items to their bucket list, and each entry is archived by the date added. The bucket list is synced with Firebase, ensuring data safety and accessibility across devices.

6. SMS-Like Features
   The app includes a feature where users receive falling words of encouragement and affirmations. This provides a positive and uplifting experience for users.

7. RDV (Rendezvous) - Appointment Page
   Users can take rendezvous appointments (simulated with a RESTful API). This feature is designed to handle appointment scheduling, although the use cases are intentionally limited for demonstration purposes.

8. Theme Customization
   Users have the ability to modify the app's theme, allowing for a personalized visual experience. This includes adjusting the seed value, influencing the pattern of stars within the app.

9. App Customization
   Users can customize which apps are showcased on the main screen. This feature provides flexibility in selecting and displaying the apps that matter most to the user.

10. Display Element Configuration
    Users can control the number of displayed elements on the screen. This feature enhances the user experience by providing control over the amount of information or content visible at any given time.

## Installation

Install my-project with npm

**Clone the Repository:**

```bash
   git clone https://github.com/Elmelz6472/memoryApp.git
```

**CD inside the project:**

```bash
cd memoryApp
npm install
npm run start
```

## TODOs

### Notifications

Implement notifications for the app. Consider incorporating banner notifications and options for temporary or permanent display, following iOS notification patterns.

### SMS App

Complete the SMS app functionality. Ensure a seamless and fully functional messaging experience, including the ability to send and receive messages, photos, and videos.

### Themes for Images

Introduce themes specifically designed for images within the app. Allow users to customize the appearance of images based on different themes to enhance the visual experience.
Interactivity Between Photo and SMS
