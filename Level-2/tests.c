#include "code.h"

int main() {
    printf("Level 2 \n\n");
    // Creates a non-admin username called "pwned"
    user_account* ua = create_user_account(false, "pwned");
    printf("0. Non-admin (admin:%i) username called '%s' has been created \n\n", ua->isAdmin, ua->username);

    printf("1. Non-admin users like '%s' can update some dummy numerical settings \n", ua->username);
    printf("2. Non-admin users have no access to settings that can escalate themselves to admins \n\n"); 

    // Updates the setting '1' of the pwned username to the number '10'
    update_setting(ua, "1", "10");
    printf("3. Dummy setting '1' has been now set to dummy number '10' for user '%s' \n", ua->username);
    printf("4. Making sure user '%s' is not an admin by performing a check -> [Result] Admin:%i \n\n", ua->username, ua->isAdmin);

    if (ua->isAdmin == 0) 
        printf("User is not an admin so the code works as expected... is it though? \n");
        
    return 0;
}