# Nexus-Webapp
<img width="1864" height="912" alt="image" src="https://github.com/user-attachments/assets/e5ca2faf-cec6-4a67-900c-5e0e36d1a2a0" />


Full-stack notes application built with **Next.js (client)** and **Node/Express (server)** using **MongoDB** for persistence.

## Features

- Email/password authentication (JWT)
- Create / Read / Update / Delete notes
- Protected API endpoints with middleware
- Responsive UI using Next.js (app router)

## Quick start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (URI)

### Clone

```bash
git clone https://github.com/akshitgupta2503/Nexus-Webapp.git
cd Nexus-Webapp
```

### Server

```bash
cd server
npm install
# create .env with:
# MONGO_URI=<your_mongo_uri>
# PORT=5000
# JWT_SECRET=<your_jwt_secret>
npm run dev
```

### Client

```bash
cd client
npm install
# create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

## Environment

- Do not commit `.env` files. Keep secrets out of the repo.

## Contributing

- Issues and PRs welcome. Follow standard PR workflow and include tests where possible.

## License

MIT — see the `LICENSE` file for details.
