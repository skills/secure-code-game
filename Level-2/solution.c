///////////////////////////////////////////////////
///                                             ///
///   Vulnerability was in line 49 of code.h    ///               
///   Fix can be found in line 47 below         ///
///                                             ///
///////////////////////////////////////////////////

#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_USERNAME_LEN 39
#define SETTINGS_COUNT 10
int userid_next = 1;

typedef struct {
    bool isAdmin;
    long userid;
    char username[MAX_USERNAME_LEN + 1];
    long setting[SETTINGS_COUNT];
} user_account;

user_account* create_user_account(bool isAdmin, const char* username) {
    user_account* ua;
    if (strlen(username) > MAX_USERNAME_LEN) 
        return NULL;
    ua = malloc(sizeof (user_account));
    if (NULL == ua) {
        fprintf(stderr, "malloc failed to allocate memory");
        return NULL;
    }
    ua->isAdmin = isAdmin;
    ua->userid = userid_next++;
    strcpy(ua->username, username);
    memset(&ua->setting, 0, sizeof ua->setting);
    return ua;
}

bool update_setting(user_account* ua, const char *index, const char *value) {
    char *endptr;
    long i, v;
    i = strtol(index, &endptr, 10);
    if (*endptr)
        return false;
    if (i < 0 || i >= SETTINGS_COUNT) // FIX
        return false;
    v = strtol(value, &endptr, 10);
    if (*endptr)
        return false;
    ua->setting[i] = v;
    return true;
}

/*
Buffer Overflow Vulnerabilty

In hack.c, an attacker escalated privileges and became an admin by abusing 
the fact that the code wasn't checking for negative index values.

Negative indexing here caused an unauthorized write to memory and affected a
flag, changing a non-admin user to admin.
*/