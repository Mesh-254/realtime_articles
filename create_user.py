from app import app
from models.database import db
from models.models import User


# function to create user manually to database
def create_user(username, email, password):
    with app.app_context():
        # Check if the user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return "User already exists with that username."

        # Create a new user instance
        new_user = User(username=username, email=email)
        new_user.set_password(password)

        try:
            # Add the new user to the database session and commit changes
            db.session.add(new_user)
            db.session.commit()
            return "User created successfully."
        except Exception as e:
            # Rollback the transaction if an error occurs
            db.session.rollback()
            return f"An error occurred: {str(e)}"


# Example usage:
if __name__ == "__main__":
    result = create_user('meshack', 'meshack@example.com', 'meshack@2024')
    print(result)
