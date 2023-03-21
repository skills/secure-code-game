#include "code.h"

int main() {
    printf("Level 2 \n\n");
    // Creates a non-admin username called "pwned"
    user_account* ua = create_user_account(false, "pwned");
    printf("0. Non-admin (admin:%i) username called '%s' has been created \n", ua->isAdmin, ua->username);
    
    // An outsider or an insider managed to supply the following input that originally aimed to change a dummy non-admin setting.
    update_setting(ua, "-7", "1");
    printf("1. A dummy setting has been set to dummy number '1' \n");
    printf("2. Making sure user '%s' is not an admin by performing a check -> [Result] Admin:%i \n\n", ua->username, ua->isAdmin);
    
    if (ua->isAdmin == 1)
        printf("<SOS> PRIVILEGE ESCALATION ATTACK DETECTED \n");
    
    if (ua->isAdmin == 0) 
        printf("CONGRATULATIONS LEVEL 2 PASSED!");

    return 0;
}