import os

def safe_path(path):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = os.path.normpath(os.path.join(base_dir, path))
    if base_dir != os.path.commonpath([base_dir, filepath]):
        return None
    return filepath

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

# The GitHub Security Lab covered this flaw in one episode of Security
# Bites, its series on secure programming: https://youtu.be/sQGxdwRePh8

# We also covered this flaw in a blog post about OWASP's Top 10 proactive controls:
# https://github.blog/2021-12-06-write-more-secure-code-owasp-top-10-proactive-controls/


# Contribute new levels to the game in 3 simple steps!
# Read our Contribution Guideline at github.com/skills/secure-code-game/blob/main/CONTRIBUTING.md