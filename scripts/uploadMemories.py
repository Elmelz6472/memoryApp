import os
from dotenv import load_dotenv
import boto3
from moviepy.editor import VideoFileClip
from PIL import Image
from PIL.ExifTags import TAGS
import mimetypes
import json
from datetime import datetime

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
        created_timestamp = os.path.getctime(file_path)
        created = datetime.fromtimestamp(created_timestamp).strftime('%Y-%m-%d')
    elif file_path.lower().endswith(('.jpg', '.jpeg', '.png')):
        dimensions = Image.open(file_path).size
        duration = None  # No duration for image files
        created_timestamp = os.path.getctime(file_path)
        created = datetime.fromtimestamp(created_timestamp).strftime('%Y-%m-%d')
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

            # Determine ContentType using mimetypes
            mimetype, _ = mimetypes.guess_type(file_path)
            if mimetype is None:
                mimetype = 'application/octet-stream'  # Default to binary stream if unable to guess

            # Upload the file to DigitalOcean Space with the specified object key
            object_key = f"random/{filename}"
            # with open(file_path, 'rb') as file:
            #     client.upload_fileobj(file, bucket_name, object_key,
            #                           ExtraArgs={'ACL': 'public-read',
            #                                      'ContentDisposition': 'inline',
            #                                      'ContentType': mimetype})  # Set the ContentType

            # Create URI for streaming
            uri = f"https://bucket-memoryapp.nyc3.digitaloceanspaces.com/memories/{object_key}"

            # Store metadata in the list
            metadata = {
                "filename": filename,
                "dimensions": dimensions,
                "duration": f"{int(duration//60)}:{int(duration%60):02d}" if duration else None,
                "created": created,
                "ContentType": mimetype,  # Include the ContentType in metadata
                "uri": uri
            }
            metadata_list.append(metadata)

            print(f"Uploaded {filename} to DigitalOcean Space at 'random'")
            print(f"Dimensions: {dimensions}, Duration: {duration}, Created: {created}, ContentType: {mimetype}")
            print(f"URI for streaming: {uri}\n")

    # Save metadata list to JSON file
    with open(metadata_json_path, 'w') as json_file:
        json.dump(metadata_list, json_file, indent=2)

    print(f"Metadata saved to {metadata_json_path}")

# Example usage
upload_to_digitalocean('/Users/malikmacbook/Desktop/Pics', 'memories', 'metadata.json')
