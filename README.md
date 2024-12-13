## Features

### User Authentication
- **Registration**: Users can register with their name, email, password, and role (Property Dealer or Regular User).
- **Login**: Users can log in with their email and password.
- **Token-Based Authentication**: Secure JWT tokens are used to authenticate users.
- **Role-Based Access Control**:
  - Regular users can view properties.
  - Property Dealers can add new properties.

### Property Management
- **Add Property**: Property Dealers can add new properties by providing details like title, location, price, and image.
- **View Properties**: All users can view the list of available properties.

## Tech Stack
### Frontend
- **HTML**: Structure of the pages.
- **CSS**: Styling of the UI components.
- **JavaScript**: Handles API calls and dynamic UI updates.

### Backend
- **Node.js**: Backend server.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: Database to store user and property data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **bcryptjs**: Password hashing for secure storage.
- **jsonwebtoken (JWT)**: Secure user authentication.
- **CORS**: Cross-Origin Resource Sharing middleware.

---

## Setup Instructions

### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/real-estate-management-app.git
   ```
2. Navigate to the project folder:
   ```bash
   cd real-estate-management-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Run the App
1. Start the backend server:
   ```bash
   npm start
   ```
2. Open the `index.html` file in a browser to interact with the app.

---

## ScreenShots


### Home Page
![img2](https://github.com/user-attachments/assets/22cfdbd9-38f0-4849-ba5e-800e4c529624)

### Authentication

![img1](https://github.com/user-attachments/assets/3782f633-1225-46d2-b9cc-eb02047d9d3c)


### Properties
![img3](https://github.com/user-attachments/assets/27474721-144c-4767-8037-441ce2e25eaa)

![img4](https://github.com/user-attachments/assets/f25ccf57-2677-4252-a0d0-ef9c16c5d051)

## Deployment Link
https://gleeful-jelly-1ca2cc.netlify.app/



