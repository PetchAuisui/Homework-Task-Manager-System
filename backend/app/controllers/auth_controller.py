    from flask import request
    import os
    from werkzeug.utils import secure_filename
    from app.extensions import db
    from app.models.user_model import User

    UPLOAD_FOLDER = "uploads/profile_images"

    @auth_bp.route('/register', methods=['POST'])
    def register():
        username = request.form.get('username')
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        gender = request.form.get('gender')
        date_of_birth = request.form.get('date_of_birth')
        bio = request.form.get('bio')

        file = request.files.get("profile_image")

        filename = None
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))

        user = User(
            username=username,
            full_name=full_name,
            email=email,
            password_hash=User.create_password(password),
            gender=gender,
            date_of_birth=date_of_birth,
            bio=bio,
            profile_image=filename   # บันทึกชื่อไฟล์ลง DB
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "Registered successfully"}
