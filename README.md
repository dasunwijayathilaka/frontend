
# 🛒 Classified Ads Web Application

🎥 Youtube Demo Video
📺  https://youtu.be/LcBmKBjrhh8?si=ZvWeXEC2DK4gwtFk

**👨‍💻 Author:** Dasun Tharaka Wijayathilaka  
**🏫 Institute:** IJSE - GDSE69 - Panadura  
**📚 Project:** 2nd Semester Final Project (Spring Boot)

---

## 📌 Project Description

This is a full-stack web-based **Classified Ads Platform** that allows users to post, browse, and manage ads in various categories such as Electronics, Vehicles, Real Estate, Jobs, and more. Inspired by platforms like **ikman.lk**, this application enables users to register, post ads with images, filter ads based on category and location, and communicate in real-time. The admin panel allows site management including user moderation and category controls.


## 📸 Screenshots

> All screenshots are located in the `screenshots/` folder.

### 🏠 Home Page  
![Home Page](screenshots/homepage.png)

### 👤 User Dashboard  
![User Dashboard](screenshots/user_dashboard.png)

### 📝 Post Ad Form  
![Post Ad](screenshots/post_ad_form.png)

### 🧑‍💼 Admin Panel  
![Admin Panel](screenshots/admin_panel.png)

### 💬 Chat Interface  
![Chat](screenshots/chat_interface.png)

---

## ⚙️ Setup Instructions

### 🔧 Backend (Spring Boot)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/classified-ads-app.git
   cd classified-ads-app



-----------------------------------------

Configure Database (MySQL)

Create a database called classified_ads

Update src/main/resources/application.properties:

properties
Copy
Edit
spring.datasource.url=jdbc:mysql://localhost:3306/classified_ads
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

-----------------------------------------------

Run the Application

bash
Copy
Edit

./mvnw spring-boot:run
App will be available at http://localhost:8080


--------------------------------------------------


🌐 Frontend (HTML/CSS/JavaScript)
Navigate to the frontend folder:

bash
Copy
Edit
cd frontend
Open index.html with Live Server (or just open in browser).

Ensure backend is running and adjust any fetch API endpoints in JS files to http://localhost:8080.


-----------------------------------------------------

🔐 Credentials (For Testing)
➤ User Account:
Email: das@gmail.com

Password: 12345678

➤ Admin Account:
Email: admin@gmail.com

Password: 111111

--------------------------------------------------------

✅ Key Features
🔒 User Authentication (JWT + Spring Security)

📤 Post/Edit/Delete Ads

🔍 Category & Keyword Filtering

🗃️ Admin Panel for User & Ad Management

📸 Image Upload Support

💬 Real-time Chat System

📱 Fully Responsive UI

------------------------------------------------------

🧑‍💻 Technologies Used
Backend:
Java 17

Spring Boot 3

Spring Security

JPA + Hibernate

MySQL

JWT Authentication

Frontend:
HTML5

CSS3

JavaScript (Vanilla)

Bootstrap 5

-----------------------------------------------

📬 Contact
📧 Email: dasunwijayathilaka@gmail.com
📍 Location: Colombo, Sri Lanka

-------------------------------------------------

📄 License
This project is for educational purposes only under the guidelines of IJSE - GDSE69 coursework.

--------------------------------------------------


---

------------------------------------------------------------------------------------------------------------------------------























