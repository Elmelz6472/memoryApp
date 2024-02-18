import os
import subprocess

# Folder containing your .mov files
source_folder = "/Users/malikmacbook/Desktop/Pics"

# Folder to save converted .mp4 files
output_folder = "/Users/malikmacbook/Desktop/Pics"

def convert_mov_to_mp4_and_delete_source(source_file, output_file):
    """
    Convert .mov file to .mp4 using ffmpeg, preserving metadata, and delete the source file.
    """
    # FFmpeg command for conversion while attempting to preserve metadata
    cmd = [
        'ffmpeg',
        '-i', source_file,     # Input file
        '-c:v', 'copy',        # Copy video stream to avoid re-encoding
        '-c:a', 'aac',         # Convert audio to AAC
        '-strict', 'experimental',
        '-map_metadata', '0',  # Attempt to copy metadata
        output_file            # Output file
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"Converted {source_file} to {output_file}")

        # Check if the .mp4 file has been created successfully
        if os.path.isfile(output_file):
            os.remove(source_file)  # Delete the original .mov file
            print(f"Deleted source file: {source_file}")
        else:
            print(f"Conversion might not have been successful. Source file not deleted: {source_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting {source_file}: {e}")

# Main script starts here
if __name__ == "__main__":
    for filename in os.listdir(source_folder):
        if filename.lower().endswith('.mov'):
            source_path = os.path.join(source_folder, filename)
            output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.mp4')
            convert_mov_to_mp4_and_delete_source(source_path, output_path)