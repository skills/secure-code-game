////////////////////////////////////////////////////////
///                                                  ///
///   0. Perform code review. Can you spot the bug?  /// 
///   1. Run tests.c to test the functionality       ///
///   2. Run hack.c and if passing then CONGRATS!    ///
///   3. Compare your solution with solution.c       ///
///                                                  ///
////////////////////////////////////////////////////////

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
    if (i >= SETTINGS_COUNT)
        return false;
    v = strtol(value, &endptr, 10);
    if (*endptr)
        return false;
    ua->setting[i] = v;
    return true;
}