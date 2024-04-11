from app import app
from models.database import db
from models.models import User


# Function to update user details and make them an admin
def update_admin(username, email, password):
    with app.app_context():
        # Check if the admin user already exists
        admin_user = User.query.filter_by(username=username).first()
        if not admin_user:
            return "Admin user does not exist."

        # Update the admin user's details
        admin_user.email = email
        admin_user.set_password(password)
        admin_user.is_admin = True  # Set as admin

        try:
            # Commit changes to the database
            db.session.commit()
            return "Admin details updated successfully."
        except Exception as e:
            # Rollback the transaction if an error occurs
            db.session.rollback()
            return f"An error occurred: {str(e)}"


# Example usage:
if __name__ == "__main__":
    result = update_admin('admin', 'admin@gmail.com', 'new_password')
    print(result)
