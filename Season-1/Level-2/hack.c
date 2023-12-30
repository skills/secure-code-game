///////////////////////////////////////////////////////////////////////////
///                           	RUN HACK                      			///
/// ___________________________________________________________________ ///
///																		///
/// 	 	This file exploits the vulnerabilities in code.h 			///
///		   Running this file will fail initially (it contains			///
///	       failing tests). As all other levels, your goal is			///
///	       to get this file to pass. Run this file using:				///
///                                                      				///
///	     Run hack by opening a terminal and running the following:  	///
///        $ make Season-1/Level-2/hack && ./Season-1/Level-2/hack      ///
///										            					///
///		 As a reminder, to pass this level, both this file				///
///		 		    alongside tests.c must pass.						///
///																		///
///////////////////////////////////////////////////////////////////////////

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