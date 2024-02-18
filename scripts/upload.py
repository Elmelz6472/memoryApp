import os
from dotenv import load_dotenv
import boto3
from moviepy.editor import VideoFileClip
from PIL import Image
import mimetypes
import json

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# Initialize a session using DigitalOcean Spaces
session = boto3.session.Session()
client = session.client('s3',
                        region_name='nyc3',
                        endpoint_url='https://bucket-memoryapp.nyc3.digitaloceanspaces.com',
                        aws_access_key_id=AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

def get_file_attributes(file_path):
    # Extracting file attributes based on file type
    if file_path.lower().endswith(('.mov', '.mp4')):
        clip = VideoFileClip(file_path)
        dimensions = clip.size
        duration = clip.duration
        created = os.path.getctime(file_path)
    elif file_path.lower().endswith(('.jpg', '.jpeg', '.png')):
        dimensions = Image.open(file_path).size
        duration = None  # No duration for image files
        created = os.path.getctime(file_path)
    else:
        dimensions = None
        duration = None
        created = None

    return dimensions, duration, created

def upload_to_digitalocean(folder_path, bucket_name, metadata_json_path):
    metadata_list = []

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            dimensions, duration, created = get_file_attributes(file_path)

            # Upload the file to DigitalOcean Space with the specified object key
            object_key = f"random/{filename}"

            # Determine ContentType based on file type
            content_type, _ = mimetypes.guess_type(file_path)
            content_type = content_type or 'application/octet-stream'

            # Generate a presigned URL and set 'Content-Disposition' to 'inline'
            presigned_url = client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': bucket_name,
                    'Key': object_key,
                    'ResponseContentDisposition': 'inline'
                },
                ExpiresIn=3600,  # Set the expiration time as needed
                HttpMethod='GET'
            )

            # Store metadata in the list
            metadata = {
                "filename": filename,
                "dimensions": dimensions,
                "duration": duration,
                "created": created,
                "content_type": content_type,
                "presigned_url": presigned_url
            }
            metadata_list.append(metadata)

            print(f"Uploaded {filename} to DigitalOcean Space at 'random'")
            print(f"Dimensions: {dimensions}, Duration: {duration}, Created: {created}")
            print(f"Content Type: {content_type}")
            print(f"Presigned URL: {presigned_url}\n")

    # Save metadata list to JSON file
    with open(metadata_json_path, 'w') as json_file:
        json.dump(metadata_list, json_file, indent=2)

    print(f"Metadata saved to {metadata_json_path}")

# Example usage
upload_to_digitalocean('/Users/malikmacbook/Desktop/TestPics', 'memories', 'metadata.json')
