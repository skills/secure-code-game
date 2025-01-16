// Run tests.c by following the instructions below:

// This file contains passing tests.

// Run them by opening a terminal and running the following:
// $ make -B Season-1/Level-2/tests && ./Season-1/Level-2/tests

#include "code.h"

int main() {
    printf("Level 2 \n\n");
    // Creates a non-admin username called "pwned"
    int user1 = create_user_account(false, "pwned");
    printf("0. Non-admin (admin:%i) username called '%s' has been created \n\n", is_admin(user1), username(user1));

    printf("1. Non-admin users like '%s' can update some dummy numerical settings \n", username(user1));
    printf("2. Non-admin users have no access to settings that can escalate themselves to admins \n\n"); 

    // Updates the setting '1' of the pwned username to the number '10'
    update_setting(user1, "1", "10");
    printf("3. Dummy setting '1' has been now set to dummy number '10' for user '%s' \n", username(user1));
    printf("4. Making sure user '%s' is not an admin by performing a check -> [Result] Admin:%i \n\n", username(user1), is_admin(user1));

    if (!is_admin(user1))
        printf("User is not an admin so the code works as expected... is it though? \n");
        
    return 0;
}