import os
from dotenv import load_dotenv
import boto3
from moviepy.editor import VideoFileClip
from PIL import Image
from PIL.ExifTags import TAGS
import mimetypes
import json
from datetime import datetime
from ffprobe import FFProbe
from urllib.parse import quote



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

def get_creation_date_video(file_path):
    try:
        metadata = FFProbe(file_path)
        creation_date = metadata.metadata.get('creation_time')
        if creation_date:
            return creation_date.split()[0]  # Extract only date part
        else:
            return None
    except Exception as e:
        print(f"Error while extracting creation date for {file_path}: {e}")
        return None



def get_creation_date(file_path):
    if file_path.lower().endswith(('.jpg', '.jpeg')):
        # For JPEG images, extract creation date from EXIF data
        try:
            image = Image.open(file_path)
            exif_data = image._getexif()
            creation_date = exif_data.get(36867)  # 36867 corresponds to the EXIF tag for DateTimeOriginal
            if creation_date:
                return creation_date.split()[0]  # Extract only date part
        except (AttributeError, KeyError, IndexError):
            pass
    elif file_path.lower().endswith(('.mov', '.mp4')):
        # For videos, extraction of creation date may vary based on the video format and metadata structure
        # You may need to use a library specific to the video format to extract this information
        pass

    # If creation date extraction fails or the file is not supported, return None
    return None

def get_file_attributes(file_path):
    if file_path.lower().endswith(('.jpg', '.jpeg', '.png')):
        dimensions = Image.open(file_path).size
        duration = None  # No duration for image files
        created = get_creation_date(file_path)
    elif file_path.lower().endswith(('.mov', '.mp4')):
        # For video files, you might need to implement a method to extract creation date
        clip = VideoFileClip(file_path)
        dimensions = clip.size
        duration = clip.duration
        created = get_creation_date_video(file_path)
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
            object_key = f"vlogs/{filename}"
            # with open(file_path, 'rb') as file:
            #     client.upload_fileobj(file, bucket_name, object_key,
            #                           ExtraArgs={'ACL': 'public-read',
            #                                      'ContentDisposition': 'inline',
            #                                      'ContentType': mimetype})  # Set the ContentType

            # Create URI for streaming
            uri = f"https://bucket-memoryapp.nyc3.digitaloceanspaces.com/memories/{quote(object_key)}"

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

            print(f"Uploaded {filename} to DigitalOcean Space at 'sms'")
            print(f"Dimensions: {dimensions}, Duration: {duration}, Created: {created}, ContentType: {mimetype}")
            print(f"URI for streaming: {uri}\n")

    # Save metadata list to JSON file
    with open(metadata_json_path, 'w') as json_file:
        json.dump(metadata_list, json_file, indent=2)

    print(f"Metadata saved to {metadata_json_path}")

# Example usage
upload_to_digitalocean('/Users/malikmacbook/Desktop/vlogs', 'memories', 'metadata.json')
