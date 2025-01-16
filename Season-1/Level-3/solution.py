# Model solution follows

import os
from flask import Flask, request

### Unrelated to the exercise -- Starts here -- Please ignore
app = Flask(__name__)
@app.route("/")
def source():
    TaxPayer('foo', 'bar').get_tax_form_attachment(request.args["input"])
    TaxPayer('foo', 'bar').get_prof_picture(request.args["input"])
### Unrelated to the exercise -- Ends here -- Please ignore

class TaxPayer:

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.prof_picture = None
        self.tax_form_attachment = None

    # returns the path of an optional profile picture that users can set
    def get_prof_picture(self, path=None):
        # setting a profile picture is optional
        if not path:
            pass

        # builds path
        base_dir = os.path.dirname(os.path.abspath(__file__))
        prof_picture_path = os.path.normpath(os.path.join(base_dir, path))
        if not prof_picture_path.startswith(base_dir):
            return None

        with open(prof_picture_path, 'rb') as pic:
            picture = bytearray(pic.read())

        # assume that image is returned on screen after this
        return prof_picture_path

    # returns the path of an attached tax form that every user should submit
    def get_tax_form_attachment(self, path=None):
        tax_data = None

        # A tax form is required
        if not path:
            raise Exception("Error: Tax form is required for all users")

        # Validate the path to prevent path traversal attacks
        base_dir = os.path.dirname(os.path.abspath(__file__))
        tax_form_path = os.path.normpath(os.path.join(base_dir, path))
        if not tax_form_path.startswith(base_dir):
            return None

        with open(tax_form_path, 'rb') as form:
            tax_data = bytearray(form.read())

        # assume that tax data is returned on screen after this
        return tax_form_path


# Solution explanation

# Path Traversal vulnerability

# A form of injection attacks where attackers escape the intended target
# directory and manage to access parent directories.
# In the functions get_prof_picture and get_tax_form_attachment, the path
# isn't sanitized, and a user can pass invalid paths (with ../).

# Input validation seems like a good solution at first, by limiting the
# character set allowed to alphanumeric, but sometimes this approach is
# too restrictive. We might need to handle arbitrary filenames or the
# code needs to run cross-platform and account for filesystem differences
# between Windows, Macs and *nix.

# Proposed fix:
# While you could improve the string-based tests by checking for invalid
# paths (those with dot-dot etc), this approach can be risky since the
# spectrum of inputs can be infinite and attackers get really creative.

# Instead, a straightforward solution is to rely on the os.path
# library to derive the base directory instead of trusting user input.
# The user input can be later appended to the safely generated base
# directory so that the absolute filepath is normalized.

# Finally, add a check on the longest common subpath between the
# base directory and the normalized filepath to make sure that no
# traversal is about to happen and that the final path ends up in the
# intended directory.

# We covered this flaw in a blog post about OWASP's Top 10 proactive controls:
# https://github.blog/2021-12-06-write-more-secure-code-owasp-top-10-proactive-controls/


# Contribute new levels to the game in 3 simple steps!
# Read our Contribution Guideline at github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md
