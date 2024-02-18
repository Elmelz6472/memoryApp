import os
import pyheif
from PIL import Image

# Folder containing your .heic files
source_folder_heic = "/Users/malikmacbook/Desktop/heic"

# Folder to save converted .jpeg files
output_folder_jpeg = "/Users/malikmacbook/Desktop/heic"

def translate_heic_to_jpeg(source_file, output_file):
    """
    Translate .heic file to .jpeg using pyheif library.
    """
    heif_file = pyheif.read(source_file)
    image = Image.frombytes(
        heif_file.mode,
        heif_file.size,
        heif_file.data,
        "raw",
        heif_file.mode,
        heif_file.stride,
    )
    image.save(output_file, "JPEG")
    print(f"Translated {source_file} to {output_file}")

# Main script starts here
if __name__ == "__main__":
    for filename in os.listdir(source_folder_heic):
        if filename.lower().endswith('.heic'):
            source_path = os.path.join(source_folder_heic, filename)
            output_path = os.path.join(output_folder_jpeg, os.path.splitext(filename)[0] + '.jpeg')
            translate_heic_to_jpeg(source_path, output_path)
