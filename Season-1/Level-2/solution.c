///////////////////////////////////////////////////
///                                             ///
///   Vulnerability was in line 84 of code.h    ///
///   Fix can be found in line 83 below         ///
///                                             ///
///////////////////////////////////////////////////

#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_USERNAME_LEN 39
#define SETTINGS_COUNT 10
#define MAX_USERS 100
#define INVALID_USER_ID -1

/*
    To keep things simple, both private (implementation specific) and public (API) parts of
    the application have been bundled inside this header file. In reality, you would
    only keep the API here. That being said, assume that the private sections would not be
    known to casual users of this module.
*/

// Internal counter of user accounts.
int userid_next = 0;

// This whole structure is purely an implementation detail and is supposed to be
// unknown for normal users.
typedef struct {
    bool isAdmin;
    long userid;
    char username[MAX_USERNAME_LEN + 1];
    long setting[SETTINGS_COUNT];
} user_account;

// Simulates an internal store of active user accounts.
user_account *accounts[MAX_USERS];

// The signatures of the next 4 functions together with previously introduced constants (see #DEFINEs) 
// constitute the API of this module.

// Creates a new user account and returns it's unique identifier.
int create_user_account(bool isAdmin, const char *username) {
    if (userid_next >= MAX_USERS) {
        fprintf(stderr, "the maximum number of users have been exceeded");
        return INVALID_USER_ID;
    }    

    user_account *ua;
    if (strlen(username) > MAX_USERNAME_LEN) {
        fprintf(stderr, "the username is too long");
        return INVALID_USER_ID;
    }    
    ua = malloc(sizeof (user_account));
    if (ua == NULL) {
        fprintf(stderr, "malloc failed to allocate memory");
        return INVALID_USER_ID;
    }
    ua->isAdmin = isAdmin;
    ua->userid = userid_next++;
    strcpy(ua->username, username);
    memset(&ua->setting, 0, sizeof ua->setting);
    accounts[userid_next] = ua;
    return userid_next++;
}

// Updates the matching setting for the specified user and returns the status of the operation.
// A setting is some arbitrary string associated with an index as a key.
bool update_setting(int user_id, const char *index, const char *value) {
    if (user_id < 0 || user_id >= MAX_USERS)
        return false;

    char *endptr;
    long i, v;
    i = strtol(index, &endptr, 10);
    if (*endptr)
        return false;

    v = strtol(value, &endptr, 10);
    // FIX: Checking for negative index values, too!
    if (*endptr || i < 0 || i >= SETTINGS_COUNT)
        return false;
    accounts[user_id]->setting[i] = v;
    return true;
}

// Returns whether the specified user is an admin or not.
bool is_admin(int user_id) {
    if (user_id < 0 || user_id >= MAX_USERS) {
        fprintf(stderr, "invalid user id");
        return false;
    }    
    return accounts[user_id]->isAdmin;
}

// Returns the username of the specified user.
const char* username(int user_id) {
    // A better approach would be to signal an error.
    if (user_id < 0 || user_id >= MAX_USERS) {
        fprintf(stderr, "invalid user id");
        return NULL;
    }    
    return accounts[user_id]->username;
}

/*
    Security through Obscurity Abuse Vulnerability
    --------------------------------------------
    You may read about the concept of security through obscurity here:
    https://en.wikipedia.org/wiki/Security_through_obscurity

    In code.h the user_account structure is supposed to be an implementation
    detail not handed over to the user. Otherwise, they could easily modify the
    structure and change the isAdmin flag to true, thus gaining admin privileges.

    Nonetheless, as this example illustrates, security through obscurity alone is not enough
    to secure your system. The attacker can easily reverse engineer the code and
    find the vulnerability. This is exposed in hack.c (see below).

    Buffer Overflow Vulnerability
    ----------------------------
    In hack.c, an attacker escalated privileges and became an admin by abusing 
    the fact that the code wasn't checking for negative index values.

    Negative indexing here caused an unauthorized write to memory and affected a
    flag, changing a non-admin user to admin.
*/