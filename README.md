# Realtime Articles

Realtime Articles is a Flask-based web application designed to provide users with a platform for publishing and reading articles in real-time. This repository contains the source code for the application, including database models, routes, templates, and static files.

## Technologies Used

- **Python**: Flask framework is used for backend development.
- **MySQL**: Database management system for storing user data, articles, categories, and subheadings.
- **Bootstrap**: Frontend framework for building responsive and visually appealing web pages.
- **JavaScript (JS)**: Used for enhancing user interactions and dynamic content on the client-side.
- **CSS**: Styling language used to customize the appearance of web pages.
- **HTML**: Markup language for structuring the content of web pages.

## Installation Instructions

To run Realtime Articles locally, follow these steps:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/yourusername/realtime-articles.git
   ```

2. Navigate to the project directory:

   ```
   cd realtime-articles
   ```

3. Install the required Python packages using pip:

   ```
   pip install -r requirements.txt
   ```

4. Set up the MySQL database:
   - Create a MySQL database named `realtime_articles`.
   - Update the database connection URI in `config.py` file.

5. Initialize the database schema:

   ```
   python manage.py db init
   python manage.py db migrate
   python manage.py db upgrade
   ```

6. Run the Flask application:

   ```
   python app.py
   ```

7. Open your web browser and visit `http://localhost:5000` to access Realtime Articles.

## Usage

- **User Registration/Login**: Users can register for a new account or login with their existing credentials.
- **Article Creation/Editing**: Authenticated users can create new articles, edit existing ones, and add subheadings with content and images.
- **Article Categories**: Articles are organized into different categories for easy navigation and discovery.
- **Real-time Updates**: Users can experience real-time updates when new articles are published or existing ones are edited.

## Contributors

- [Meshack Mutune](https://github.com/Mesh-254) - Lead Developer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to [Flask](https://flask.palletsprojects.com/) and [Bootstrap](https://getbootstrap.com/) communities for their amazing contributions.
- Inspiration from various online tutorials and documentation sources.
  
Feel free to contribute to this project by forking the repository, making improvements, and submitting pull requests. If you encounter any issues or have suggestions for improvements, please open an issue on GitHub. Thank you for your interest in Realtime Articles!