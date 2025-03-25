# 🐶 Retriever Tracker

👉 Live: [https://ex.dev.nymark.nu](https://ex.dev.nymark.nu)

Retriever Tracker is a modern web-based application for creating and managing profiles for Retriever dogs.  
Used to log training sessions, upload portrait images, and follow the dog's progress over time.  
The app is optimized for mobile use.

---

## ✨ What can you do?

✅ Create dog profiles with name, breed, age, and gender  
✅ Upload portrait images (automatically compressed and resized)  
✅ View the latest training session  
✅ Add and manage training sessions  
✅ Responsive design – works on mobile, tablet, and desktop  
✅ JWT login and user management  
✅ Server-rendered image handling via MongoDB and Multer

---

## 🧠 Tech Stack

| Part                | Tech                                               |
|---------------------|----------------------------------------------------|
| Frontend            | Angular                                            |
| UI Components       | Angular Material                                   |
| Backend             | Node.js + Express                                  |
| Database            | MongoDB + Mongoose                                 |
| Authentication      | JWT + Bcrypt                                       |
| Image Upload        | Multer + Sharp (300x300 optimization)              |
| Deployment          | Docker Compose                                     |
| Frontend Server     | NGINX (static hosting)                             |
| Reverse Proxy & SSL | NGINX Reverse Proxy + Let's Encrypt                |
| Infrastructure      | Isolated DMZ network, geoblocking, Watchtower      |

---

## DevOps & Infrastructure

The application is deployed with focus on security, performance, and scalability. It's running in a server environment isolated within a DMZ network.

### Docker & Containers 🐳

The app is managed via `docker-compose` and consists of five containers:

- MongoDB  
- Node.js/Express (custom-built backend container)  
- NGINX (serves the frontend statically)  
- NGINX Reverse Proxy (handles routing & SSL termination)  
- Watchtower (automatically updates running containers)  

### NGINX Reverse Proxy & SSL

- SSL termination is handled by the **NGINX Reverse Proxy**, which is the only container exposed to the internet  
- This setup allows multiple web apps to run behind a single public IP  
- Internal routing is handled via Docker networks  
- Certificates are generated and managed automatically via Let’s Encrypt  

### Network Architecture

- The application runs inside an isolated DMZ  
- Only port 443 (HTTPS) is open to the outside world  
- Geoblocking is enabled – only Swedish IP addresses are allowed  

### Continuous Deployment

- CI/CD is prepared – tools like GitHub Actions and Docker Hub builds were explored  
- Deployment is currently manual due to time constraints, but groundwork for automation is already in place  

---

## 🔍 Code access

### Clone the project

```bash
git clone https://github.com/sandranymark/Retriver-Tracking.git

```

## 🚫 Local usage

This application is **not intended to be run locally** – no database URI or JWT secret is included in the project.  
Instead, you’re welcome to read through the code and test the app live at:

👉 [https://ex.dev.nymark.nu](https://ex.dev.nymark.nu)

---

## 🧑‍⚖️ For Reviewer – how to test the app

1. Go to 👉 [https://ex.dev.nymark.nu](https://ex.dev.nymark.nu)  
2. Register an account  
3. Log in with your user  
4. Add a dog  
5. Upload an image from your mobile or computer  
6. Add a training session  
7. Try editing, deleting, switching between dogs, etc.

✅ The application is **self-contained** – no API keys, passwords, or external services are needed to test it.

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/67fa322c-ccb9-4b6a-a75d-e43285e21543" width="200" />
  <img src="https://github.com/user-attachments/assets/1ba30d5c-d412-49ab-a21f-0180205779c9" width="200" />
  <img src="https://github.com/user-attachments/assets/825cae67-e3d8-41fa-89aa-189480e0b1db" width="200" />
  <img src="https://github.com/user-attachments/assets/6ef734fb-09e7-4b8d-8db4-067a76494acf" width="200" />
  <img src="https://github.com/user-attachments/assets/5415b1d9-ee48-4ef1-8d50-97afe5c541c4" width="200" />
  <img src="https://github.com/user-attachments/assets/dc59c2a5-d16a-41b5-b737-e46a90081af1" width="200" />
  <img src="https://github.com/user-attachments/assets/95030a21-40e1-4ee1-bc78-3aacf657c03e" width="200" />
  <img src="https://github.com/user-attachments/assets/d34b8ee0-815d-4291-9346-3fd429c0470f" width="200" />
</p>

---

## Thanks, tears & transparency

This project is my own final assignment.  
I want to be transparent and mention that I received help from my husband with parts of the server configuration – such as setting up the reverse proxy, SSL certificates, geoblocking, and networking.  
All frontend, backend, and core functionality was built and designed by me.

I’m pleased of what I’ve achieved and see this as a solid step toward becoming a developer.

---

#### There’s a lot I had hoped to polish further, but my focus was on hitting the goals I set for this project – and I did.

# Over and out - Sandra 







