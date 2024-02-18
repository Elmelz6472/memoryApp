from PIL import Image
from PIL.ExifTags import TAGS

def print_jpeg_metadata(image_path):
    try:
        # Open the image file
        with open(image_path, 'rb') as file:
            # Use Pillow to open the image
            image = Image.open(file)

            # Extract Exif data (metadata)
            exif_data = image._getexif()

            if exif_data is not None:
                print("Metadata of the JPEG picture:")
                for tag, value in exif_data.items():
                    tag_name = TAGS.get(tag, tag)
                    print(f"{tag_name}: {value}")

                # Extract the original date of creation
                original_date = exif_data.get(36867)  # 36867 corresponds to 'DateTimeOriginal' tag
                print(f"Original Date of Creation: {original_date}")

            else:
                print("No Exif data found in the image.")

    except Exception as e:
        print(f"Error: {e}")

# Replace 'your_image.jpg' with the path to your JPEG picture
image_path = '/Users/malikmacbook/Desktop/Pics/IMG_3770.jpeg'
print_jpeg_metadata(image_path)


