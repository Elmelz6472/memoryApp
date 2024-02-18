import boto3
import json
from dotenv import load_dotenv
import os



load_dotenv()

ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
SPACE_NAME = 'memories'  # Update with your Space name

# Connect to DigitalOcean Spaces
session = boto3.session.Session()
client = session.client('s3',
                        region_name='nyc3',  # Replace with your region
                        endpoint_url='https://bucket-memoryapp.nyc3.digitaloceanspaces.com',
                        aws_access_key_id=ACCESS_KEY,
                        aws_secret_access_key=SECRET_KEY)

# Function to list objects in the Space
def list_objects():
    response = client.list_objects_v2(Bucket=SPACE_NAME)
    return response['Contents'] if 'Contents' in response else []

# Convert object metadata to JSON format
def object_to_json(obj):
    return {
        'Key': obj['Key'],
        'LastModified': obj['LastModified'].isoformat(),
        'Size': obj['Size'],
        'ETag': obj['ETag'],
        'StorageClass': obj['StorageClass']
    }

# Main function
def main():
    objects = list_objects()
    json_data = [object_to_json(obj) for obj in objects]

    # Write JSON data to a file
    with open('space_contents.json', 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

if __name__ == '__main__':
    main()