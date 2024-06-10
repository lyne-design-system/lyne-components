
# We calculate the sha1 hashes of the png files in order to use it as etag values.
# This allows us to use HTTP caching mechanisms, which should reduce network traffic
# for the baseline comparison.
cd /usr/share/nginx/html/assets/screenshots

echo 'map_hash_bucket_size 32768;'
echo 'map $uri $pngetag {'
find . -type f -name '*.png' -exec bash -c 'echo "  \"${1:1}\" $(sha256sum $1 | cut -d " " -f 1);"' _ {} \;
echo '}'
