import boto3
import os
import json
from tinytag import TinyTag
from urllib.parse import quote  # Import urllib.parse.quote
from dotenv import load_dotenv


load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


def upload_directory_to_do_spaces(local_directory, bucket_name, spaces_directory, start_id):
    """
    Upload a local directory to a DO Space bucket and generate a JSON file.
    :param local_directory: local path to directory
    :param bucket_name: DO Bucket name
    :param spaces_directory: path in bucket to upload
    """
    # Initialize a session using DigitalOcean Spaces
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name='nyc3',
                            endpoint_url='https://bucket-memoryapp.nyc3.digitaloceanspaces.com',
                            aws_access_key_id=AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

    # Initialize an empty list to hold music data
    music_data = []

    # Enumerate local files recursively
    for root, dirs, files in os.walk(local_directory):
        files.sort(key=lambda f: os.path.getctime("{}/{}".format(root, f)))

        for filename in files:

            # construct the full local path
            local_path = os.path.join(root, filename)

            # construct the path to be used in the bucket
            relative_path = os.path.relpath(local_path, local_directory)
            s3_path = '{}/{}'.format(spaces_directory, relative_path)

            try:
                client.upload_file(Filename=local_path,
                                   Bucket=bucket_name,
                                   Key=s3_path,
                                   ExtraArgs={'ACL': 'public-read', 'ContentType': 'audio/mpeg', 'ContentDisposition': 'inline'})
                print(f"{s3_path} uploaded to {bucket_name} bucket.")

                tag = TinyTag.get(local_path)


                music_data.append({
                    "id": start_id,
                    "uri": 'https://bucket-memoryapp.nyc3.digitaloceanspaces.com/Songs/{}'.format(quote(s3_path)),  # Corrected URI
                    "album": album,
                    "artist": artist,
                    "title": filename,
                    "duration": "{}:{:02d}".format(int(tag.duration // 60), int(tag.duration % 60)),
                    "coverArt": covertArt
                })

                start_id += 1

            except Exception as e:
                print(f"Failed to upload {s3_path} to {bucket_name} bucket.")
                print(e)

    # Write to a json file
    with open('music_data.json', 'w') as f:
        json.dump(music_data, f, indent=4)


artist = input("Enter artiste name: ")
album = input("Enter album: ")
covertArt = input("Enter coverArt link: ")


upload_directory_to_do_spaces('/Users/malikmacbook/Downloads/folklore (deluxe version)', 'Songs',
                              'TaylorSwift/Folklore', start_id=16)


