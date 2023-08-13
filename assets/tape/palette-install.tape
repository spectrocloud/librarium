# Instructions:
# You need to replace the the variables below with your own credentials.
# Use envsubst to replace the variables in the file.
# Source a .env file with the variables or export them in your shell.
# You can use the following command to generate the file. 
# Assuming you have a .env file in the current directory.
# source .env && envsubst < palette-install.tape > palette-install-creds.tape
Require palette
Output ../../content/docs/12-enterprise-version/palette-install.mp4

Set FontSize 14
Set Width 950
Set Height 500
Set TypingSpeed 0.1
Set WindowBar Colorful
Set Margin 20
Set BorderRadius 10

Show
Type "palette ec install"
Enter
Sleep 3s
Enter
Type@500ms "n"
Sleep 2s
Enter
Type@200ms "https://saas-repo.console.spectrocloud.com"
Enter
Type@300ms "spectro"
Enter
Type "${SAAS_PROD_SCAR_REPO_PASSWORD}" # Packs Repository Password
Enter
Sleep 3s
Type "y"
Enter
Sleep 1s
Enter
Sleep 1s
Type "spectro-mgmt-cluster"
Enter
Sleep 2s
Enter  # HTTPS Proxy
Sleep 2s
Enter # HTTP Proxy
Sleep 2s
Enter # No Proxy
Sleep 2s
Enter # Proxy CA Cert
Sleep 2s
Type "172.16.0.0/20"
Enter
Sleep 2s
Type "10.155.0.0/24"
Enter
Sleep 2s
Type "y"
Enter
Sleep 2s
Type "vcenter.spectrocloud.dev"
Enter
Sleep 2s
Type "${VCENTER_USER}" # vCenter User
Enter
Sleep 2s
Type "${VCENTER_PASSWORD}" # vCenter Password
Enter
Sleep 1s
Type "y" # Allow Insecure
Enter
Sleep 4s
Enter
Sleep 4s
Type "sp-karl"
Sleep 1s
Enter
Sleep 3s
Down 1
Enter
Sleep 3s
Down 1
Enter
Sleep 3s
Enter
Sleep 3s
Enter  # VM Storage Policy
Sleep 3s
Enter # Datastore
Sleep 1s
Type "n" # Fault Domain
Sleep 2s
Enter # NPT servers
Enter
Sleep 2s # SSH Key
Escape
Type "dd"
Type "i"
Type "ssh-rsa AAAAB3NzaC1yc2EAA...."
Escape
Sleep 3s
Type@500ms ":wq"
Enter
Sleep 1s 
Type@300ms "10.1.1.0" # IP Start Range
Enter
Type@300ms "10.1.63.255" # IP End Range
Enter
Sleep 1s
Enter # Network CIDR
Type@300ms "10.10.128.1" # Gateway
Enter
Type@300ms "10.10.128.8" # DNS
Enter
Type@300ms "spectrocloud.dev"
Enter
Sleep 1s
Enter # Number of CPUs
Sleep 1s
Enter # Memory
Sleep 1s
Enter # Disk Size


Sleep 35s