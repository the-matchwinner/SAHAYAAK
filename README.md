# SAHAYAAK
Sahaayak is a user-friendly digital assistance portal designed to help elderly users access communication, reminders, memories, entertainment, emergency assistance and essential digital services through one simple and accessible interface.

## Run with PostgreSQL

The frontend reads reminders, contacts, and memories through the Spring Boot API. Reminder creation and completion updates are also saved through the API. The frontend uses the Vite `/api` proxy while developing locally.

1. Create a PostgreSQL database named `sahaayak`.
2. From the repository root, apply `database_postgres/schema.sql`, then apply `database_postgres/sample_data.sql` once. The sample records belong to user ID `1`.
3. In a terminal, configure the database values for your local PostgreSQL account and start the backend:

	```sh
	cd backend
	export DB_URL=jdbc:postgresql://localhost:5432/sahaayak
	export DB_USERNAME=your_postgres_username
	export DB_PASSWORD=your_postgres_password
	./mvnw spring-boot:run
	```

4. In a second terminal, start the frontend:

	```sh
	cd frontend
	npm install
	npm run dev
	```

The dashboard currently loads records for user ID `1`, matching the included sample data. To point the frontend at a separately hosted API, set `VITE_API_BASE_URL` to its API base URL (ending in `/api`) before starting Vite.
