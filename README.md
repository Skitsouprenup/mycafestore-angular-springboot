# mycafestore-angular-springboot
A Simple and responsive Cafe Management System created using Angular and Spring Boot.

I have a demo video of this project in this [link](https://youtu.be/YWiADUZNp1c)

# Technologies Used
* **Javascript**
* **Angular**
* **Angular Material**
* **Java**
* **Spring Boot**
* **Postgresql**

# Testing this project
You can clone this project and test it for yourself. However, you need to create *application.properties* in *server/src/main/resources/* directory and add these following variables:

## Back-end

**spring.datasource.driver-class-name** -> e.g. org.postgresql.Driver  
**spring.datasource.url** -> jdbc:postgresql://localhost:4000/mydb  
**spring.datasource.username** -> Your database username  
**spring.datasource.password** -> Your database password  

**spring.jpa.show-sql** -> Show SQL queries in logs. true or false  
**spring.jpa.generate-ddl** -> Enable DDL like auto table creation. true or false.  

**spring.jpa.properties.hibernate.default_schema** -> Select default schema in your database.
**spring.jpa.properties.hibernate.globally_quoted_identifiers** -> Prevents naming conflicts with per-defined entities in a database. true or false.  
**spring.jpa.properties.hibernate.dialect** -> Specific dialect for a database e.g. *org.hibernate.dialect.PostgreSQLDialect*  
**spring.jpa.properties.hibernate.format_sql** -> If *spring.jpa.show-sql* is true, queries in logs will be formatted nicely.  

**server.port** -> port where you want your backend to run.  

**jwt.secret.key** -> Secret key for JWT token encryption.  
**endpoint.base** -> Base endpoint of your APIs. e.g. */api/v1*  

**pass.aes.key** -> Secret key for AES encryption. AES only supports key sizes of 16, 24 or 32 bytes.  
**spring.mail.host** -> Mail host for email sending operations. e.g. smtp.gmail.com  
**spring.mail.port** -> Port for email sending operations. Can be any port as long as it's available. Port 587 is usually used as port for spring mail.
**spring.mail.username** -> Username associated with your chosed mail host.  
**spring.mail.password** -> Password associated with your chosed mail host. For gmail host, use google app password.  
**spring.mail.properties.mail.smtp.auth** -> enables SMTP authentication. true or false.  
**spring.mail.properties.mail.smtp.starttls.enable** -> enables TLS connection. true or false. Some SMTP servers requires TLS connection. It's better to set this to true.
