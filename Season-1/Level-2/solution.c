// Vulnerability was in line 83 of code.h
// Fix can be found in line 77 below

#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_USERNAME_LEN 39
#define SETTINGS_COUNT 10
#define MAX_USERS 100
#define INVALID_USER_ID -1

// For simplicity, both the private (implementation specific) and the public (API) parts 
// of this application have been combined inside this header file. In the real-world, it
// is expected for the public (API) parts only to be presented here. Therefore, for the 
// purpose of this level, please assume that the private (implementation specific) sections 
// of this file, would not be known to the non-privileged users of this application

// Internal counter of user accounts
int userid_next = 0;

// The following structure is implementation-speicific and it's supposed to be unknown 
// to non-privileged users
typedef struct {
    bool isAdmin;
    long userid;
    char username[MAX_USERNAME_LEN + 1];
    long setting[SETTINGS_COUNT];
} user_account;

// Simulates an internal store of active user accounts
user_account *accounts[MAX_USERS];

// The signatures of the following four functions together with the previously introduced 
// constants (see #DEFINEs) constitute the API of this module

// Creates a new user account and returns it's unique identifier
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

// Updates the matching setting for the specified user and returns the status of the operation
// A setting is some arbitrary string associated with an index as a key
bool update_setting(int user_id, const char *index, const char *value) {
    if (user_id < 0 || user_id >= MAX_USERS)
        return false;

    char *endptr;
    long i, v;
    i = strtol(index, &endptr, 10);
    if (*endptr)
        return false;

    v = strtol(value, &endptr, 10);
    // FIX: We should check for negative index values too! Scroll for the full solution
    if (*endptr || i < 0 || i >= SETTINGS_COUNT)
        return false;
    accounts[user_id]->setting[i] = v;
    return true;
}

// Returns whether the specified user is an admin
bool is_admin(int user_id) {
    if (user_id < 0 || user_id >= MAX_USERS) {
        fprintf(stderr, "invalid user id");
        return false;
    }    
    return accounts[user_id]->isAdmin;
}

// Returns the username of the specified user
const char* username(int user_id) {
    // Returns an error for invalid user ids
    if (user_id < 0 || user_id >= MAX_USERS) {
        fprintf(stderr, "invalid user id");
        return NULL;
    }    
    return accounts[user_id]->username;
}

/*
    There are two vulnerabilities in this code:
  
    (1) Security through Obscurity Abuse Vulnerability
    --------------------------------------------

    The concept of security through obscurity (STO) relies on the idea that a 
    system can remain secure if something (even a vulnerability!) is secret or 
    hidden. If an attacker doesn't know what the weaknesses are, they cannot 
    exploit them. The flip side is that once that vulnerability is exposed, 
    it's no longer secure. It's widely believed that security through obscurity 
    is an ineffective security measure on its own, and should be avoided due to
    a potential single point of failure and a fall sense of security.

    In code.h the user_account structure is supposed to be an implementation
    detail that is not visible to the user. Otherwise, attackers could easily 
    modify the structure and change the 'isAdmin' flag to 'true', to gain admin 
    privileges.

    Therefore, as this example illustrates, security through obscurity alone is 
    not enough to secure a system. Attackers are in position toreverse engineer 
    the code and find the vulnerability. This is exposed in hack.c (see below).

    You can read more about the concept of security through obscurity here:
    https://securitytrails.com/blog/security-through-obscurity


    (2) Buffer Overflow Vulnerability
    ----------------------------
 
    In hack.c, an attacker escalated privileges and became an admin by abusing 
    the fact that the code wasn't checking for negative index values.

    Negative indexing here caused an unauthorized write to memory and affected a
    flag, changing a non-admin user to admin.

    You can read more about buffer overflow vulnerabilities here:
    https://owasp.org/www-community/vulnerabilities/Buffer_Overflow
*/