# Install SSL Certificates in Windows

This stops browser complaining that certificate is not secure.

To create certificates run [create-ssl-certs.bat](create-ssl-certs.bat)

To install for current user only, open Certificates Manager (Start --> Run --> certmgr.msc)

To install for local computer

* Open Microsoft Management Console (Start --> Run --> mmc.exe);
* Choose File --> Add/Remove Snap-in;
* Choose the Certificates snap-in, and click Add;
* In the wizard, choose the Computer Account, and then choose Local Computer. Press Finish to end the wizard;
* Close the Add/Remove Snap-in dialog;
* Navigate to Certificates (Local Computer)

Then

* Choose Trusted Root Certification Authorities to import to:
* Right-click the store and choose All Tasks --> Import
