# Expense Tracker - MERN Stack

A full-featured Expense Tracker built with the MERN stack, featuring secure authentication, personalized data per user, and an interactive dashboard with charts. This project showcases modern React, TailwindCSS, ShadCN UI, and backend best practices like JWT authentication and bcryptjs password hashing.

## Features

- User Authentication: Secure registration & login using JWT and bcryptjs.
- Personalized Data: Each user has their own private expense data.
- Add & Track Expenses: Categorize expenses like Food, Transport, Bills, Shopping, etc.
- Interactive Dashboard: Visualize total spending over time with charts (Recharts) and paginated expense list.
- State Management: Handled globally with React Context Hook, no Redux needed.
- Responsive Design: Works seamlessly on mobile and desktop devices.

## Tech Stack

Frontend: React, TailwindCSS, ShadCN UI, Recharts  
Backend: Node.js, Express, MongoDB  
Authentication & Security: JWT, bcryptjs  

## Environment Variables

Create a `.env` file in the backend folder with the following:

MONGO_URL='Your DB URL' 
PORT=5000  
JWT_SECRET=superstrongsecretkey  

## Getting Started

1. Clone the repository:  
`git clone https://github.com/ChickenOnFloor/ExpenseTracker-MERN.git`  
`cd ExpenseTracker-MERN`

2. Install dependencies:

Backend:  
`cd backend`  
`npm install`

Frontend:  
`cd ../frontend`  
`npm install`

3. Run the project:

Start backend server:  
`cd backend`  
`npm run dev`

Start frontend:  
`cd ../frontend`  
`npm run dev`

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## Project Structure

ExpenseTracker-MERN/  
├─ backend/        # Node.js + Express API  
├─ frontend/       # React + TailwindCSS + ShadCN UI  
└─ README.md  

## Contributing

Feel free to submit issues or pull requests. Contributions to improve this project are welcome!

## License

MIT License
