import os


def remove_substring_from_files(folder_path, substring):
    # List all files in the folder
    files = os.listdir(folder_path)

    # Iterate through each file
    for file_name in files:
        if file_name.endswith(".mp3"):
            # Remove the substring from the file name
            new_name = file_name.replace(substring, "")

            # Construct the full paths for old and new names
            old_path = os.path.join(folder_path, file_name)
            new_path = os.path.join(folder_path, new_name)

            # Rename the file
            os.rename(old_path, new_path)
            print(f"Renamed '{file_name}' to '{new_name}'")



folder_path = "/Users/malikmacbook/Downloads/[SPOTIFY-DOWNLOADER.COM] The College Dropout"
# substring = "[SPOTIFY-DOWNLOADER.COM]"
substring = "mp3"


remove_substring_from_files(folder_path, substring)


# https://bucket-memoryapp.nyc3.cdn.digitaloceanspaces.com/Covers/KanyeWest/CollegeDropout.png