echo "Setting up the API..."

# erase all directories but the api directory
find . -mindepth 1 -maxdepth 1 -type d ! -name "api" -exec rm -rf {} +
# erase all files but the api directory and the api_setup.sh file
find . -mindepth 1 -maxdepth 1 -type f ! -name "api_setup.sh" -delete
# move the api directory to the root
mv api/* api/.* . 2>/dev/null
# remove the empty api directory
rm -r api
