# Memoirs Flask backend

This is a Flask application called "Memoirs" that allows users to upload pictures of their family members, label them using Amazon Rekognition, and store the information in an SQLite database. The application uses Amazon S3 for storing images and Amazon Rekognition for face comparison.

## Features

- Upload reference images with labels.
- Upload user images.
- Use Amazon Rekognition to compare faces in user images with reference images.
- Store image URLs and labels in an SQLite database.
- Retrieve labeled images.

## Prerequisites

- Python 3.6+
- AWS Account with S3 and Rekognition services enabled.
- Amazon S3 bucket created.
- AWS credentials configured (either in environment variables or AWS credentials file).

## Installation

1. ** Setup Virtual Environement **:
```
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

2. ** Install requirements **:
```
pip install -r requirements.txt
```

3. ** Configure Environment Variables **:
```
export AWS_ACCESS_KEY_ID='your_aws_access_key_id'
export AWS_SECRET_ACCESS_KEY='your_aws_secret_access_key'
```

4. ** Initialize DB**:
```
python initialize_db.py
```

## Usage

1. **Run the Flask Application**:
   ```sh
   python app.py
   ```

2. **Access the Application**:
   Open a web browser and navigate to `http://127.0.0.1:5000/`.

## Endpoints

### Upload Reference Image

- **URL**: `/upload_reference`
- **Method**: `POST`
- **Description**: Upload a reference image with a label.
- **Request Parameters**:
  - `file`: The image file to upload.
  - `label`: The label for the reference image.

### Upload User Image

- **URL**: `/upload_user_image`
- **Method**: `POST`
- **Description**: Upload a user image.
- **Request Parameters**:
  - `file`: The image file to upload.

### Label Images

- **URL**: `/label_images`
- **Method**: `POST`
- **Description**: Label user images using Amazon Rekognition to compare faces with reference images.

### Get Labeled Images

- **URL**: `/get_labeled_images`
- **Method**: `GET`
- **Description**: Retrieve all labeled images with their labels.

## File Structure

```
memoirs/
├── app.py
├── config.py
├── initialize_db.py
├── requirements.txt
├── routes/
│   ├── __init__.py
│   ├── upload.py
│   ├── reference.py
│   └── label.py
├── test/
│   ├── __init__.py
│   ├── test_bulk_upload_concurrently.py
│   └── test_s3_utils.py
└── utils/
    ├── s3_utils.py
    └── rekognition_utils.py
```

## Configuration

### `config.py`

Contains the configuration for the application. Ensure that the correct AWS and database settings are provided.

### `initialize_db.py`

Script to initialize the SQLite database and create the necessary tables.

### `app.py`

Main Flask application file. Initializes the app, configures the database, and registers the routes.

### `routes/`

Contains the route handlers for uploading and labeling images.

### `utils/`

Contains utility functions for interacting with Amazon S3 and Rekognition.

## Testing

1. **Test S3 Utility Functions**:
   ```sh
   python test/test_s3_utils.py
   ```

2. **Test Bulk Upload**:
   ```sh
   python test/test_bulk_upload_concurrently.py
   ```
